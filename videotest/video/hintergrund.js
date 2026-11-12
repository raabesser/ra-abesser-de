/* Videoportal – virtueller Kamerahintergrund.
   Erkennt die Person im Kamerabild (MediaPipe „Selfie Segmenter“, lokal von dieser Website geladen)
   und ersetzt den Hintergrund durch ein Bild oder zeichnet ihn weich. Alles geschieht im Browser;
   das Kamerabild verlässt dafür nicht das Gerät.
   Schnittstelle: window.VideoHintergrund.start(kameraTrack, modus) -> Promise<MediaStreamTrack>
                  .setMode(modus), .stop(), .MODI */
(function () {
  "use strict";
  var BASE = new URL("mp/", document.currentScript.src).href;
  var HG = new URL("hg/", document.currentScript.src).href;
  var MODI = [
    { id: "aus", name: "Kein Hintergrund" },
    { id: "weich", name: "Weichzeichner" },
    { id: "bibliothek", name: "Bibliothek", bild: "bibliothek" },
    { id: "blau", name: "Blau", bild: "blau" },
    { id: "hellblau", name: "Hellblau", bild: "hellblau" },
    { id: "dunkelblau", name: "Dunkelblau", bild: "dunkelblau" }
  ];
  var SEG_W = 480, SEG_H = 270;   // Auflösung für die Erkennung (schont den Prozessor)
  var FPS = 30;

  var loading = null, segmenter = null;
  var video = null, out = null, octx = null, small = null, sctx = null, mask = null, mctx = null, maskData = null;
  var outTrack = null, running = false, mode = "aus", bild = null, bilder = {}, lastTs = 0, timer = null, busy = false;
  var naechster = 0, dauer = 0; // Selbstbremse: langsame Geräte rechnen seltener, die Seite bleibt bedienbar

  function laden() {
    if (loading) return loading;
    loading = import(BASE + "vision_bundle.mjs").then(function (mp) {
      return mp.FilesetResolver.forVisionTasks(BASE + "wasm").then(function (fs) {
        var opts = {
          baseOptions: { modelAssetPath: BASE + "selfie_segmenter.tflite", delegate: "GPU" },
          runningMode: "VIDEO", outputConfidenceMasks: true, outputCategoryMask: false
        };
        return mp.ImageSegmenter.createFromOptions(fs, opts).catch(function () {
          opts.baseOptions.delegate = "CPU";
          return mp.ImageSegmenter.createFromOptions(fs, opts);
        });
      });
    }).then(function (s) { segmenter = s; });
    loading.catch(function () { loading = null; });
    return loading;
  }

  function bildLaden(name) {
    if (bilder[name]) return bilder[name];
    bilder[name] = new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = rej;
      im.src = HG + name + ".jpg";
    });
    return bilder[name];
  }

  // Taktgeber in einem Worker: läuft auch weiter, wenn der Tab im Hintergrund ist.
  function taktStart() {
    if (!timer) {
      var src = "var t;onmessage=function(e){clearInterval(t);if(e.data>0)t=setInterval(function(){postMessage(0)},e.data)}";
      timer = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      timer.onmessage = frame;
    }
    timer.postMessage(Math.round(1000 / FPS));
  }

  function zeichneBild(im, W, H) {
    var r = Math.max(W / im.width, H / im.height);
    var w = im.width * r, h = im.height * r;
    octx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }

  function frame() {
    if (!running || busy || !segmenter || video.readyState < 2) return;
    var t0 = performance.now();
    if (t0 < naechster) return;
    busy = true;
    try {
      var W = out.width, H = out.height;
      sctx.drawImage(video, 0, 0, SEG_W, SEG_H);
      var ts = performance.now();
      if (ts <= lastTs) ts = lastTs + 1;
      lastTs = ts;
      var res = segmenter.segmentForVideo(small, ts);
      var cm = res && res.confidenceMasks && res.confidenceMasks[0];
      if (cm) {
        var f = cm.getAsFloat32Array(), d = maskData.data;
        for (var i = 0, j = 3; i < f.length; i++, j += 4) d[j] = f[i] * 255;
        mctx.putImageData(maskData, 0, 0);
      }
      if (res && res.close) res.close();

      // 1. Maske (weiche Kanten)  2. Person hinein  3. Hintergrund dahinter
      octx.globalCompositeOperation = "copy";
      octx.filter = "blur(3px)";
      octx.drawImage(mask, 0, 0, W, H);
      octx.filter = "none";
      octx.globalCompositeOperation = "source-in";
      octx.drawImage(video, 0, 0, W, H);
      octx.globalCompositeOperation = "destination-over";
      if (mode === "weich" || !bild) {
        octx.filter = "blur(16px)";
        octx.drawImage(video, 0, 0, W, H);
        octx.filter = "none";
      } else {
        zeichneBild(bild, W, H);
      }
      octx.globalCompositeOperation = "source-over";
    } catch (e) {
      console.warn("Hintergrund:", e);
    }
    var dt = performance.now() - t0;
    dauer = dauer ? dauer * 0.8 + dt * 0.2 : dt;
    // Höchstens etwa 60 % der Zeit für den Hintergrund verwenden
    naechster = t0 + Math.max(1000 / FPS, dauer / 0.6) - 2;
    busy = false;
  }

  function setMode(m) {
    mode = m;
    var def = MODI.filter(function (x) { return x.id === m; })[0];
    if (def && def.bild) {
      return bildLaden(def.bild).then(function (im) { if (mode === m) bild = im; });
    }
    bild = null;
    return Promise.resolve();
  }

  function start(kamera, m) {
    var s = kamera.getSettings ? kamera.getSettings() : {};
    var W = Math.min(s.width || 1280, 1280), H = Math.round(W * ((s.height || 720) / (s.width || 1280)));
    return Promise.all([laden(), setMode(m)]).then(function () {
      if (!video) {
        video = document.createElement("video");
        video.muted = true; video.playsInline = true; video.autoplay = true;
        out = document.createElement("canvas");
        octx = out.getContext("2d");
        small = document.createElement("canvas"); small.width = SEG_W; small.height = SEG_H;
        sctx = small.getContext("2d");
        mask = document.createElement("canvas"); mask.width = SEG_W; mask.height = SEG_H;
        mctx = mask.getContext("2d");
        maskData = mctx.createImageData(SEG_W, SEG_H);
        for (var i = 0; i < maskData.data.length; i += 4) { maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = 255; }
      }
      if (out.width !== W || out.height !== H || !outTrack) {
        out.width = W; out.height = H;
        if (outTrack) outTrack.stop();
        outTrack = out.captureStream(FPS).getVideoTracks()[0];
      }
      video.srcObject = new MediaStream([kamera]);
      return video.play().catch(function () {});
    }).then(function () {
      running = true;
      taktStart();
      return outTrack;
    });
  }

  function stop() {
    running = false;
    if (timer) timer.postMessage(0);
  }

  window.VideoHintergrund = { last: function () { return dauer; }, start: start, setMode: setMode, stop: stop, MODI: MODI, HG: HG };
})();
