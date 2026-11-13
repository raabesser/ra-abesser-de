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
    { id: "weich", name: "Weich\u00ADzeichner" },
    { id: "dienstzimmer", name: "Dienst\u00ADzimmer", bild: "dienstzimmer" },
    { id: "buero", name: "Büro", bild: "buero" },
    { id: "blau", name: "Blau", bild: "blau" },
    { id: "hellblau", name: "Hellblau", bild: "hellblau" },
    { id: "dunkelblau", name: "Dunkelblau", bild: "dunkelblau" }
  ];
  var SEG = 480;                  // längere Seite des Bildes für die Erkennung (schont den Prozessor)
  var MAXW = 1280;                // längere Seite des gesendeten Bildes
  var FPS = 30;

  var loading = null, segmenter = null;
  var video = null, out = null, octx = null, small = null, sctx = null, mask = null, mctx = null, maskData = null;
  var outTrack = null, running = false, mode = "aus", bild = null, bilder = {}, lastTs = 0, timer = null, busy = false;
  var hatFilter = null, klein = null, kctx = null;   // Ersatz-Weichzeichner für Browser ohne Canvas-Filter (Safari)
  var diag = { status: "nicht gestartet", technik: "", fehler: "", bilder: 0 };
  var naechster = 0, dauer = 0; // Selbstbremse: langsame Geräte rechnen seltener, die Seite bleibt bedienbar

  function frist(p, ms, text) {
    return Promise.race([p, new Promise(function (_, no) { setTimeout(function () { no(new Error(text)); }, ms); })]);
  }

  function laden() {
    if (loading) return loading;
    diag.status = "Erkennung wird geladen";
    loading = import(BASE + "vision_bundle.mjs").then(function (mp) {
      return mp.FilesetResolver.forVisionTasks(BASE + "wasm").then(function (fs) {
        var opts = {
          baseOptions: { modelAssetPath: BASE + "selfie_segmenter.tflite", delegate: "GPU" },
          runningMode: "VIDEO", outputConfidenceMasks: true, outputCategoryMask: false
        };
        // Grafikkarte zuerst; hängt oder scheitert das (manche Handys), auf den Prozessor ausweichen
        return frist(mp.ImageSegmenter.createFromOptions(fs, opts), 10000, "GPU-Zeitüberschreitung").then(function (s) {
          diag.technik = "GPU"; return s;
        }, function (e) {
          diag.fehler = "GPU: " + (e && e.message || e);
          opts.baseOptions.delegate = "CPU";
          return frist(mp.ImageSegmenter.createFromOptions(fs, opts), 20000, "CPU-Zeitüberschreitung").then(function (s) {
            diag.technik = "CPU"; return s;
          });
        });
      });
    }).then(function (s) { segmenter = s; diag.status = "bereit"; });
    loading.catch(function (e) {
      loading = null;
      diag.status = "Erkennung nicht verfügbar";
      diag.fehler = (diag.fehler ? diag.fehler + " / " : "") + (e && e.message || e);
    });
    return loading;
  }

  // Kann der Browser Canvas-Filter (blur)? Safari auf dem iPhone ignoriert sie teils stillschweigend.
  function filterTest() {
    try {
      var c = document.createElement("canvas"); c.width = c.height = 9;
      var x = c.getContext("2d");
      x.fillStyle = "#000"; x.fillRect(0, 0, 9, 9);
      x.filter = "blur(2px)";
      x.fillStyle = "#fff"; x.fillRect(4, 4, 1, 1);
      x.filter = "none";
      return x.getImageData(2, 4, 1, 1).data[0] > 0;
    } catch (e) { return false; }
  }

  // Weichzeichnen ohne Filter: stark verkleinern und wieder vergrößern
  function weichOhneFilter(quelle, W, H, faktor) {
    var w = Math.max(2, Math.round(W / faktor)), h = Math.max(2, Math.round(H / faktor));
    if (!klein) { klein = document.createElement("canvas"); kctx = klein.getContext("2d"); }
    if (klein.width !== w || klein.height !== h) { klein.width = w; klein.height = h; }
    kctx.imageSmoothingEnabled = true; kctx.imageSmoothingQuality = "high";
    kctx.drawImage(quelle, 0, 0, w, h);
    octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = "high";
    octx.drawImage(klein, 0, 0, W, H);
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

  // Maße immer aus dem tatsächlichen Kamerabild nehmen: iPhones melden im Hochformat
  // oft Querformat-Maße (getSettings), und beim Drehen ändert sich das Format.
  function masse() {
    var vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh) return;
    var r = Math.min(1, MAXW / Math.max(vw, vh));
    var W = Math.round(vw * r / 2) * 2, H = Math.round(vh * r / 2) * 2;
    if (out.width !== W || out.height !== H) { out.width = W; out.height = H; }
    var sr = SEG / Math.max(vw, vh);
    var sw = Math.round(vw * sr), sh = Math.round(vh * sr);
    if (small.width !== sw || small.height !== sh) {
      small.width = mask.width = sw; small.height = mask.height = sh;
      maskData = mctx.createImageData(sw, sh);
      for (var i = 0; i < maskData.data.length; i += 4) { maskData.data[i] = maskData.data[i + 1] = maskData.data[i + 2] = 255; }
    }
  }

  function frame() {
    if (!running || busy || !segmenter || video.readyState < 2) return;
    var t0 = performance.now();
    if (t0 < naechster) return;
    busy = true;
    try {
      masse();
      var W = out.width, H = out.height;
      sctx.drawImage(video, 0, 0, small.width, small.height);
      var ts = performance.now();
      if (ts <= lastTs) ts = lastTs + 1;
      lastTs = ts;
      var res = segmenter.segmentForVideo(small, ts);
      var cm = res && res.confidenceMasks && res.confidenceMasks[0];
      if (cm) {
        var f = cm.getAsFloat32Array(), d = maskData.data;
        var n = Math.min(f.length, d.length / 4);
        for (var i = 0, j = 3; i < n; i++, j += 4) d[j] = f[i] * 255;
        mctx.putImageData(maskData, 0, 0);
      }
      if (res && res.close) res.close();

      // 1. Maske (weiche Kanten)  2. Person hinein  3. Hintergrund dahinter
      octx.globalCompositeOperation = "copy";
      if (hatFilter) octx.filter = "blur(3px)";
      octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = "high";
      octx.drawImage(mask, 0, 0, W, H);
      if (hatFilter) octx.filter = "none";
      octx.globalCompositeOperation = "source-in";
      octx.drawImage(video, 0, 0, W, H);
      octx.globalCompositeOperation = "destination-over";
      if (mode === "weich" || !bild) {
        if (hatFilter) {
          octx.filter = "blur(16px)";
          octx.drawImage(video, 0, 0, W, H);
          octx.filter = "none";
        } else {
          weichOhneFilter(video, W, H, 28);
        }
      } else {
        zeichneBild(bild, W, H);
      }
      octx.globalCompositeOperation = "source-over";
      diag.bilder++;
      diag.status = "läuft";
    } catch (e) {
      console.warn("Hintergrund:", e);
      diag.fehler = "Bild: " + (e && e.message || e);
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
    if (hatFilter === null) hatFilter = filterTest();
    var s = kamera.getSettings ? kamera.getSettings() : {};
    var W = Math.min(s.width || MAXW, MAXW), H = Math.round(W * ((s.height || 720) / (s.width || 1280)));
    return Promise.all([laden(), setMode(m)]).then(function () {
      if (!video) {
        video = document.createElement("video");
        video.muted = true; video.playsInline = true; video.autoplay = true;
        video.setAttribute("playsinline", ""); video.setAttribute("muted", "");
        // Unsichtbar ins Dokument hängen: iPhones liefern sonst teils keine neuen Bilder
        video.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none;z-index:-1";
        document.body.appendChild(video);
        out = document.createElement("canvas");
        octx = out.getContext("2d");
        small = document.createElement("canvas"); small.width = SEG; small.height = Math.round(SEG * 9 / 16);
        sctx = small.getContext("2d");
        mask = document.createElement("canvas"); mask.width = small.width; mask.height = small.height;
        mctx = mask.getContext("2d");
        maskData = mctx.createImageData(small.width, small.height);
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

  function info() {
    var v = video ? video.videoWidth + "×" + video.videoHeight : "–";
    return "Diagnose: " + diag.status + (diag.technik ? " (" + diag.technik + ")" : "") +
      " · Filter " + (hatFilter === null ? "?" : hatFilter ? "ja" : "nein (Ersatz)") +
      " · Kamera " + v + " · Bild " + (out ? out.width + "×" + out.height : "–") +
      " · Bilder " + diag.bilder + " · " + Math.round(dauer) + " ms" +
      (diag.fehler ? " · Fehler: " + diag.fehler : "");
  }

  window.VideoHintergrund = { info: info, last: function () { return dauer; }, start: start, setMode: setMode, stop: stop, MODI: MODI, HG: HG };
})();
