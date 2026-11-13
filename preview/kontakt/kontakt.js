// Contact form: sends to the Cloudflare Worker at /api/kontakt (Turnstile + Brevo).
// Optional documents are read in the browser, encoded as base64 and sent along.
// If sending fails, the visitor is offered to send the message by e-mail instead.
(function () {
  var f = document.getElementById("f"), sb = document.getElementById("sb"), fs = document.getElementById("fs");
  if (!f) return;
  var dt = document.getElementById("dt"), dl = document.getElementById("dl");

  // Videoberatung anfragen (Aufruf mit ?anliegen=video): Betreff, Nachricht und Wunschtermine vorbereiten
  var vb = document.getElementById("vb"), video = /[?&]anliegen=video\b/.test(location.search) && !!vb;
  var W = ["w1", "w2", "w3"].map(function (i) { return document.getElementById(i); });
  var VIDEO_TEXT = "Sehr geehrter Herr Rechtsanwalt Abeßer,\n\nich bitte um einen Termin zur Videoberatung.\n\nWorum es geht (kurz): \n\nMit freundlichen Grüßen";
  if (video) {
    vb.hidden = false;
    W[0].required = true;
    var bt = document.getElementById("bt"), ms = document.getElementById("ms");
    if (!bt.value) bt.value = "Anfrage Videoberatung";
    if (!ms.value) ms.value = VIDEO_TEXT;
    ms.classList.add("lang");
    var n = new Date(Date.now() + 3600000), p = function (x) { return String(x).padStart(2, "0"); };
    var min = n.getFullYear() + "-" + p(n.getMonth() + 1) + "-" + p(n.getDate()) + "T" + p(n.getHours()) + ":00";
    W.forEach(function (w) { w.min = min; });
  }
  function wunsch() { return video ? W.map(function (w) { return w.value; }).filter(Boolean) : []; }
  function wunschText() {
    return wunsch().map(function (x, i) { var d = x.split("T"), t = d[0].split("-"); return (i + 1) + ". " + t[2] + "." + t[1] + "." + t[0] + ", " + d[1] + " Uhr"; }).join("\n");
  }
  var MAX_FILES = 5, MAX_TOTAL = 10 * 1024 * 1024, EXT = /\.(pdf|jpe?g|png|docx?)$/i;
  var v = function (i) { return document.getElementById(i).value.trim(); };
  var kb = function (n) { return n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1048576).toFixed(1).replace(".", ",") + " MB"; };

  function files() { return dt ? Array.prototype.slice.call(dt.files) : []; }
  function check() {
    var l = files(), total = 0;
    if (l.length > MAX_FILES) return "Bitte wählen Sie höchstens " + MAX_FILES + " Dateien aus.";
    for (var i = 0; i < l.length; i++) {
      if (!EXT.test(l[i].name)) return "Die Datei „" + l[i].name + "“ hat ein nicht erlaubtes Format. Erlaubt sind PDF, Word (DOC, DOCX), JPG und PNG.";
      total += l[i].size;
    }
    if (total > MAX_TOTAL) return "Die Dateien sind zusammen " + kb(total) + " groß. Erlaubt sind höchstens 10 MB.";
    return "";
  }
  function show() {
    if (!dl) return;
    dl.innerHTML = "";
    files().forEach(function (x) {
      var li = document.createElement("li");
      li.textContent = x.name + " (" + kb(x.size) + ")";
      dl.appendChild(li);
    });
    var err = check();
    dt.setCustomValidity(err);
    fs.textContent = err;
  }
  if (dt) dt.addEventListener("change", show);

  function read(file) {
    return new Promise(function (ok, no) {
      var r = new FileReader();
      r.onload = function () { ok({ name: file.name, content: String(r.result).split(",")[1] || "" }); };
      r.onerror = function () { no(r.error); };
      r.readAsDataURL(file);
    });
  }
  function mailto() {
    var body = "Name: " + v("vn") + " " + v("nn") + "\nE-Mail: " + v("em") + "\nTelefon: " + v("tl") + "\n\n" + v("ms");
    if (wunsch().length) body += "\n\nWunschtermine für die Videoberatung:\n" + wunschText();
    if (files().length) body += "\n\n(Bitte fügen Sie Ihre Dokumente dieser E-Mail als Anhang hinzu.)";
    return "mailto:info@ra-abesser.de?subject=" + encodeURIComponent(v("bt")) + "&body=" + encodeURIComponent(body);
  }
  function fail(msg) {
    fs.innerHTML = msg + ' Alternativ können Sie Ihre Nachricht <a href="' + mailto() + '">per E-Mail senden</a>.';
    sb.disabled = false;
    if (window.turnstile) turnstile.reset();
  }
  var ERR = {
    field: "Bitte prüfen Sie Ihre Angaben – Wunschtermine müssen in der Zukunft liegen.",
    files: "Die Dokumente wurden nicht angenommen. Bitte prüfen Sie Format (PDF, Word, JPG, PNG), Anzahl (höchstens 5) und Größe (zusammen höchstens 10 MB).",
    send: "Ihre Nachricht konnte leider nicht gesendet werden."
  };
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (dt) dt.setCustomValidity(check());
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var tok = (f.querySelector('[name="cf-turnstile-response"]') || {}).value;
    if (!tok) { fs.textContent = "Bitte einen Moment warten – die Sicherheitsprüfung läuft noch – und erneut senden."; return; }
    sb.disabled = true; fs.textContent = files().length ? "Dokumente werden hochgeladen und gesendet …" : "Wird gesendet …";
    Promise.all(files().map(read)).then(function (att) {
      var data = { vorname: v("vn"), name: v("nn"), email: v("em"), telefon: v("tl"), betreff: v("bt"), nachricht: v("ms"),
        consent: document.getElementById("ds").checked, token: tok };
      if (att.length) data.anhaenge = att;
      if (wunsch().length) data.wunschtermine = wunsch();
      return fetch("/api/kontakt", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); }).then(function (d) {
      if (d.ok) {
        // Hide the form after success so the same message is not sent twice.
        f.reset(); show(); f.classList.add("sent");
        fs.textContent = video
          ? "Vielen Dank! Ihre Anfrage zur Videoberatung wurde gesendet. Sie erhalten die Terminbestätigung mit Ihrem persönlichen Videolink per E-Mail."
          : "Vielen Dank! Ihre Nachricht wurde gesendet. Rechtsanwalt Abeßer meldet sich zeitnah bei Ihnen. Sie müssen nichts weiter tun.";
        fs.scrollIntoView({ block: "center" });
      } else fail(ERR[d.error] || ERR.send);
    }).catch(function () { fail(ERR.send); });
  });
})();
