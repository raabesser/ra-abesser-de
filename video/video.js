/* Videoportal – Gesprächsseite.
   Adresse: /video/#<Raum-ID>. Ohne Raum-ID: Informationsseite mit Technik-Test.
   Bild und Ton gehen per WebRTC verschlüsselt direkt zwischen den Browsern.
   Der Server (/api/video, Cloudflare Worker) vermittelt nur den Verbindungsaufbau. */
(function () {
  "use strict";
  var API = "/api/video";
  var VALID = /^[A-Za-z0-9_-]{22,64}$/;
  var $ = function (id) { return document.getElementById(id); };

  var ICON = {
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/></svg>',
    micOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9.3V5a3 3 0 0 0-5.7-1.3M9 9v2a3 3 0 0 0 5.1 2.1M19 10v1a7 7 0 0 1-1.1 3.8M5 10v1a7 7 0 0 0 11.9 5M12 18v4M8 22h8M3 3l18 18"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10.5l6-3.5v10l-6-3.5z"/></svg>',
    camOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2M10 6h4a2 2 0 0 1 2 2v3.5l6-3.5v10M3 3l18 18"/></svg>',
    scr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M12 7v6M9 10l3-3 3 3"/></svg>',
    hg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0M5 8V6M8 8V6M16 8V6M19 8V6"/></svg>',
    end: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-3.4 0-6.6.9-9.3 2.5-.5.3-.7.9-.6 1.4l.6 2.6c.1.6.7 1 1.3.9l3.3-.5c.5-.1.9-.5 1-1l.3-1.9c1.1-.4 2.2-.5 3.4-.5s2.3.1 3.4.5l.3 1.9c.1.5.5.9 1 1l3.3.5c.6.1 1.2-.3 1.3-.9l.6-2.6c.1-.5-.1-1.1-.6-1.4C18.6 9.9 15.4 9 12 9z"/></svg>'
  };

  var roomId = location.hash.slice(1);
  var testMode = false;
  var local = null, camTrack = null, micTrack = null, screenTrack = null;
  var micOn = true, camOn = true;
  var ws = null, pc = null, polite = true, makingOffer = false, ignoreOffer = false;
  var iceServers = [{ urls: ["stun:stun.cloudflare.com:3478"] }];
  var pingTimer = null, ended = false, wakeLock = null, meterStop = null, peerThere = false;
  var rawCam = null, bgSeq = 0, HG = window.VideoHintergrund;
  var bgMode = "aus";
  try { bgMode = localStorage.getItem("v-hintergrund") || "aus"; } catch (e) {}
  if (/bibliothek/.test(bgMode)) bgMode = "dienstzimmer"; // frühere Bibliotheks-Hintergründe
  if (!HG || !HG.MODI.some(function (m) { return m.id === bgMode; })) bgMode = "aus"; // z. B. frühere, inzwischen entfernte Auswahl
  var bgOk = !!(HG && window.WebAssembly && HTMLCanvasElement.prototype.captureStream && window.Worker);

  if (!window.RTCPeerConnection || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    var info = $("v-info");
    var p = document.createElement("p");
    p.innerHTML = "<b>Hinweis:</b> Ihr Browser unterstützt keine Videogespräche. Bitte verwenden Sie einen aktuellen Browser (z. B. Chrome, Edge, Firefox oder Safari).";
    info.insertBefore(p, info.firstChild);
    $("v-test").hidden = true;
    return;
  }

  setIcons();
  if (VALID.test(roomId)) openLobby(false);
  $("v-test").addEventListener("click", function () { openLobby(true); });
  window.addEventListener("hashchange", function () { location.reload(); });

  function setIcons() {
    $("v-lmic").innerHTML = $("v-mic").innerHTML = micOn ? ICON.mic : ICON.micOff;
    $("v-lcam").innerHTML = $("v-cam").innerHTML = camOn ? ICON.cam : ICON.camOff;
    $("v-scr").innerHTML = ICON.scr;
    $("v-hgb").innerHTML = ICON.hg;
    $("v-end").innerHTML = ICON.end;
    ["v-lmic", "v-mic"].forEach(function (id) { $(id).setAttribute("aria-pressed", String(micOn)); $(id).setAttribute("aria-label", micOn ? "Mikrofon ausschalten" : "Mikrofon einschalten"); });
    ["v-lcam", "v-cam"].forEach(function (id) { $(id).setAttribute("aria-pressed", String(camOn)); $(id).setAttribute("aria-label", camOn ? "Kamera ausschalten" : "Kamera einschalten"); });
    $("v-end").setAttribute("aria-label", "Gespräch beenden");
    $("v-noc").hidden = camOn && !!camTrack;
  }

  // ---------- Vorraum ----------
  function openLobby(test) {
    testMode = test;
    $("v-info").hidden = true;
    $("v-lobby").hidden = false;
    if (test) {
      $("v-lt").innerHTML = "<b>Technik-Test</b>";
      $("v-join").hidden = true;
    }
    startMedia();
  }

  function startMedia() {
    var msg = $("v-lmsg");
    msg.textContent = "Bitte erlauben Sie Ihrem Browser den Zugriff auf Kamera und Mikrofon.";
    navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
    }).catch(function (e) {
      // Ohne Kamera erneut versuchen (z. B. Computer ohne Kamera)
      if (e && (e.name === "NotFoundError" || e.name === "OverconstrainedError" || e.name === "NotReadableError")) {
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { camOn = false; return s; });
      }
      throw e;
    }).then(function (stream) {
      local = stream;
      micTrack = stream.getAudioTracks()[0] || null;
      camTrack = stream.getVideoTracks()[0] || null;
      rawCam = camTrack;
      if (!camTrack) camOn = false;
      $("v-pv").srcObject = stream;
      if (camTrack && bgOk) { $("v-hgw").hidden = false; baueAuswahl(); if (bgMode !== "aus") applyBg(bgMode); }
      setIcons();
      startMeter(stream);
      if (testMode) {
        msg.textContent = "Sehen Sie sich im Bild und bewegt sich der grüne Balken, wenn Sie sprechen? Dann ist alles bereit.";
      } else {
        msg.textContent = camTrack ? "Kamera und Mikrofon sind bereit." : "Es wurde keine Kamera gefunden – Sie können mit Ton teilnehmen.";
        $("v-join").disabled = false;
      }
    }).catch(function (e) {
      var denied = e && (e.name === "NotAllowedError" || e.name === "SecurityError");
      msg.innerHTML = denied
        ? "<b>Kein Zugriff auf Kamera und Mikrofon.</b> Bitte erlauben Sie den Zugriff (meist über das Kamera- oder Schloss-Symbol in der Adresszeile) und laden Sie die Seite neu."
        : "<b>Kamera und Mikrofon konnten nicht gestartet werden.</b> Ist ein anderes Programm (z. B. Teams oder Zoom) geöffnet? Bitte schließen Sie es und laden Sie die Seite neu.";
      if (!testMode) {
        $("v-join").disabled = false;
        $("v-join").textContent = "Trotzdem beitreten (nur zuhören)";
      }
    });
  }

  function startMeter(stream) {
    if (!stream.getAudioTracks().length) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      var ac = new AC();
      var src = ac.createMediaStreamSource(stream);
      var an = ac.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      var buf = new Uint8Array(an.fftSize), run = true;
      (function loop() {
        if (!run) return;
        an.getByteTimeDomainData(buf);
        var max = 0;
        for (var i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i] - 128));
        $("v-lvl").style.width = Math.min(100, (max / 64) * 100 * (micOn ? 1 : 0)) + "%";
        requestAnimationFrame(loop);
      })();
      meterStop = function () { run = false; try { ac.close(); } catch (e) {} };
    } catch (e) {}
  }

  function toggleMic() {
    micOn = !micOn;
    if (micTrack) micTrack.enabled = micOn;
    setIcons();
  }
  function toggleCam() {
    if (!camTrack) return;
    camOn = !camOn;
    camTrack.enabled = camOn;
    if (rawCam) rawCam.enabled = camOn;
    setIcons();
  }
  $("v-lmic").addEventListener("click", toggleMic);
  $("v-mic").addEventListener("click", toggleMic);
  $("v-lcam").addEventListener("click", toggleCam);
  $("v-cam").addEventListener("click", toggleCam);

  // ---------- Hintergrund ----------
  function baueAuswahl() {
    ["v-hgl", "v-hgl2"].forEach(function (id) {
      var box = $(id);
      if (box.childNodes.length) return;
      HG.MODI.forEach(function (m) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "v-hgo v-hgo-" + m.id;
        b.setAttribute("data-m", m.id);
        var bild = m.bild ? '<img src="' + HG.HG + m.bild + '-k.jpg" alt="">' :
          (m.id === "weich" ? '<span class="v-ohne v-weich-i"></span>' : '<span class="v-ohne"></span>');
        b.innerHTML = bild + "<span>" + m.name + "</span>";
        b.addEventListener("click", function () { applyBg(m.id); });
        box.appendChild(b);
      });
    });
    markiere();
  }
  function markiere() {
    Array.prototype.forEach.call(document.querySelectorAll(".v-hgo"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-m") === bgMode));
    });
  }
  function setCam(t) {
    camTrack = t;
    t.enabled = camOn;
    var vs = new MediaStream([t]);
    $("v-pv").srcObject = vs;
    if (!screenTrack) { $("v-lv").srcObject = vs; replaceVideo(t); }
  }
  if (HG) HG.onTrack = function (t) { if (bgMode !== "aus") setCam(t); };
  function applyBg(m) {
    if (!rawCam || !bgOk) return;
    var my = ++bgSeq;
    bgMode = m;
    try { localStorage.setItem("v-hintergrund", m); } catch (e) {}
    markiere();
    if (m === "aus") { HG.stop(); setCam(rawCam); $("v-hgm").textContent = ""; return; }
    $("v-hgm").textContent = "Hintergrund wird geladen …";
    HG.start(rawCam, m).then(function (t) {
      if (my !== bgSeq) return;
      setCam(t);
      $("v-hgm").textContent = "";
    }).catch(function (e) {
      console.warn(e);
      if (my !== bgSeq) return;
      bgMode = "aus";
      markiere();
      HG.stop();
      setCam(rawCam);
      $("v-hgm").textContent = "Auf diesem Gerät ist kein virtueller Hintergrund möglich.";
    });
  }
  $("v-hgb").addEventListener("click", function () {
    var p = $("v-hgp"), auf = p.hidden;
    p.hidden = !auf;
    $("v-hgb").setAttribute("aria-expanded", String(auf));
  });

  // ---------- Gespräch ----------
  $("v-join").addEventListener("click", function () {
    if (meterStop) meterStop();
    $("v-call").hidden = false;
    $("v-over").hidden = true;
    document.body.classList.add("v-incall");
    $("v-lv").srcObject = camTrack ? new MediaStream([camTrack]) : local;
    $("v-hgb").hidden = !(camTrack && bgOk);
    $("v-scr").hidden = !(navigator.mediaDevices.getDisplayMedia && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && camTrack);
    status("Verbindung wird aufgebaut …");
    ended = false;
    keepAwake();
    fetch(API + "/ice", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.iceServers && j.iceServers.length) iceServers = j.iceServers;
    }).catch(function () {}).then(connect);
  });

  function status(t) { $("v-st").textContent = t || ""; }
  function send(obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }

  function connect() {
    if (ended) return;
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + API + "/raum/" + roomId);
    ws.onopen = function () {
      clearInterval(pingTimer);
      pingTimer = setInterval(function () { if (ws.readyState === 1) ws.send("ping"); }, 15000);
    };
    ws.onmessage = function (e) {
      if (e.data === "pong") return;
      var m;
      try { m = JSON.parse(e.data); } catch (err) { return; }
      handle(m);
    };
    ws.onclose = function () {
      clearInterval(pingTimer);
      if (!ended) {
        if (!pc || pc.connectionState !== "connected") status("Verbindung zum Server unterbrochen – neuer Versuch …");
        setTimeout(connect, 2000);
      }
    };
  }

  function handle(m) {
    switch (m.type) {
      case "hello":
        if (m.peers > 0) {
          polite = false;
          peerThere = true;
          status("Verbindung wird hergestellt …");
          startPC();
        } else {
          polite = true;
          peerThere = false;
          closePC();
          status("Sie sind im Gespräch. Bitte warten Sie – Ihr Gesprächspartner wird gleich zugeschaltet.");
        }
        break;
      case "peer-joined":
        peerThere = true;
        status("Verbindung wird hergestellt …");
        startPC();
        break;
      case "peer-left":
      case "bye":
        peerThere = false;
        polite = true;
        closePC();
        status("Ihr Gesprächspartner hat das Gespräch verlassen. Sie können hier warten oder auflegen.");
        break;
      case "full":
        ended = true;
        finish("In diesem Gespräch sind bereits zwei Personen. Bitte prüfen Sie, ob Sie den richtigen Link verwenden.", false);
        break;
      case "desc":
        onDesc(m.desc);
        break;
      case "cand":
        if (pc && m.cand) pc.addIceCandidate(m.cand).catch(function (err) { if (!ignoreOffer) console.warn(err); });
        break;
    }
  }

  function currentVideo() { return screenTrack || camTrack; }

  function startPC() {
    closePC();
    pc = new RTCPeerConnection({ iceServers: iceServers });
    var p = pc;
    if (micTrack) p.addTrack(micTrack, local); else p.addTransceiver("audio", { direction: "recvonly" });
    if (currentVideo()) p.addTrack(currentVideo(), local); else p.addTransceiver("video", { direction: "recvonly" });
    p.onicecandidate = function (e) { if (e.candidate && p === pc) send({ type: "cand", cand: e.candidate }); };
    p.ontrack = function (e) {
      var rv = $("v-rv");
      if (e.streams && e.streams[0]) { if (rv.srcObject !== e.streams[0]) rv.srcObject = e.streams[0]; }
      else { if (!rv.srcObject) rv.srcObject = new MediaStream(); rv.srcObject.addTrack(e.track); }
      rv.play().catch(function () {});
    };
    p.onnegotiationneeded = function () {
      makingOffer = true;
      p.setLocalDescription().then(function () {
        if (p === pc) send({ type: "desc", desc: p.localDescription });
      }).catch(function (e) { console.warn(e); }).then(function () { makingOffer = false; });
    };
    p.onconnectionstatechange = function () {
      if (p !== pc) return;
      var s = p.connectionState;
      if (s === "connected") status("");
      else if (s === "disconnected") status("Verbindung unterbrochen – bitte einen Moment Geduld …");
      else if (s === "failed") { status("Verbindung gestört – neuer Versuch …"); try { p.restartIce(); } catch (e) {} }
    };
  }

  function onDesc(desc) {
    if (!pc) startPC();
    var p = pc;
    var collision = desc.type === "offer" && (makingOffer || p.signalingState !== "stable");
    ignoreOffer = !polite && collision;
    if (ignoreOffer) return;
    p.setRemoteDescription(desc).then(function () {
      if (desc.type === "offer") {
        return p.setLocalDescription().then(function () { send({ type: "desc", desc: p.localDescription }); });
      }
    }).catch(function (e) { console.warn(e); });
  }

  function closePC() {
    if (pc) { try { pc.close(); } catch (e) {} }
    pc = null;
    makingOffer = false;
    ignoreOffer = false;
    $("v-rv").srcObject = null;
  }

  // ---------- Bildschirm teilen ----------
  $("v-scr").addEventListener("click", function () {
    if (screenTrack) return stopScreen();
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(function (s) {
      screenTrack = s.getVideoTracks()[0];
      screenTrack.onended = stopScreen;
      replaceVideo(screenTrack);
      $("v-lv").srcObject = new MediaStream([screenTrack]);
      $("v-lv").classList.add("v-screen");
      $("v-scr").setAttribute("aria-pressed", "true");
      $("v-scr").setAttribute("aria-label", "Bildschirm nicht mehr teilen");
    }).catch(function () {});
  });
  function stopScreen() {
    if (!screenTrack) return;
    screenTrack.onended = null;
    screenTrack.stop();
    screenTrack = null;
    replaceVideo(camTrack);
    $("v-lv").srcObject = camTrack ? new MediaStream([camTrack]) : local;
    $("v-lv").classList.remove("v-screen");
    $("v-scr").setAttribute("aria-pressed", "false");
    $("v-scr").setAttribute("aria-label", "Bildschirm teilen");
  }
  function replaceVideo(track) {
    if (!pc) return;
    pc.getSenders().forEach(function (s) {
      if (s.track && s.track.kind === "video") s.replaceTrack(track);
    });
  }

  // ---------- Auflegen ----------
  $("v-end").addEventListener("click", function () {
    send({ type: "bye" });
    finish("Das Gespräch ist beendet.", true);
  });
  $("v-again").addEventListener("click", function () { location.reload(); });

  function finish(text, again) {
    ended = true;
    clearInterval(pingTimer);
    if (ws) { try { ws.close(); } catch (e) {} }
    closePC();
    if (screenTrack) { screenTrack.stop(); screenTrack = null; }
    if (HG) HG.stop();
    if (local) local.getTracks().forEach(function (t) { t.stop(); });
    if (camTrack) camTrack.stop();
    $("v-hgp").hidden = true;
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
    status("");
    $("v-otxt").textContent = text;
    $("v-again").hidden = !again;
    $("v-over").hidden = false;
  }

  window.addEventListener("pagehide", function () { if (!ended) send({ type: "bye" }); });

  function keepAwake() {
    try {
      if (navigator.wakeLock) navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }).catch(function () {});
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && !ended && !$("v-call").hidden) keepAwake();
  });
})();
