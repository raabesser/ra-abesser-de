# ra-abesser.de – Betriebsanleitung

Anleitung für Rechtsanwalt Tobias Abeßer (und für KI-Assistenten wie Claude), um Website, Domain, Kontaktformular und E-Mail-Versand selbst zu verwalten.

> **Wichtig:** Dieses Repository ist **öffentlich**, und alles hier wird auch auf der Website ausgeliefert. Niemals Passwörter, API-Keys oder andere Geheimnisse in Dateien dieses Repositorys oder in einen Chat schreiben. Geheimnisse gehören ausschließlich in die jeweiligen Dashboards (Cloudflare, Brevo).

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

1. **Nameserver-Umstellung abwarten.** Bei Strato sind die Cloudflare-Nameserver (`isla.ns.cloudflare.com`, `jason.ns.cloudflare.com`) einzutragen. Prüfen, ob die Registry (DENIC) sie schon kennt:
   ```bash
   dig NS ra-abesser.de @a.nic.de +norecurse
   ```
   Zeigt die Ausgabe die Cloudflare-Nameserver, aktiviert Cloudflare die Domain meist innerhalb einer Stunde (Status in Cloudflare → Overview: „Active“).
2. **Eigene Domain bei GitHub wieder eintragen**, sobald Cloudflare „Active“ zeigt: Datei `CNAME` mit dem Inhalt `ra-abesser.de` im Repository anlegen (wurde zur Vorschau vorübergehend entfernt) und unter Repo → Settings → Pages prüfen, dass „Custom domain“ `ra-abesser.de` lautet. Ohne diesen Schritt zeigt die Domain eine GitHub-Fehlerseite.
3. **Brevo-Domain authentifizieren:** In Brevo bei der Domain `ra-abesser.de` auf „Authenticate this email domain“ klicken (funktioniert erst nach Schritt 1).
4. **Kontaktformular testen:** Auf https://ra-abesser.de/kontakt/ eine Testnachricht senden und prüfen, ob sie in `info@ra-abesser.de` ankommt.
5. **Design mit dem Wix-Entwurf abgleichen** (https://info0239645.wixsite.com/aktuell), auf Desktop und Smartphone.
6. **Auftragsverarbeitungsverträge (AVV) abschließen:** in Cloudflare (Manage Account → Configurations → DPA) und in Brevo (Kontoeinstellungen). Die Datenschutzerklärung verweist darauf.
7. **Datenschutzerklärung prüfen** (`datenschutz/index.html`): Abschnitte zu Hosting/Cloudflare, Kontaktformular/Brevo und Turnstile.
8. **Zwei-Faktor-Anmeldung aktivieren** für Cloudflare, Brevo, GitHub und Strato.

## Hinweise für KI-Assistenten

- Keine Geheimnisse in Repository-Dateien, Commits oder Chat-Antworten. Secrets nur über die Dashboards bzw. als Worker-Secret setzen, ohne den Wert auszugeben.
- Die Mail-DNS-Einträge (Strato, DMARC, Brevo) nicht ändern.
- `worker/kontakt.js` und der in Cloudflare veröffentlichte Worker müssen übereinstimmen.
- Das Design soll dem Wix-Entwurf entsprechen; bei Layoutänderungen mit Screenshots (Desktop 1440 px und Smartphone) gegen den Entwurf vergleichen.
- Der Betreiber hat dauerhaft erlaubt, GitHub, Cloudflare und Brevo für dieses Projekt ohne Einzelrückfrage zu nutzen.
