# ra-abesser.de – Betriebsanleitung

Anleitung für Rechtsanwalt Tobias Abeßer (und für KI-Assistenten wie Claude), um Website, Domain, Kontaktformular und E-Mail-Versand selbst zu verwalten.

> **Wichtig:** Dieses Repository ist **öffentlich**, und alles hier wird auch auf der Website ausgeliefert. Niemals Passwörter, API-Keys oder andere Geheimnisse in Dateien dieses Repositorys oder in einen Chat schreiben. Geheimnisse gehören ausschließlich in die jeweiligen Dashboards (Cloudflare, Brevo).

## Mit Claude an der Website arbeiten (für Tobias)

Sie brauchen keine Programmierkenntnisse. Sie schreiben Claude auf Deutsch, was Sie möchten – Claude ändert die Dateien, zeigt Ihnen das Ergebnis und veröffentlicht es auf Ihren Wunsch.

**So starten Sie**
- **Im Browser:** https://claude.ai/code öffnen, das Repository `raabesser/ra-abesser-de` auswählen und losschreiben, z. B. „Was ist noch offen?“ oder „Ändere auf der Kostenseite den Betrag für die Erstberatung auf …“.
- **In der Claude-Desktop-App (Mac/Windows):** Dort kann Claude die Website zusätzlich in einem Browserfenster direkt neben dem Chat anzeigen, sodass Sie jede Änderung sofort sehen, bevor sie online geht.

**Was Claude für Sie tun kann**
- Texte, Bilder und Seiten ändern oder neue Seiten anlegen – im bestehenden Design.
- Eine **Vorschau** zeigen, bevor etwas veröffentlicht wird (Desktop- und Smartphone-Ansicht).
- Änderungen nach **Screenshots** umsetzen: Machen Sie einen Screenshot, markieren Sie die Stelle (Pfeil, Kreis, kurze Notiz) und fügen Sie ihn in den Chat ein.
- Die Seite **veröffentlichen** – 1–2 Minuten später ist sie online.
- Domain-, DNS-, Kontaktformular- und E-Mail-Einstellungen prüfen oder ändern (Cloudflare, Brevo).
- Erklären, was wo eingestellt ist, und die nächsten Schritte vorschlagen.

**Gut zu wissen**
- Jede Änderung wird gespeichert und kann rückgängig gemacht werden („Mach die letzte Änderung rückgängig“).
- Schreiben Sie **niemals Passwörter oder API-Keys in den Chat**. Wenn ein Schlüssel nötig ist, sagt Claude Ihnen, in welchem Dashboard Sie ihn selbst eintragen.
- Rechtstexte (Impressum, Datenschutz) ändert Claude nur nach Ihrer Freigabe – die inhaltliche Verantwortung liegt bei Ihnen.

## Überblick

| Was | Wo | Zweck |
|---|---|---|
| Website-Dateien | GitHub: https://github.com/raabesser/ra-abesser-de (Branch `main`) | Reines HTML/CSS, kein Build-Schritt |
| Hosting | GitHub Pages (Repo → Settings → Pages) | Liefert die Website aus |
| Domain & DNS | Cloudflare: https://dash.cloudflare.com → `ra-abesser.de` | Nameserver, DNS, HTTPS-Zertifikat, Schutz |
| Domain-Registrar | Strato | Hier ist die Domain registriert; die Nameserver zeigen auf Cloudflare |
| E-Mail-Postfach | Strato | `info@ra-abesser.de` (Empfang und normaler Versand) |
| Kontaktformular-Backend | Cloudflare Worker `ra-abesser-kontakt` (Quelltext: `worker/kontakt.js`) | Nimmt das Formular entgegen und versendet es |
| Spamschutz | Cloudflare Turnstile (Widget „ra-abesser.de Kontakt“) | Prüft, ob ein Mensch das Formular absendet |
| Formular-Versand | Brevo: https://app.brevo.com | Stellt die Formular-Nachrichten per E-Mail zu |
| Design-Vorlage | Wix-Entwurf: https://info0239645.wixsite.com/aktuell | Das Aussehen der Website soll diesem Entwurf entsprechen |

## So hängt alles zusammen

1. Ein Besucher ruft `https://ra-abesser.de` auf. Die Anfrage geht an **Cloudflare** (Zertifikat, Schutz, Zwischenspeicher) und von dort an **GitHub Pages**, das die Dateien aus diesem Repository ausliefert.
2. Das **Kontaktformular** (`/kontakt/`) sendet an `https://ra-abesser.de/api/kontakt`. Diese Adresse wird von Cloudflare an den **Worker** weitergeleitet.
3. Der Worker prüft die Eingaben und den **Turnstile**-Spamschutz und sendet die Nachricht über **Brevo** an `info@ra-abesser.de`. Die Absenderadresse des Besuchers ist als „Antworten an“ eingetragen, sodass Sie direkt antworten können.
4. Schlägt der Versand fehl, bietet das Formular dem Besucher an, die Nachricht per E-Mail zu senden.

## Häufige Aufgaben

### Texte oder Seiten der Website ändern
- Jede Seite ist eine Datei `…/index.html` (z. B. `kosten/index.html`), das Aussehen steht in `style.css`.
- Änderungen direkt auf GitHub: Datei öffnen → Stift-Symbol → bearbeiten → „Commit changes“. Nach 1–2 Minuten ist die Änderung online.
- Oder einen KI-Assistenten (z. B. Claude Code) beauftragen; er liest diese Datei.
- Bilder liegen in `img/`.

### Design (entspricht dem Wix-Entwurf)
- Alle Maße, Schriftgrößen, Zeilenabstände und Farben sind 1:1 aus dem Wix-Entwurf übernommen (https://info0239645.wixsite.com/aktuell), gemessen bei 1440 px Fensterbreite und auf dem Smartphone.
- **Desktop:** feste Inhaltsspalte von 980 px wie bei Wix. **Smartphone:** wie bei Wix ein festes 320-px-Layout, das der Browser auf die Bildschirmbreite skaliert (gesteuert über das kleine Skript im `<head>` jeder Seite, das den Viewport auf `width=320` setzt). Tablets zeigen das Desktop-Layout verkleinert.
- Stile für Smartphones stehen in `style.css` im Block `@media (max-width:600px)`.
- Das Mobilmenü (Hamburger) steuert `site.js`, das Kontaktformular `kontakt/kontakt.js`.
- Leere Absätze (`<p>&nbsp;</p>`) erzeugen – wie bei Wix – die Leerzeilen zwischen Abschnitten.
- Bewusste Abweichungen vom Wix-Entwurf: der Platzhalter „Beispielinhalte:“ am Ende der Datenschutzseite fehlt; die Datenschutzerklärung hat zusätzliche Abschnitte zu Hosting/Cloudflare, Kontaktformular/Brevo und Turnstile; die Karte ist eine Google-Maps-Einbettung statt des Wix-Kartenwidgets; Wix-Einblend-Animationen gibt es nicht.

### Website lokal ansehen
```bash
git clone https://github.com/raabesser/ra-abesser-de.git
cd ra-abesser-de
python3 -m http.server 8000
```
Dann http://localhost:8000 öffnen. (Das Absenden des Kontaktformulars funktioniert nur auf der echten Domain.)

### DNS-Einträge (Cloudflare → `ra-abesser.de` → DNS → Records)
- **Website:** 4 × `A` und 4 × `AAAA` für `ra-abesser.de` auf GitHub Pages (185.199.108–111.153 bzw. 2606:50c0:8000–8003::153), `CNAME www` → `raabesser.github.io`. Alle mit orangener Wolke („Proxied“).
- **E-Mail (Strato) – nicht ändern:** `MX` → `smtpin.rzone.de`, `_dmarc` (`p=reject`), `_domainkey`, `autoconfig`, `_autodiscover`.
- **Brevo-Authentifizierung – nicht ändern:** `TXT brevo-code:…`, `CNAME brevo1._domainkey` und `brevo2._domainkey` (graue Wolke, „DNS only“).
- Es darf nur **einen** DMARC-Eintrag geben. Den vorhandenen behalten, auch wenn Brevo einen anderen vorschlägt.

### HTTPS
- Das Zertifikat stellt Cloudflare automatisch aus und verlängert es selbst.
- Einstellungen unter Cloudflare → SSL/TLS: Modus **Full**, „Always Use HTTPS“ an, Mindestversion TLS 1.2.

### Kontaktformular / Worker
- Cloudflare → Workers & Pages → `ra-abesser-kontakt`.
- **Settings → Variables and Secrets:** Hier liegen `BREVO_API_KEY` und `TURNSTILE_SECRET`, beide als Typ **Secret**. Niemals als „Text“ anlegen (sonst im Dashboard lesbar).
- **Routes:** `ra-abesser.de/api/kontakt` und `www.ra-abesser.de/api/kontakt`.
- **Logs:** Reiter „Logs“ bzw. „Observability“ – dort erscheinen Fehler beim Versand („Brevo error …“).
- Code ändern: `worker/kontakt.js` hier im Repository anpassen **und** im Cloudflare-Dashboard (Edit code) einspielen. Beides muss übereinstimmen.

### Brevo-API-Key erneuern (z. B. wenn er versehentlich weitergegeben wurde)
1. Brevo → Profil (oben rechts) → **SMTP & API** → **API Keys** → neuen Key erzeugen, den alten löschen.
2. Cloudflare → Workers & Pages → `ra-abesser-kontakt` → Settings → Variables and Secrets → `BREVO_API_KEY` bearbeiten → neuen Wert einfügen → **Deploy**.
3. Den Key nirgendwo sonst speichern und nie in einen Chat oder eine Datei kopieren.

### Brevo
- Senderadresse: „RA Abesser“ `<info@ra-abesser.de>`.
- Domain `ra-abesser.de` unter Senders, Domains & Dedicated IPs → Domains. Sie muss „authentifiziert“ sein, sonst lehnen Empfänger die Formular-Mails wegen der DMARC-Regel ab.
- Gesendete Formular-Mails: Brevo → Transactional → Logs (Tag `kontaktformular`).
- Kostenloser Tarif: 300 E-Mails pro Tag.

### Spamschutz (Turnstile)
- Cloudflare → Turnstile → Widget „ra-abesser.de Kontakt“. Erlaubte Domain: `ra-abesser.de`.
- Der öffentliche „Site Key“ steht in `kontakt/index.html`; der geheime Schlüssel liegt nur im Worker.

## Was als Nächstes zu tun ist

Alle offenen Aufgaben – mit Zuständigkeit (Tobias, Einrichtung, Claude) – stehen in **[TODOS.md](TODOS.md)**. Erledigte Punkte dort abhaken bzw. entfernen.

## Hinweise für KI-Assistenten

**Gesprächsführung**
- Der Website-Inhaber, Rechtsanwalt Tobias Abeßer, kennt Claude Code noch nicht. Sprich Deutsch, vermeide Fachjargon und erkläre kurz, was du tust und warum.
- Zu Beginn einer Sitzung (oder wenn er fragt, was zu tun ist): `TODOS.md` lesen, die offenen Punkte kurz zusammenfassen, sagen, wer was erledigen muss, und einen konkreten nächsten Schritt vorschlagen.
- Biete aktiv an, was möglich ist: Vorschau im Browserfenster neben dem Chat (Desktop-App) oder als Screenshot, Umsetzung von markierten Screenshots, Smartphone-Ansicht, Veröffentlichen.
- Zeige vor dem Veröffentlichen eine Vorschau (Screenshot Desktop 1440 px und Smartphone), außer bei reinen Tippfehlern.
- Bei Impressum und Datenschutzerklärung: Änderungen erst nach ausdrücklicher Freigabe durch Tobias veröffentlichen.
- Nach erledigten Aufgaben `TODOS.md` aktualisieren.

**Technik und Sicherheit**
- Keine Geheimnisse (API-Keys, Passwörter, Tokens) in Repository-Dateien, Commits oder Chat-Antworten – das Repository und die Website sind öffentlich. Secrets nur über die Dashboards bzw. als Worker-Secret setzen, ohne den Wert auszugeben. Schickt jemand einen Schlüssel in den Chat: nicht verwenden, zum Löschen und Neuerzeugen raten.
- Die Mail-DNS-Einträge (Strato MX, DMARC, DKIM, Brevo) nicht ändern. Es gibt nur einen DMARC-Eintrag.
- `worker/kontakt.js` und der in Cloudflare veröffentlichte Worker müssen übereinstimmen.
- Das Design soll dem Wix-Entwurf entsprechen; bei Layoutänderungen Desktop (1440 px) und Smartphone (320-px-Layout) gegen den Entwurf vergleichen.
- Veröffentlichen = Commit und Push auf `main`; GitHub Pages stellt die Seite in 1–2 Minuten bereit.
- Der Betreiber hat dauerhaft erlaubt, GitHub, Cloudflare und Brevo für dieses Projekt ohne Einzelrückfrage zu nutzen.
