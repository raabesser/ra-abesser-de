// Contact form: sends to the Cloudflare Worker at /api/kontakt (Turnstile + Brevo).
// Optional documents are read in the browser, encoded as base64 and sent along.
// If sending fails, the visitor is offered to send the message by e-mail instead.
(function () {
  var f = document.getElementById("f"), sb = document.getElementById("sb"), fs = document.getElementById("fs");
  if (!f) return;
  var dt = document.getElementById("dt"), dl = document.getElementById("dl");
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
    var body = "Name: " + v("vn") + " " + v("nn") + "\nE-Mail: " + v("em") + "\n\n" + v("ms");
    if (files().length) body += "\n\n(Bitte fügen Sie Ihre Dokumente dieser E-Mail als Anhang hinzu.)";
    return "mailto:info@ra-abesser.de?subject=" + encodeURIComponent(v("bt")) + "&body=" + encodeURIComponent(body);
  }
  function fail(msg) {
    fs.innerHTML = msg + ' Alternativ können Sie Ihre Nachricht <a href="' + mailto() + '">per E-Mail senden</a>.';
    sb.disabled = false;
    if (window.turnstile) turnstile.reset();
  }
  var ERR = {
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
      var data = { vorname: v("vn"), name: v("nn"), email: v("em"), betreff: v("bt"), nachricht: v("ms"),
        consent: document.getElementById("ds").checked, token: tok };
      if (att.length) data.anhaenge = att;
      return fetch("/api/kontakt", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); }).then(function (d) {
      if (d.ok) {
        f.reset(); show(); sb.disabled = false; if (window.turnstile) turnstile.reset();
        fs.textContent = "Vielen Dank! Ihre Nachricht wurde gesendet. Rechtsanwalt Abeßer meldet sich zeitnah bei Ihnen.";
      } else fail(ERR[d.error] || ERR.send);
    }).catch(function () { fail(ERR.send); });
  });
})();
