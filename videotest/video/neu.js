/* Videoportal – Gesprächslink erzeugen (für die Kanzlei).
   Der Link enthält eine zufällige, nicht erratbare Raum-ID (192 Bit). Gespeichert wird nichts. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  function newId() {
    var b = new Uint8Array(24);
    crypto.getRandomValues(b);
    var s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  $("n-new").addEventListener("click", function () {
    var base = new URL("../", location.href).href; // …/video/
    var link = base + "#" + newId();
    $("n-link").value = link;
    $("n-open").href = link;
    var body =
      "Sehr geehrte Damen und Herren,\n\n" +
      "für unser Videogespräch öffnen Sie bitte zum vereinbarten Termin diesen Link:\n\n" +
      link + "\n\n" +
      "Sie benötigen kein Konto und kein Programm, nur einen aktuellen Browser (z. B. Chrome, Edge, Firefox oder Safari) " +
      "auf Computer, Tablet oder Smartphone mit Kamera und Mikrofon. Bitte geben Sie den Link nicht weiter.\n\n" +
      "Mit freundlichen Grüßen\n\nRechtsanwalt Tobias Abeßer\nKeithstr. 14, 10787 Berlin\nTel. +49 30 39 90 34 06";
    $("n-mail").href = "mailto:?subject=" + encodeURIComponent("Ihr Videotermin mit Rechtsanwalt Abeßer") +
      "&body=" + encodeURIComponent(body);
    $("n-out").hidden = false;
    $("n-msg").textContent = "";
    $("n-link").focus();
    $("n-link").select();
  });

  $("n-copy").addEventListener("click", function () {
    var v = $("n-link").value;
    var done = function () { $("n-msg").textContent = "Link wurde kopiert."; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(done, function () { $("n-link").select(); document.execCommand("copy"); done(); });
    } else { $("n-link").select(); document.execCommand("copy"); done(); }
  });
})();
