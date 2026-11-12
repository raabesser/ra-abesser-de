# Testanleitung Videoportal (Testkopie)

Für Tobias und die Mitarbeiterin. Dauer: ca. 10 Minuten. Sie brauchen zwei Geräte: den Kanzlei-Computer (mit Kamera und Mikrofon) und ein Handy. Am besten testen Sie zu zweit in verschiedenen Räumen – sonst gibt es Rückkopplungen (Pfeifen). Allein: am Handy den Ton leise stellen oder Kopfhörer benutzen.

## 1. Link erzeugen (Kanzlei-Computer)

1. Öffnen Sie in Chrome, Edge, Firefox oder Safari: https://ra-abesser.de/videotest/video/neu/
2. Klicken Sie auf **„Neuen Gesprächslink erzeugen“**.
3. Klicken Sie auf **„Per E-Mail an Mandanten“** und schicken Sie die E-Mail an sich selbst bzw. an die Mitarbeiterin (oder: „Link kopieren“ und z. B. per Messenger schicken).

## 2. Gespräch betreten (Kanzlei-Computer)

1. Klicken Sie auf **„Gespräch jetzt öffnen“**.
2. Der Browser fragt nach Kamera und Mikrofon → **Erlauben**.
3. Im Vorraum sehen Sie sich selbst. Sprechen Sie kurz: Der grüne Balken unten links im Bild muss sich bewegen.
4. Wählen Sie unter „Ihr Hintergrund“ **„Dienstzimmer“**. Nach wenigen Sekunden sitzen Sie im Dienstzimmer.
5. Klicken Sie auf **„Gespräch beitreten“**. Oben steht: „Bitte warten Sie – Ihr Gesprächspartner wird gleich zugeschaltet.“

## 3. Als „Mandant“ teilnehmen (Handy)

1. Schalten Sie am Handy **WLAN aus**, damit über das Mobilfunknetz getestet wird.
2. Öffnen Sie die E-Mail und tippen Sie auf den Link.
3. Kamera und Mikrofon **erlauben**, dann **„Gespräch beitreten“**.

## 4. Prüfen – bitte jeweils notieren: klappt / klappt nicht

- [ ] Nach höchstens 10 Sekunden sehen und hören sich beide.
- [ ] Der Hintergrund „Dienstzimmer“ ist auf dem Handy zu sehen; die Ränder um die Person sehen ordentlich aus.
- [ ] Mikrofon-Knopf: Ton aus und wieder an (der Knopf wird weiß mit rotem Symbol, wenn aus).
- [ ] Kamera-Knopf: Bild aus und wieder an.
- [ ] Am Computer: Knopf **Bildschirm teilen** → ein Fenster wählen → das Handy sieht es. Nochmal drücken → wieder Kamerabild.
- [ ] Am Computer während des Gesprächs: Hintergrund-Knopf (Symbol mit Person) → anderen Hintergrund wählen → wechselt ohne Unterbrechung.
- [ ] Handy kurz sperren und wieder entsperren → Gespräch läuft weiter oder verbindet sich nach wenigen Sekunden neu.
- [ ] Ein drittes Gerät öffnet denselben Link → Meldung „In diesem Gespräch sind bereits zwei Personen.“
- [ ] Am Handy **auflegen** (roter Knopf) → am Computer erscheint „Ihr Gesprächspartner hat das Gespräch verlassen.“
- [ ] Optional: Test wiederholen, wenn das Handy in einem anderen WLAN ist (z. B. zu Hause).

## 5. Rückmeldung an Claude

Schreiben Sie Claude einfach, was nicht geklappt hat – am besten mit einem Screenshot der Fehlermeldung und der Angabe, welches Gerät und welcher Browser (z. B. „iPhone, Safari, Mobilfunk: kein Bild“).

**Wichtig:** Klappt die Verbindung nur im WLAN, aber nicht über Mobilfunk, fehlt sehr wahrscheinlich der TURN-Schlüssel bei Cloudflare (siehe `AGENTS.md`, Abschnitt „Testkopie mit Videoportal“).

Die Testkopie ist nicht die echte Website. Bitte noch keine echten Mandantengespräche führen, bis Tobias das Portal freigegeben hat.
