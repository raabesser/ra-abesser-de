# ra-abesser.de – Betriebsanleitung

Anleitung für Rechtsanwalt Tobias Abeßer, seine Mitarbeiterin, die sich um die Website kümmert, und für KI-Assistenten wie Claude, um Website, Domain, Kontaktformular und E-Mail-Versand zu verwalten.

> **Wichtig:** Dieses Repository (der Projektordner auf GitHub) ist **öffentlich**, und alles hier – auch diese Datei und `TODOS.md` – ist zusätzlich über die Website abrufbar. Niemals Passwörter, API-Keys, Mandanten- oder andere personenbezogene Daten in Dateien dieses Repositorys oder in einen Chat schreiben. Geheimnisse gehören ausschließlich in die Dashboards von Cloudflare und Brevo.

**Aufbau:** Teil 1 ist für Tobias und die Mitarbeiterin (ohne Technik). Teil 2 ist die technische Referenz für Claude und Fortgeschrittene.

---

# Teil 1 – Für Tobias und die Mitarbeiterin

## Aktueller Stand

- Die neue Website ist fertig. Grundlage ist der Wix-Entwurf; seit 9. 11. mit blauem Hintergrund, echter Handy-Darstellung und Dokumente-Upload im Kontaktformular.
- Die Website ist seit 9. 11. unter **https://ra-abesser.de** online (Domain bei Cloudflare, Datei `CNAME` vorhanden). Die Vorschau liegt unter https://ra-abesser.de/preview/.
- Das **Kontaktformular** funktioniert (getestet 9. 11.), allerdings nur auf der echten Website, nicht in der Vorschau. Absender erhalten bewusst keine Kopie per E-Mail (Missbrauchsgefahr).
- Was offen ist und wer es erledigt: **[TODOS.md](TODOS.md)**.

## Mit Claude an der Website arbeiten

Sie brauchen keine Programmierkenntnisse. Sie schreiben Claude auf Deutsch, was Sie möchten – Claude ändert die Dateien in der Vorschau, zeigt Ihnen das Ergebnis und übernimmt es nach Freigabe durch Tobias in die echte Website.

**Empfehlung: die Claude-Desktop-App** (Mac/Windows, https://claude.ai/download). Nur dort sehen Sie die Website direkt rechts neben dem Chat. Im Webbrowser oder auf dem Handy geht das auch, Sie sehen Änderungen dann aber nur als Bilder im Chat oder erst nach dem Veröffentlichen unter https://ra-abesser.de/preview/ – das dauert pro Änderung jeweils 1–2 Minuten.

**In 3 Schritten loslegen**
1. Die Claude-Desktop-App öffnen (oder https://claude.ai/code) und mit Ihrem Konto anmelden.
2. Das Repository `raabesser/ra-abesser-de` auswählen.
3. Schreiben Sie zum Beispiel: „Was ist noch offen?“ – Claude erklärt den Stand und schlägt den nächsten Schritt vor.

Weitere Beispiele: „Zeig mir die Startseite auf dem Handy.“ · „Ändere auf der Kostenseite den Betrag für die Erstberatung auf …“ · *(Screenshot mit Markierung einfügen)* „Mach diese Überschrift kleiner.“ · „Veröffentliche das.“

**Was Claude für Sie tun kann**
- Texte, Bilder und Seiten ändern oder neue Seiten anlegen – im bestehenden Design.
- Ihnen die Website **rechts neben dem Chat in einem Browserfenster** anzeigen. Schreiben Sie einfach „Zeig mir die Website“ (oder „Zeig mir die Kostenseite“). Das geht nur in der **Claude-Desktop-App** (Mac/Windows), nicht im Webbrowser oder auf dem Handy. Sonst zeigt Claude Ihnen Bilder der Seite für Computer und Smartphone.
- Änderungen nach **Screenshots** umsetzen: Screenshot machen, die Stelle markieren (Pfeil, Kreis, kurze Notiz) und in den Chat einfügen. Empfohlenes Werkzeug auf dem Mac: **Shottr** (https://shottr.cc) – Bereich aufnehmen, direkt Pfeile/Rahmen/Text einzeichnen, in die Zwischenablage kopieren und im Chat einfügen. Unter Windows: Snipping Tool (Windows + Umschalt + S).
- **Am besten ist aber die Claude-Desktop-App mit dem Browserfenster rechts neben dem Chat:** Dort sehen Sie jede Änderung sofort live, ohne Screenshots hin- und herzuschicken. Screenshots sind vor allem praktisch, um Claude eine Stelle zu zeigen.
- Änderungen in der **Vorschau** sofort veröffentlichen und nach Tobias' Freigabe in die **echte Website** übernehmen – jeweils 1–2 Minuten später online.
- Domain-, Kontaktformular- und E-Mail-Einstellungen prüfen oder ändern (Cloudflare, Brevo) und erklären, was wo eingestellt ist.

**Gut zu wissen**
- Jede Änderung wird gespeichert und kann rückgängig gemacht werden („Mach die letzte Änderung rückgängig“).
- Schreiben Sie **niemals Passwörter oder API-Keys in den Chat**. Wenn ein Schlüssel nötig ist, sagt Claude Ihnen, in welchem Dashboard Sie ihn selbst eintragen.
- Rechtstexte (Impressum, Datenschutz) veröffentlicht Claude nur nach Ihrer Freigabe – die inhaltliche Verantwortung liegt bei Ihnen.
- Damit Claude Cloudflare und Brevo bedienen kann, müssen in claude.ai unter Einstellungen → Connectors „Cloudflare“ und „Brevo“ verbunden sein, und Ihr GitHub-Konto braucht Zugriff auf `raabesser/ra-abesser-de`. Fehlt etwas, sagt Claude Ihnen, wo Sie klicken müssen.

## So arbeiten wir: Vorschau → Freigabe → Website

| | **Vorschau** (`/preview/`, roter Balken „VORSCHAU“) | **Echte Website** |
|---|---|---|
| Zweck | Ausprobieren, Entwürfe, Design-Ideen | Was Besucher sehen |
| Wer arbeitet daran | Mitarbeiterin und Tobias, jederzeit | – (wird nur aus der Vorschau übernommen) |
| Claude veröffentlicht | **sofort, ohne Rückfrage** – nach 1–2 Minuten online unter https://ra-abesser.de/preview/ | **nur nach Freigabe durch Tobias** |
| Bei Google | nein (gesperrt) | ja |

1. **Wunsch äußern:** Sie sagen Claude, was geändert werden soll – gern mit markiertem Screenshot. Claude ändert die **Vorschau** und veröffentlicht sie gleich.
2. **Ansehen und abstimmen:** In der Desktop-App rechts im Browserfenster, sonst über den Vorschau-Link. Mitarbeiterin und Tobias können den Link jederzeit öffnen und sich gegenseitig Rückmeldung geben.
3. **Freigabe:** Tobias sagt „Vorschau veröffentlichen“ (die Mitarbeiterin kann Claude bitten, die Freigabe vorzubereiten). Claude fasst vorher in 2–3 Sätzen zusammen, was sich auf der echten Website ändert, übernimmt es dann ohne den Vorschau-Balken und prüft das Ergebnis.
4. **Rückgängig:** „Mach die letzte Veröffentlichung rückgängig“ geht jederzeit.

**Damit Sie sich nicht in die Quere kommen**
- Tobias und die Mitarbeiterin nutzen **dasselbe Claude-Konto** (das von Tobias). Sagen Sie Claude deshalb zu Beginn kurz, wer gerade schreibt („Hier ist Tobias“ bzw. „Hier ist die Mitarbeiterin“) – Claude fragt sonst nach.
- Claude holt zu Beginn jeder Sitzung den neuesten Stand und prüft, ob gerade eine andere Claude-Sitzung am Projekt arbeitet; wenn ja, stimmt es sich mit ihr ab.
- Kleine Schritte: Jede Änderung an der Vorschau wird sofort gespeichert und veröffentlicht – es bleibt nichts Halbfertiges liegen.
- In `TODOS.md` steht unter „In Arbeit“, wer gerade woran arbeitet.
- Impressum, Datenschutz und andere Rechtstexte: Inhalt und Freigabe ausschließlich durch Tobias.

## Wer macht was

| Wer | Aufgaben |
|---|---|
| **Tobias** | Inhalte und Texte, **Freigabe aller Änderungen an der echten Website**, Impressum und Datenschutz |
| **Mitarbeiterin** (Website-Betreuung) | Pflege der Website mit Claude: Änderungen in der Vorschau, Abstimmung mit Tobias, Freigabe vorbereiten |
| **Einrichtung** (wer die Konten bei Strato, Cloudflare, GitHub und Brevo betreut) | Anmeldungen, Verträge (AVV), Einstellungen, die nur im jeweiligen Dashboard gehen |
| **Claude** | Änderungen in der Vorschau (sofort veröffentlicht), Übernahme in die echte Website nach Freigabe, Prüfen und Einstellen von Cloudflare und Brevo |

## Überblick der Dienste

| Was | Wo | Zweck |
|---|---|---|
| Website-Dateien | GitHub: https://github.com/raabesser/ra-abesser-de (Hauptzweig `main`) | Reines HTML/CSS, kein Build-Schritt |
| Hosting | GitHub Pages (Repository → Settings → Pages) | Liefert die Website aus |
| Domain & DNS | Cloudflare: https://dash.cloudflare.com → `ra-abesser.de` | Nameserver, DNS, HTTPS-Zertifikat, Schutz |
| Domain-Registrar | Strato | Hier ist die Domain registriert; die Nameserver zeigen auf Cloudflare |
| E-Mail-Postfach | Strato | `info@ra-abesser.de` (Empfang und normaler Versand) |
| Kontaktformular | Cloudflare Worker `ra-abesser-kontakt` – ein kleines Programm bei Cloudflare, das das Formular verschickt | Nimmt das Formular entgegen und versendet es |
| Spamschutz | Cloudflare Turnstile (Widget „ra-abesser.de Kontakt“) | Prüft unsichtbar, ob ein Mensch das Formular absendet |
| Formular-Versand | Brevo: https://app.brevo.com | Stellt die Formular-Nachrichten per E-Mail zu |
| Design-Vorlage | Wix-Entwurf: https://info0239645.wixsite.com/aktuell (seit 9. 11. abgeschaltet) | Grundlage des Designs; nicht mehr als Vergleich verfügbar |

## So hängt alles zusammen

1. Ein Besucher ruft `https://ra-abesser.de` auf. Die Anfrage geht an **Cloudflare** (Zertifikat, Schutz, Zwischenspeicher) und von dort an **GitHub Pages**, das die Dateien aus diesem Repository ausliefert.
2. Das **Kontaktformular** (`/kontakt/`) sendet an `https://ra-abesser.de/api/kontakt`. Diese Adresse leitet Cloudflare an den **Worker** weiter.
3. Der Worker prüft die Eingaben und den **Turnstile**-Spamschutz und sendet die Nachricht über **Brevo** an `info@ra-abesser.de`. Die Adresse des Besuchers ist als „Antworten an“ eingetragen – Sie können direkt antworten.
4. Schlägt der Versand fehl, bietet das Formular dem Besucher an, die Nachricht per E-Mail zu senden.

---

# Teil 2 – Technik (für Claude und Fortgeschrittene)

## Website-Dateien

- Jede Seite ist ein Ordner mit `index.html` (z. B. `kosten/index.html`); die Startseite ist `index.html`. Unterseiten verlinken mit `../`.
- Aussehen: `style.css`. Mobilmenü (Hamburger): `site.js`. Kontaktformular im Browser: `kontakt/kontakt.js`. Bilder: `img/`.
- **Navigation, Fußzeile und Jahreszahl stehen in jeder HTML-Datei**, die Navigation sogar zweimal (Kopfzeile `<nav>` und Mobilmenü `#menu`). Bei Änderungen alle Dateien anpassen.
- **Neue Seite:** Ordner `name/index.html` anlegen (eine bestehende Unterseite als Vorlage kopieren), in allen Dateien in beiden Navigationen ergänzen, falls sie ins Menü soll.
- **Cache:** Alle Seiten laden `style.css?v=18` und `site.js?v=11`, die Kontaktseite zusätzlich `kontakt.js?v=11`. Nach Änderungen an diesen Dateien die Versionsnummer in **allen** HTML-Dateien hochzählen (z. B. `?v=19`), sonst sehen Besucher wegen des Cloudflare-Zwischenspeichers die alte Version.
- Seitentitel (Text im Browser-Tab) haben die Form „SEITENNAME | Rechtsanwalt Abeßer“. Der Wix-Seitenname „| Aktuell“ wurde auf Wunsch entfernt.
- Direkte Bearbeitung ohne Claude (für Fortgeschrittene): auf GitHub Datei öffnen → Stift-Symbol → bearbeiten → „Commit changes“.

## Design (entspricht dem Wix-Entwurf)

- Alle Maße, Schriftgrößen, Zeilenabstände und Farben sind 1:1 aus dem Wix-Entwurf übernommen (https://info0239645.wixsite.com/aktuell), gemessen bei 1440 px Fensterbreite und auf dem Smartphone.
- **Desktop:** feste Inhaltsspalte von 980 px wie bei Wix (ab 980 px Fensterbreite, also auch Tablets im Querformat). **Smartphones und Tablets unter 980 px** (Handys hoch und quer, Tablets hochkant): echtes flexibles Layout in Bildschirmbreite; zwischen 601 und 979 px mittig auf höchstens 760 px begrenzt, Bilder neben dem Text, Rechtsgebiete und Fußzeile zweispaltig. Seit 9. 11. abends (Freigabe Tobias) ohne das frühere Viewport-Skript (`width=980`), das im Querformat zu seitlichem Scrollen führte. Prüfen mit Playwright-Geräten hoch und quer (iPhone SE, iPhone 13, iPhone 15 Pro Max, Pixel 7, Galaxy S9+, iPad Mini, iPad, iPad Pro 11, Galaxy Tab S4): `document.documentElement.scrollWidth` darf nicht größer als `clientWidth` sein.
- **Seit 9. 11. abends (Freigabe Tobias):** echtes Porträtfoto auf „Der Anwalt“, Knopf „Anrufen“ (`.call`) in der Kopfzeile auf Handys/Tablets, eigene Fehlerseite `404.html`, WebP-Startbild, eigene Seitenbeschreibungen und Kanzlei-Angaben für Google.
- **Seit 9. 11. außerdem:** blauer Seitenhintergrund (CSS-Block „Blauer Hintergrund“ am Ende von `style.css`), Schriftarten lokal in `fonts/` (keine Verbindung zu Google), Google-Karte lädt erst nach Klick („Karte laden“, `site.js`), Schaltfläche „Kontakt aufnehmen“ im Startbild, `favicon.svg`, Open-Graph-Angaben und `canonical` im `<head>`, Link „Zum Inhalt springen“ für Tastaturnutzer.
- **Fehlerseite:** `404.html` im Wurzelordner (GitHub Pages zeigt sie bei jeder unbekannten Adresse). Sie nutzt **absolute** Pfade (`/style.css`, `/kontakt/` …), weil sie unter jeder Adresse erscheinen kann. Die Vorschau-Fassung `preview/404.html` verweist auf `/preview/…`; beim Veröffentlichen `/preview/` → `/` ersetzen.
- **Startbild:** `img/hero.webp` (Desktop) bzw. `img/hero-m.webp` (1200 px, Handys/Tablets), JPG als Ersatz für alte Browser (`image-set` in `style.css`). `img/hero.jpg` bleibt außerdem Vorschaubild für soziale Netzwerke (`og:image`).
- **Google:** Jede Seite hat eine eigene `description` (= `og:description`). Die Startseite enthält strukturierte Kanzlei-Angaben (`<script type="application/ld+json">`, Typ `LegalService`) – bei Änderungen von Adresse, Telefon oder Rechtsgebieten dort mit anpassen.
- Stile für Smartphones/Tablets stehen in `style.css` in den Blöcken `@media (max-width:979px)` und „Handys quer und Tablets hochkant“.
- Leere Absätze (`<p>&nbsp;</p>`) erzeugen – wie bei Wix – die Leerzeilen zwischen Abschnitten.
- Bewusste Abweichungen vom Wix-Entwurf: Der Platzhalter „Beispielinhalte:“ am Ende der Datenschutzseite fehlt. Die Datenschutzerklärung hat zusätzliche Abschnitte zu Hosting/Cloudflare, Kontaktformular/Brevo und Turnstile. Die Karte ist eine Google-Maps-Einbettung statt des Wix-Kartenwidgets. Wix-Einblend-Animationen gibt es nicht.
- Bei Layoutänderungen Desktop (1440 × 900) und Smartphone (z. B. iPhone-Emulation, ergibt das 320-px-Layout) gegen den Wix-Entwurf vergleichen.

## Vorschau

- **Wenn Tobias die Website sehen will** („Zeig mir die Website“, „Wie sieht das aus?“, nach jeder Änderung): Die Website **im Browserfenster rechts neben dem Chat** anzeigen – das ist der Standard.
  - Das Browserfenster ist der eingebaute Browser der **Claude-Desktop-App** (Werkzeuge `mcp__Claude_Browser__*` bzw. in Cloud-Sitzungen `mcp__remote-devices__Claude_Browser__*`, ggf. erst mit `enable__mcp__remote-devices__Claude_Browser` einschalten). Gewünschte Seite mit `preview_start` öffnen und Tobias in einem Satz sagen, dass sie jetzt rechts zu sehen ist.
  - Dieser Browser läuft auf Tobias' Computer und erreicht **keinen** lokalen Server (`localhost`) der Cloud-Sitzung. Er kann nur veröffentlichte Adressen öffnen: https://ra-abesser.de (Stand `main`) bzw. https://ra-abesser.de/preview/. Unveröffentlichte Änderungen deshalb per Screenshot zeigen.
  - Fehlen die Browser-Werkzeuge (Sitzung im Webbrowser oder auf dem Handy, oder nicht mit dem Computer verbunden): sofort Screenshots (Desktop 1440 × 900 und iPhone-Emulation, `deviceScaleFactor: 2`) im Chat zeigen und erklären, dass das Browserfenster nur in der Desktop-App verfügbar ist.
- **Vorschau-Kopie `preview/`:** eigenständige Kopie der Website zum Ausprobieren, online unter https://ra-abesser.de/preview/. Erkennungsmerkmale, die **nur** in `preview/` stehen dürfen: roter Balken `<div class="preview-banner">` direkt nach `<body>` (CSS-Block „VORSCHAU-BANNER“ am Ende von `preview/style.css`), `<meta name="robots" content="noindex, nofollow">` und „VORSCHAU – “ im `<title>`. Änderungen an der echten Website betreffen `preview/` nicht und umgekehrt.
- **Vorschau veröffentlichen** (wenn Tobias sagt, die Vorschau soll veröffentlicht werden): geänderte Inhalte aus `preview/` in die echte Website übernehmen und dabei **sicherstellen**, dass in den übernommenen Dateien Banner-`div`, Banner-CSS-Block, robots-`noindex` und „VORSCHAU – “ im Titel **entfernt** sind; Pfade prüfen (keine Verweise auf `preview/`); Cache-Versionen `?v=` in allen HTML-Dateien hochzählen. Danach prüfen: `grep -rn "preview-banner\|VORSCHAU\|noindex" --include=*.html --include=*.css . | grep -v "^./preview/"` darf nichts finden. `preview/` selbst bleibt mit Banner bestehen.
- **Suchmaschinen:** `robots.txt` sperrt `/preview/` (`Disallow`), `sitemap.xml` listet nur die echten Seiten unter https://ra-abesser.de/. Neue echte Seiten in `sitemap.xml` ergänzen, `preview/` dort **nie** eintragen. Hinweis: `robots.txt` wirkt nur unter der eigenen Domain (Wurzel `ra-abesser.de/robots.txt`), nicht auf github.io; dort schützt nur das `noindex`.
- **Online:** https://ra-abesser.de zeigt den Stand von `main` (Cloudflare kann bis zu einigen Minuten zwischenspeichern). https://raabesser.github.io/ra-abesser-de/ leitet auf ra-abesser.de weiter.
- **Lokal:**
  ```bash
  python3 -m http.server 8000
  ```
  im Repository-Ordner starten und http://localhost:8000 öffnen. Screenshots mit Headless-Chrome/Playwright (vorinstalliert).
- Das **Absenden des Kontaktformulars** funktioniert weder lokal noch auf github.io: Turnstile kennt nur die Domain `ra-abesser.de`, und der Worker nimmt nur Anfragen von `https://ra-abesser.de` und `https://www.ra-abesser.de` an.

## Veröffentlichen und Rückgängig machen

- Veröffentlicht ist, was auf dem Hauptzweig `main` liegt. GitHub Pages baut die Seite danach in 1–2 Minuten neu (sichtbar unter Repository → Actions → „pages build and deployment“).
- Claude-Code-Sitzungen arbeiten auf einem eigenen Zweig (`claude/…`), der auf dem aktuellen `origin/main` aufsetzt. Veröffentlichen heißt: die Änderung per Push auf `main` übernehmen (vorher `git fetch origin main` und auf `origin/main` rebasen, nie force-pushen).
- **Änderungen nur in `preview/`** (und Doku/`TODOS.md`): sofort und ohne Rückfrage auf `main` pushen, damit die Vorschau online aktuell ist.
- **Änderungen an der echten Website** (alles außerhalb von `preview/`, inkl. `robots.txt`, `sitemap.xml`, `worker/`): nur nach ausdrücklicher Freigabe durch **Tobias** auf `main`. Commits so schneiden, dass Vorschau- und Website-Änderungen getrennt sind.
- Rückgängig machen: `git revert` des betreffenden Commits auf `main`. Niemals die Historie von `main` umschreiben oder force-pushen.

## Domain, DNS und HTTPS

- **Nameserver** bei Strato: `isla.ns.cloudflare.com` und `jason.ns.cloudflare.com`. Stand in der Registry prüfen:
  ```bash
  dig NS ra-abesser.de @a.nic.de +norecurse
  ```
- **Eigene Domain bei GitHub:** Datei `CNAME` mit Inhalt `ra-abesser.de` im Repository; unter Settings → Pages muss „Custom domain“ `ra-abesser.de` lauten. Die Datei ist seit 9. 11. wieder vorhanden (Cloudflare-Zone „Active“ seit 8. 11.) – **nicht löschen**, sonst zeigt ra-abesser.de eine 404-Fehlerseite.
- **DNS** (Cloudflare → `ra-abesser.de` → DNS → Records). Vor jeder Änderung die aktuelle Liste sichern (z. B. Export).
  - Website: 4 × `A` und 4 × `AAAA` für `ra-abesser.de` auf GitHub Pages (185.199.108–111.153 bzw. 2606:50c0:8000–8003::153), `CNAME www` → `raabesser.github.io`. Alle mit orangener Wolke („Proxied“).
  - E-Mail (Strato) – **nicht ändern:** `MX` → `smtpin.rzone.de` (auch für `*`), `_dmarc` (`p=reject`), `_domainkey`, `autoconfig` (CNAME → `autoconfigure.strato.de`, graue Wolke „DNS only“), `_autodiscover`, SPF `TXT ra-abesser.de "v=spf1 redirect=smtp.rzone.de"` sowie die DKIM-Einträge `CNAME strato-dkim-0002._domainkey` → `strato-dkim-0002._domainkey.strato.de` und `strato-dkim-0003._domainkey` → `strato-dkim-0003._domainkey.strato.de` (graue Wolke). **Ohne SPF und DKIM lehnt Strato wegen `p=reject` den Versand von info@ra-abesser.de ab** (Fehlermeldung „delivery rejected because of the DMARC policy“). Diese Einträge hatte Strato früher automatisch gesetzt; beim Umzug zu Cloudflare fehlten sie und wurden am 9. 11. ergänzt.
  - Brevo-Authentifizierung – **nicht ändern:** `TXT brevo-code:…`, `CNAME brevo1._domainkey` und `brevo2._domainkey` (graue Wolke, „DNS only“).
  - Es darf nur **einen** DMARC-Eintrag geben. Den vorhandenen behalten, auch wenn Brevo einen anderen vorschlägt.
  - Der Eintrag `go.ra-abesser.de` gehört nicht zur Website; nicht ohne Rückfrage ändern.
- **Web Analytics:** Cloudflare Web Analytics für ra-abesser.de ist **aus** (automatisches Einfügen des Skripts `static.cloudflareinsights.com` deaktiviert, 9. 11.). Nicht wieder einschalten, ohne die Datenschutzerklärung (Ziffer 8: „keine Analysedienste“) anzupassen.
- **HTTPS:** Das Zertifikat stellt Cloudflare automatisch aus. Cloudflare → SSL/TLS: Modus **Full**, „Always Use HTTPS“ an, Mindestversion TLS 1.2. **Nicht** auf „Flexible“ stellen (führt mit GitHub Pages zu einer Umleitungsschleife). „Enforce HTTPS“ bei GitHub Pages ist nicht nötig, weil Cloudflare das übernimmt.

## Kontaktformular (Worker, Turnstile, Brevo)

- **Worker:** Cloudflare → Workers & Pages → `ra-abesser-kontakt`. Quelltext: `worker/kontakt.js` (ES-Modul). Repository und veröffentlichter Worker müssen übereinstimmen.
  - Routen: `ra-abesser.de/api/kontakt` und `www.ra-abesser.de/api/kontakt`.
  - Secrets (Settings → Variables and Secrets), beide vom Typ **Secret**, nie als „Text“: `BREVO_API_KEY`, `TURNSTILE_SECRET`.
  - Code ändern: `worker/kontakt.js` anpassen und hochladen – im Dashboard (Edit code) oder durch Claude über die Cloudflare-API (Skript hochladen, vorhandene Secrets/Bindings beibehalten). Danach testen.
  - **Dokumente-Upload** (seit 9. 11.): optionales Feld `anhaenge` – höchstens 5 Dateien (PDF, DOC, DOCX, JPG, PNG), zusammen 10 MB. Der Worker prüft Endung, Größe und Dateianfang („Magic Bytes“) und reicht die Dateien als Anhang an Brevo weiter; gespeichert wird nichts. Fehlercode `files` = Anhänge abgelehnt.
  - **Telefonnummer** (seit 9. 11. abends): Pflichtfeld `telefon` im Formular (nur Ziffern, Leerzeichen und `+ / . ( ) -`, 5–40 Zeichen). Der Worker nimmt es optional an (leer erlaubt, damit ältere Formularstände funktionieren), prüft das Format (Fehlercode `field`/`telefon`) und schreibt es als „Telefon:“ in die E-Mail.
  - **Doppelsendungs-Sperre** (seit 9. 11.): Dieselbe Nachricht (gleiche Absender-Adresse, Betreff, Text, Dateien) wird innerhalb von 10 Minuten nur einmal per E-Mail zugestellt; die zweite Absendung erhält `{ok: true, duplicate: true}`. Dafür speichert der Worker nur einen Prüfwert (Hash) kurzzeitig im Cloudflare-Zwischenspeicher, keinen Inhalt. Außerdem blendet `kontakt.js` das Formular nach erfolgreichem Senden aus. Rechenzeit bei 10 MB: ca. 8–21 ms (Grenze des kostenlosen Tarifs: 10 ms) – scheitern große Uploads, Grenze senken oder Workers Paid buchen.
  - Absender der Formular-Mails laut Worker: „Kontaktformular ra-abesser.de“ `<info@ra-abesser.de>`, Empfänger „Rechtsanwalt Abeßer“ `<info@ra-abesser.de>`, „Antworten an“ = Besucher.
- **Turnstile:** Cloudflare → Turnstile → Widget „ra-abesser.de Kontakt“, Modus „managed“, erlaubte Domain `ra-abesser.de`. Auf der Seite unsichtbar (`data-appearance="interaction-only"`). Der öffentliche Site Key steht in `kontakt/index.html`; das Secret liegt nur im Worker.
- **Brevo:** Domain `ra-abesser.de` unter Senders, Domains & Dedicated IPs → Domains muss „authentifiziert“ sein, sonst lehnen Empfänger die Mails wegen DMARC ab. Gesendete Mails: Transactional → Logs (Tag `kontaktformular`). Kostenloser Tarif: 300 E-Mails pro Tag.
- **Brevo-API-Key erneuern** (z. B. wenn er versehentlich weitergegeben wurde): Brevo → Profil → SMTP & API → API Keys → neuen Key erzeugen, alten löschen. Dann Cloudflare → Worker → Settings → Variables and Secrets → `BREVO_API_KEY` ersetzen → Deploy. Den Key nirgendwo sonst speichern.
- **Formular sendet nicht?**
  1. Worker-Logs ansehen (Worker → Logs/Observability).
  2. Antwort `captcha` → Turnstile-Secret oder erlaubte Domain prüfen.
  3. Antwort `config` → `BREVO_API_KEY` fehlt.
  4. Antwort `send` mit Brevo-Fehler 401 „unrecognised IP“ → in Brevo unter Sicherheit → „Autorisierte IPs“ die IP-Sperre für API-Schlüssel deaktivieren (Cloudflare Worker haben wechselnde IP-Adressen).
  5. Mails kommen nicht an → Brevo-Domain-Authentifizierung und Brevo-Logs prüfen.

## Hinweise für KI-Assistenten

**Gesprächsführung**
- Mit Claude arbeiten Tobias Abeßer (Inhaber, gibt frei) und seine Mitarbeiterin (betreut die Website). Beide kennen Claude Code noch nicht. Sprich Deutsch, sieze, vermeide Fachjargon und erkläre kurz, was du tust und warum. Beide nutzen **dasselbe Claude-Konto (Tobias')** – das Konto verrät also nicht, wer schreibt. Hat sich die Person nicht vorgestellt, zu Beginn einmal fragen, wer schreibt. Namen von Mitarbeitenden nicht in Repository-Dateien schreiben (öffentlich) – dort nur „Mitarbeiterin“.
- **Arbeitsablauf** siehe Teil 1 „So arbeiten wir“: Wünsche immer zuerst in `preview/` umsetzen und sofort veröffentlichen; in die echte Website nur auf „Vorschau veröffentlichen“ bzw. ausdrückliche Freigabe von **Tobias** übernehmen (Freigabe durch die Mitarbeiterin reicht dafür nicht; schreibt sie ausdrücklich, dass Tobias die konkreten Änderungen freigegeben hat, gilt das als seine Freigabe). Fragt die Mitarbeiterin danach: Zusammenfassung der Änderungen für Tobias vorbereiten.
- **Zu Beginn jeder Sitzung zusätzlich:** `git fetch origin main` und auf den aktuellen Stand gehen; mit `list_sessions` (Claude-Code-Remote-Werkzeuge) prüfen, ob eine andere Sitzung gerade am Repository arbeitet, und dich ggf. per `send_message` abstimmen (wer ändert welche Dateien, wer pusht wann). Abschnitt „In Arbeit“ in `TODOS.md` lesen und eigene Arbeit dort eintragen/austragen.
- **Zu Beginn jeder Sitzung, ungefragt:** `TODOS.md` lesen, den Stand in 2–3 Sätzen zusammenfassen, offene Punkte trennen in „Das müssten Sie / die Einrichtung erledigen“ und „Das kann ich sofort machen“, und mit einer konkreten Frage enden („Soll ich mit … anfangen?“). Fehlt `TODOS.md`, das sagen und die offenen Punkte aus diesem Dokument ableiten.
- **Gleich in der ersten Antwort, falls die Browser-Werkzeuge fehlen** (Sitzung im Webbrowser oder auf dem Handy): kurz die **Claude-Desktop-App** empfehlen (https://claude.ai/download), weil nur dort die Website rechts neben dem Chat angezeigt werden kann. Als Alternative nennen: weiter im Web arbeiten, Änderungen als Bilder im Chat ansehen oder veröffentlichen und unter https://ra-abesser.de/preview/ ansehen – mit dem Hinweis, dass das pro Änderung 1–2 Minuten dauert.
- **Fragt Tobias oder die Mitarbeiterin nach Screenshots** (wie man sie macht, welches Werkzeug, wie man Stellen markiert): **Shottr** empfehlen (Mac, https://shottr.cc; aufnehmen, Pfeile/Rahmen/Text einzeichnen, kopieren, in den Chat einfügen), unter Windows das Snipping Tool (Windows + Umschalt + S). Dabei immer darauf hinweisen, dass die **Claude-Desktop-App mit dem Browserfenster neben dem Chat am besten** ist, weil man Änderungen dort live sieht – Screenshots dann nur noch, um Claude eine Stelle zu zeigen.
- Live-Aktualisierung im Browserfenster: Läuft die Sitzung lokal in der Desktop-App, die Website lokal ausliefern und mit `preview_start` öffnen – Änderungen sind nach dem Neuladen sofort sichtbar. In Cloud-Sitzungen die Vorschau sofort veröffentlichen und `…/preview/` im Browserfenster neu laden (1–2 Minuten Verzögerung).
- Biete aktiv an, was möglich ist: die Website rechts im Browserfenster neben dem Chat zeigen (Desktop-App, siehe „Vorschau“; sonst Screenshots), Umsetzung markierter Screenshots, Veröffentlichen.
- Nach jeder Änderung an der Vorschau: veröffentlichen (ohne Rückfrage), dann die geänderte Seite zeigen (Browserfenster bzw. Screenshots) und fragen, ob noch etwas angepasst werden soll oder ob Tobias sie für die echte Website freigibt.
- Impressum und Datenschutzerklärung: Änderungen nur nach ausdrücklicher Freigabe durch Tobias veröffentlichen.
- Nach erledigten Aufgaben `TODOS.md` aktualisieren.

**Sicherheit und Berechtigungen**
- Keine Geheimnisse (API-Keys, Passwörter, Tokens) und keine Mandanten- oder personenbezogenen Daten in Repository-Dateien, Commits oder Chat-Antworten – Repository und Website sind öffentlich. Secrets nur über die Dashboards bzw. als Worker-Secret setzen, ohne den Wert auszugeben. Schickt jemand einen Schlüssel in den Chat: nicht verwenden, zum Löschen und Neuerzeugen raten und erklären, wo er ihn selbst einträgt.
- Erlaubte Werkzeuge ohne Rückfrage regelt `.claude/settings.json` (derzeit: Cloudflare). Der Betreiber hat außerdem erlaubt, für dieses Projekt GitHub, Cloudflare und Brevo ohne Rückfrage zu jedem Einzelschritt zu nutzen. Vor Änderungen an DNS, Worker, Turnstile oder Brevo trotzdem in einem Satz sagen, was geändert wird; bei allem, was E-Mail-Zustellung oder die Erreichbarkeit der Website gefährden kann, vorher nachfragen.
- Die Mail-DNS-Einträge (Strato MX, DMARC, DKIM, Brevo) nicht ändern.
