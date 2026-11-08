// Contact form: sends to the Cloudflare Worker at /api/kontakt (Turnstile + Brevo).
// If sending fails, the visitor is offered to send the message by e-mail instead.
(function () {
  var f = document.getElementById("f"), sb = document.getElementById("sb"), fs = document.getElementById("fs");
  if (!f) return;
  var v = function (i) { return document.getElementById(i).value.trim(); };
  function mailto() {
    var body = "Name: " + v("vn") + " " + v("nn") + "\nE-Mail: " + v("em") + "\n\n" + v("ms");
    return "mailto:info@ra-abesser.de?subject=" + encodeURIComponent(v("bt")) + "&body=" + encodeURIComponent(body);
  }
  function fail(msg) {
    fs.innerHTML = msg + ' Alternativ können Sie Ihre Nachricht <a href="' + mailto() + '">per E-Mail senden</a>.';
    sb.disabled = false;
    if (window.turnstile) turnstile.reset();
  }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var tok = (f.querySelector('[name="cf-turnstile-response"]') || {}).value;
    if (!tok) { fs.textContent = "Bitte einen Moment warten – die Sicherheitsprüfung läuft noch – und erneut senden."; return; }
    sb.disabled = true; fs.textContent = "Wird gesendet …";
    fetch("/api/kontakt", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ vorname: v("vn"), name: v("nn"), email: v("em"), betreff: v("bt"), nachricht: v("ms"),
        consent: document.getElementById("ds").checked, token: tok })
    }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); }).then(function (d) {
      if (d.ok) {
        f.reset(); sb.disabled = false; if (window.turnstile) turnstile.reset();
        fs.textContent = "Vielen Dank! Ihre Nachricht wurde gesendet. Rechtsanwalt Abeßer meldet sich zeitnah bei Ihnen.";
      } else fail("Ihre Nachricht konnte leider nicht gesendet werden.");
    }).catch(function () { fail("Ihre Nachricht konnte leider nicht gesendet werden."); });
  });
})();
