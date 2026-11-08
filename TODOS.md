# Offene Aufgaben – ra-abesser.de

Stand: 8. November 2026. Erledigte Punkte bitte abhaken (`[x]`) oder entfernen. Claude aktualisiert diese Liste nach jeder erledigten Aufgabe.

**Zuständigkeiten:** **Tobias** = Rechtsanwalt Tobias Abeßer (Inhaber, Inhalte, Freigaben) · **Mitarbeiterin** = betreut die Website (Änderungen in der Vorschau) · **Einrichtung** = wer die Konten bei Strato, Cloudflare, GitHub und Brevo betreut · **Claude** = KI-Assistent (Claude Code), arbeitet auf Zuruf

## In Arbeit

Wer gerade woran arbeitet (Claude trägt ein und aus). Format: Seite/Thema – wer – seit wann.

- *(derzeit nichts)*

## 1. Website online bringen (Domain)

- [ ] **Strato:** Nameserver-Umstellung der Domain `ra-abesser.de` auf `isla.ns.cloudflare.com` und `jason.ns.cloudflare.com` ist beauftragt (8. 11.) und wartet auf Strato. Am 8. 11. zeigt die Domain noch auf die Strato-Nameserver (`docks06`/`shades14.rzone.de`); prüfen mit `dig NS ra-abesser.de @a.nic.de +norecurse`.
- [ ] **Claude:** Sobald Cloudflare die Domain als „Active“ meldet: Datei `CNAME` mit `ra-abesser.de` wieder anlegen (sie wurde für die Vorschau auf github.io vorübergehend entfernt) und prüfen, dass https://ra-abesser.de die neue Website mit gültigem Zertifikat zeigt.
- [ ] **Einrichtung:** Danach unter GitHub → Repository → Settings → Pages prüfen, dass „Custom domain“ `ra-abesser.de` lautet.

## 2. Kontaktformular

- [ ] **Einrichtung:** Nach der Domain-Umstellung in Brevo bei der Domain `ra-abesser.de` auf „Authenticate this email domain“ klicken (die DNS-Einträge dafür sind in Cloudflare schon angelegt).
- [ ] **Einrichtung:** In Brevo unter Sicherheit → „Autorisierte IPs“ prüfen, dass API-Schlüssel nicht auf bestimmte IP-Adressen beschränkt sind (der Cloudflare Worker hat wechselnde IP-Adressen).
- [ ] **Claude:** Kontaktformular auf https://ra-abesser.de/kontakt/ mit einer Testnachricht prüfen.
- [ ] **Tobias:** Bestätigen, dass die Testnachricht im Postfach `info@ra-abesser.de` angekommen ist (auch im Spam-Ordner nachsehen).

## 3. Rechtliches

- [ ] **Tobias:** Neue Abschnitte der Datenschutzerklärung prüfen und freigeben: „Hosting und Cloudflare“, „Kontaktformular“ (Brevo) und Spamschutz (Turnstile) – https://raabesser.github.io/ra-abesser-de/datenschutz/ (nach der Umstellung: https://ra-abesser.de/datenschutz/).
- [x] **Einrichtung/Tobias:** Auftragsverarbeitungsverträge (AVV) mit Cloudflare und Brevo abgeschlossen (laut Tobias, 8. 11.).
- [ ] **Tobias:** Impressum prüfen. Der Link „Internet: http://ra-abesser.de“ zeigt jetzt auf die eigene Domain (im Wix-Entwurf zeigte er auf eine andere Adresse).
- [ ] **Tobias:** Entscheiden, ob der veraltete Hinweis auf das „EU-US-Privacy-Shield“ (Abschnitt Google Fonts/Maps, aus dem Wix-Entwurf übernommen) ersetzt werden soll – Nachfolger ist das EU-US Data Privacy Framework. Claude kann einen Textvorschlag machen.

## 4. Sicherheit

- [ ] **Einrichtung/Tobias:** Zwei-Faktor-Anmeldung aktivieren für Cloudflare, Brevo, GitHub und Strato – geplant beim nächsten Vor-Ort-Termin der Einrichtung.

## 5. Design

- [x] **Claude:** Alle Seiten dem Wix-Entwurf (https://info0239645.wixsite.com/aktuell) nachgebaut, Desktop und Smartphone.
- [x] **Claude:** Seitentitel (Text im Browser-Tab) enden jetzt auf „| Rechtsanwalt Abeßer“ statt wie bei Wix auf „| Aktuell“.
- [ ] **Tobias:** Website auf Computer und Smartphone ansehen und Änderungswünsche an Claude geben (gern als Screenshot mit Markierungen).

## 6. Später / optional

- [ ] **Claude:** Wix-Website abschalten bzw. auf die neue Domain verweisen lassen, sobald ra-abesser.de live ist (**Tobias** entscheidet).
- [ ] **Claude:** Auf Wunsch die Schriftarten lokal ausliefern statt über Google Fonts (datenschutzfreundlicher; der Abschnitt „Google Fonts“ in der Datenschutzerklärung könnte dann entfallen).
