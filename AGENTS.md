# ra-abesser.de – Betriebsanleitung

Anleitung für Rechtsanwalt Tobias Abeßer und für KI-Assistenten wie Claude, um Website, Domain, Kontaktformular und E-Mail-Versand zu verwalten.

> **Wichtig:** Dieses Repository (der Projektordner auf GitHub) ist **öffentlich**, und alles hier – auch diese Datei und `TODOS.md` – ist zusätzlich über die Website abrufbar. Niemals Passwörter, API-Keys, Mandanten- oder andere personenbezogene Daten in Dateien dieses Repositorys oder in einen Chat schreiben. Geheimnisse gehören ausschließlich in die Dashboards von Cloudflare und Brevo.

**Aufbau:** Teil 1 ist für Tobias (ohne Technik). Teil 2 ist die technische Referenz für Claude und Fortgeschrittene.

---

# Teil 1 – Für Tobias

## Aktueller Stand

- Die neue Website ist fertig und sieht aus wie der Wix-Entwurf. Vorschau: https://raabesser.github.io/ra-abesser-de/
- Unter **ra-abesser.de** ist sie noch nicht erreichbar: Die Umstellung der Domain von Strato auf Cloudflare läuft noch. Bis dahin ist die eigene Domain bei GitHub bewusst abgeschaltet (es gibt keine Datei `CNAME`).
- Das **Kontaktformular** funktioniert erst, wenn die Website unter ra-abesser.de läuft (nicht in der Vorschau).
- Was offen ist und wer es erledigt: **[TODOS.md](TODOS.md)**.

## Mit Claude an der Website arbeiten

Sie brauchen keine Programmierkenntnisse. Sie schreiben Claude auf Deutsch, was Sie möchten – Claude ändert die Dateien, zeigt Ihnen das Ergebnis und veröffentlicht es, wenn Sie zustimmen.

**Empfehlung: die Claude-Desktop-App** (Mac/Windows, https://claude.ai/download). Nur dort sehen Sie die Website direkt rechts neben dem Chat. Im Webbrowser oder auf dem Handy geht das auch, Sie sehen Änderungen dann aber nur als Bilder im Chat oder erst nach dem Veröffentlichen unter https://raabesser.github.io/ra-abesser-de/ – das dauert pro Änderung jeweils 1–2 Minuten.

**In 3 Schritten loslegen**
1. Die Claude-Desktop-App öffnen (oder https://claude.ai/code) und mit Ihrem Konto anmelden.
2. Das Repository `raabesser/ra-abesser-de` auswählen.
3. Schreiben Sie zum Beispiel: „Was ist noch offen?“ – Claude erklärt den Stand und schlägt den nächsten Schritt vor.

Weitere Beispiele: „Zeig mir die Startseite auf dem Handy.“ · „Ändere auf der Kostenseite den Betrag für die Erstberatung auf …“ · *(Screenshot mit Markierung einfügen)* „Mach diese Überschrift kleiner.“ · „Veröffentliche das.“

**Was Claude für Sie tun kann**
- Texte, Bilder und Seiten ändern oder neue Seiten anlegen – im bestehenden Design.
- Ihnen die Website **rechts neben dem Chat in einem Browserfenster** anzeigen. Schreiben Sie einfach „Zeig mir die Website“ (oder „Zeig mir die Kostenseite“). Das geht nur in der **Claude-Desktop-App** (Mac/Windows), nicht im Webbrowser oder auf dem Handy. Sonst zeigt Claude Ihnen Bilder der Seite für Computer und Smartphone.
- Änderungen nach **Screenshots** umsetzen: Screenshot machen, die Stelle markieren (Pfeil, Kreis, kurze Notiz) und in den Chat einfügen.
- Die Änderungen **veröffentlichen** – 1–2 Minuten später sind sie online.
- Domain-, Kontaktformular- und E-Mail-Einstellungen prüfen oder ändern (Cloudflare, Brevo) und erklären, was wo eingestellt ist.

**Gut zu wissen**
- Jede Änderung wird gespeichert und kann rückgängig gemacht werden („Mach die letzte Änderung rückgängig“).
- Schreiben Sie **niemals Passwörter oder API-Keys in den Chat**. Wenn ein Schlüssel nötig ist, sagt Claude Ihnen, in welchem Dashboard Sie ihn selbst eintragen.
- Rechtstexte (Impressum, Datenschutz) veröffentlicht Claude nur nach Ihrer Freigabe – die inhaltliche Verantwortung liegt bei Ihnen.
- Damit Claude Cloudflare und Brevo bedienen kann, müssen in claude.ai unter Einstellungen → Connectors „Cloudflare“ und „Brevo“ verbunden sein, und Ihr GitHub-Konto braucht Zugriff auf `raabesser/ra-abesser-de`. Fehlt etwas, sagt Claude Ihnen, wo Sie klicken müssen.

## Wer macht was

| Wer | Aufgaben |
|---|---|
| **Tobias** | Inhalte und Texte, Freigabe von Impressum und Datenschutz, Änderungswünsche |
| **Einrichtung** (wer die Konten bei Strato, Cloudflare, GitHub und Brevo betreut) | Anmeldungen, Verträge (AVV), Einstellungen, die nur im jeweiligen Dashboard gehen |
| **Claude** | Änderungen an der Website, Vorschau, Veröffentlichen, Prüfen und Einstellen von Cloudflare und Brevo |

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
| Design-Vorlage | Wix-Entwurf: https://info0239645.wixsite.com/aktuell | Das Aussehen der Website entspricht diesem Entwurf |

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
- **Cache:** Alle Seiten laden `style.css?v=3`, `site.js?v=3` und `kontakt.js?v=3`. Nach Änderungen an diesen Dateien die Versionsnummer in **allen** HTML-Dateien hochzählen (z. B. `?v=4`), sonst sehen Besucher wegen des Cloudflare-Zwischenspeichers die alte Version.
- Seitentitel enden derzeit wie im Wix-Entwurf auf „| Aktuell“ (Name der Wix-Website); ändern nur auf Tobias' Wunsch.
- Direkte Bearbeitung ohne Claude (für Fortgeschrittene): auf GitHub Datei öffnen → Stift-Symbol → bearbeiten → „Commit changes“.

## Design (entspricht dem Wix-Entwurf)

- Alle Maße, Schriftgrößen, Zeilenabstände und Farben sind 1:1 aus dem Wix-Entwurf übernommen (https://info0239645.wixsite.com/aktuell), gemessen bei 1440 px Fensterbreite und auf dem Smartphone.
- **Desktop:** feste Inhaltsspalte von 980 px wie bei Wix. **Smartphone:** wie bei Wix ein festes 320-px-Layout, das der Browser auf die Bildschirmbreite skaliert. Das kleine Skript im `<head>` jeder Seite setzt den Viewport bei Bildschirmen unter 600 px auf `width=320`, bei Bildschirmen unter 980 px (Tablets) auf `width=980`.
- Stile für Smartphones stehen in `style.css` im Block `@media (max-width:600px)`.
- Leere Absätze (`<p>&nbsp;</p>`) erzeugen – wie bei Wix – die Leerzeilen zwischen Abschnitten.
- Bewusste Abweichungen vom Wix-Entwurf: Der Platzhalter „Beispielinhalte:“ am Ende der Datenschutzseite fehlt. Die Datenschutzerklärung hat zusätzliche Abschnitte zu Hosting/Cloudflare, Kontaktformular/Brevo und Turnstile. Die Karte ist eine Google-Maps-Einbettung statt des Wix-Kartenwidgets. Wix-Einblend-Animationen gibt es nicht.
- Bei Layoutänderungen Desktop (1440 × 900) und Smartphone (z. B. iPhone-Emulation, ergibt das 320-px-Layout) gegen den Wix-Entwurf vergleichen.

## Vorschau

- **Wenn Tobias die Website sehen will** („Zeig mir die Website“, „Wie sieht das aus?“, nach jeder Änderung): Die Website **im Browserfenster rechts neben dem Chat** anzeigen – das ist der Standard.
  - Das Browserfenster ist der eingebaute Browser der **Claude-Desktop-App** (Werkzeuge `mcp__Claude_Browser__*` bzw. in Cloud-Sitzungen `mcp__remote-devices__Claude_Browser__*`, ggf. erst mit `enable__mcp__remote-devices__Claude_Browser` einschalten). Gewünschte Seite mit `preview_start` öffnen und Tobias in einem Satz sagen, dass sie jetzt rechts zu sehen ist.
  - Dieser Browser läuft auf Tobias' Computer und erreicht **keinen** lokalen Server (`localhost`) der Cloud-Sitzung. Er kann nur veröffentlichte Adressen öffnen: https://raabesser.github.io/ra-abesser-de/ (Stand `main`) bzw. später https://ra-abesser.de. Unveröffentlichte Änderungen deshalb per Screenshot zeigen.
  - Fehlen die Browser-Werkzeuge (Sitzung im Webbrowser oder auf dem Handy, oder nicht mit dem Computer verbunden): sofort Screenshots (Desktop 1440 × 900 und iPhone-Emulation, `deviceScaleFactor: 2`) im Chat zeigen und erklären, dass das Browserfenster nur in der Desktop-App verfügbar ist.
- **Online:** https://raabesser.github.io/ra-abesser-de/ zeigt den Stand von `main` (solange die Datei `CNAME` fehlt; danach leitet die Adresse auf ra-abesser.de weiter).
- **Lokal:**
  ```bash
  python3 -m http.server 8000
  ```
  im Repository-Ordner starten und http://localhost:8000 öffnen. Screenshots mit Headless-Chrome/Playwright (vorinstalliert).
- Das **Absenden des Kontaktformulars** funktioniert weder lokal noch auf github.io: Turnstile kennt nur die Domain `ra-abesser.de`, und der Worker nimmt nur Anfragen von `https://ra-abesser.de` und `https://www.ra-abesser.de` an.

## Veröffentlichen und Rückgängig machen

- Veröffentlicht ist, was auf dem Hauptzweig `main` liegt. GitHub Pages baut die Seite danach in 1–2 Minuten neu (sichtbar unter Repository → Actions → „pages build and deployment“).
- Claude-Code-Sitzungen arbeiten auf einem eigenen Zweig (`claude/…`). Veröffentlichen heißt: die Änderung auf `main` übernehmen – per Push auf `main`, wenn Tobias „veröffentlichen“ sagt, sonst per Pull Request.
- Rückgängig machen: `git revert` des betreffenden Commits auf `main`. Niemals die Historie von `main` umschreiben oder force-pushen.

## Domain, DNS und HTTPS

- **Nameserver** bei Strato: `isla.ns.cloudflare.com` und `jason.ns.cloudflare.com`. Stand in der Registry prüfen:
  ```bash
  dig NS ra-abesser.de @a.nic.de +norecurse
  ```
- **Eigene Domain bei GitHub:** Datei `CNAME` mit Inhalt `ra-abesser.de` im Repository; unter Settings → Pages muss „Custom domain“ `ra-abesser.de` lauten. Die Datei ist derzeit **entfernt**, damit die Vorschau auf github.io funktioniert – wieder anlegen, sobald die Cloudflare-Zone „Active“ ist.
- **DNS** (Cloudflare → `ra-abesser.de` → DNS → Records). Vor jeder Änderung die aktuelle Liste sichern (z. B. Export).
  - Website: 4 × `A` und 4 × `AAAA` für `ra-abesser.de` auf GitHub Pages (185.199.108–111.153 bzw. 2606:50c0:8000–8003::153), `CNAME www` → `raabesser.github.io`. Alle mit orangener Wolke („Proxied“).
  - E-Mail (Strato) – **nicht ändern:** `MX` → `smtpin.rzone.de` (auch für `*`), `_dmarc` (`p=reject`), `_domainkey`, `autoconfig`, `_autodiscover`.
  - Brevo-Authentifizierung – **nicht ändern:** `TXT brevo-code:…`, `CNAME brevo1._domainkey` und `brevo2._domainkey` (graue Wolke, „DNS only“).
  - Es darf nur **einen** DMARC-Eintrag geben. Den vorhandenen behalten, auch wenn Brevo einen anderen vorschlägt.
  - Der Eintrag `go.ra-abesser.de` gehört nicht zur Website; nicht ohne Rückfrage ändern.
- **HTTPS:** Das Zertifikat stellt Cloudflare automatisch aus. Cloudflare → SSL/TLS: Modus **Full**, „Always Use HTTPS“ an, Mindestversion TLS 1.2. **Nicht** auf „Flexible“ stellen (führt mit GitHub Pages zu einer Umleitungsschleife). „Enforce HTTPS“ bei GitHub Pages ist nicht nötig, weil Cloudflare das übernimmt.

## Kontaktformular (Worker, Turnstile, Brevo)

- **Worker:** Cloudflare → Workers & Pages → `ra-abesser-kontakt`. Quelltext: `worker/kontakt.js` (ES-Modul). Repository und veröffentlichter Worker müssen übereinstimmen.
  - Routen: `ra-abesser.de/api/kontakt` und `www.ra-abesser.de/api/kontakt`.
  - Secrets (Settings → Variables and Secrets), beide vom Typ **Secret**, nie als „Text“: `BREVO_API_KEY`, `TURNSTILE_SECRET`.
  - Code ändern: `worker/kontakt.js` anpassen und hochladen – im Dashboard (Edit code) oder durch Claude über die Cloudflare-API (Skript hochladen, vorhandene Secrets/Bindings beibehalten). Danach testen.
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
- Tobias Abeßer kennt Claude Code noch nicht. Sprich Deutsch, sieze ihn, vermeide Fachjargon und erkläre kurz, was du tust und warum.
- **Zu Beginn jeder Sitzung, ungefragt:** `TODOS.md` lesen, den Stand in 2–3 Sätzen zusammenfassen, offene Punkte trennen in „Das müssten Sie / die Einrichtung erledigen“ und „Das kann ich sofort machen“, und mit einer konkreten Frage enden („Soll ich mit … anfangen?“). Fehlt `TODOS.md`, das sagen und die offenen Punkte aus diesem Dokument ableiten.
- **Gleich in der ersten Antwort, falls die Browser-Werkzeuge fehlen** (Sitzung im Webbrowser oder auf dem Handy): kurz die **Claude-Desktop-App** empfehlen (https://claude.ai/download), weil nur dort die Website rechts neben dem Chat angezeigt werden kann. Als Alternative nennen: weiter im Web arbeiten, Änderungen als Bilder im Chat ansehen oder veröffentlichen und unter https://raabesser.github.io/ra-abesser-de/ ansehen – mit dem Hinweis, dass das pro Änderung 1–2 Minuten dauert.
- Biete aktiv an, was möglich ist: die Website rechts im Browserfenster neben dem Chat zeigen (Desktop-App, siehe „Vorschau“; sonst Screenshots), Umsetzung markierter Screenshots, Veröffentlichen.
- Nach jeder Änderung: die geänderte Seite zeigen (Screenshots; nach dem Veröffentlichen auch im Browserfenster) und fragen „Veröffentlichen?“ (außer bei reinen Tippfehlern, wenn Tobias das so möchte).
- Impressum und Datenschutzerklärung: Änderungen nur nach ausdrücklicher Freigabe durch Tobias veröffentlichen.
- Nach erledigten Aufgaben `TODOS.md` aktualisieren.

**Sicherheit und Berechtigungen**
- Keine Geheimnisse (API-Keys, Passwörter, Tokens) und keine Mandanten- oder personenbezogenen Daten in Repository-Dateien, Commits oder Chat-Antworten – Repository und Website sind öffentlich. Secrets nur über die Dashboards bzw. als Worker-Secret setzen, ohne den Wert auszugeben. Schickt jemand einen Schlüssel in den Chat: nicht verwenden, zum Löschen und Neuerzeugen raten und erklären, wo er ihn selbst einträgt.
- Erlaubte Werkzeuge ohne Rückfrage regelt `.claude/settings.json` (derzeit: Cloudflare). Der Betreiber hat außerdem erlaubt, für dieses Projekt GitHub, Cloudflare und Brevo ohne Rückfrage zu jedem Einzelschritt zu nutzen. Vor Änderungen an DNS, Worker, Turnstile oder Brevo trotzdem in einem Satz sagen, was geändert wird; bei allem, was E-Mail-Zustellung oder die Erreichbarkeit der Website gefährden kann, vorher nachfragen.
- Die Mail-DNS-Einträge (Strato MX, DMARC, DKIM, Brevo) nicht ändern.
