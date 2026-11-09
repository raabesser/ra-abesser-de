# Offene Aufgaben – ra-abesser.de

Stand: 9. November 2026. Erledigte Punkte bitte abhaken (`[x]`) oder entfernen. Claude aktualisiert diese Liste nach jeder erledigten Aufgabe.

**Zuständigkeiten:** **Tobias** = Rechtsanwalt Tobias Abeßer (Inhaber, Inhalte, Freigaben) · **Mitarbeiterin** = betreut die Website (Änderungen in der Vorschau) · **Einrichtung** = wer die Konten bei Strato, Cloudflare, GitHub und Brevo betreut · **Claude** = KI-Assistent (Claude Code), arbeitet auf Zuruf

## In Arbeit

Wer gerade woran arbeitet (Claude trägt ein und aus). Format: Seite/Thema – wer – seit wann.

- Design-Feinschliff nach Prüfung gegen Wix – Claude (Sitzung `claude/nice-mayer-xon8pe`) – in der Vorschau fertig; für die echte Website vorbereitet auf dem Zweig `claude/nice-mayer-xon8pe`, wartet auf Freigabe durch Tobias.

## 1. Website online bringen (Domain)

- [x] **Strato:** Nameserver auf Cloudflare umgestellt; Cloudflare meldet die Domain seit 8. 11. abends als „Active“.
- [x] **Claude:** Fehlende E-Mail-Einträge (SPF und Strato-DKIM) in Cloudflare ergänzt – ohne sie konnte Tobias nicht mehr von info@ra-abesser.de senden (9. 11.).
- [x] **Tobias:** Versand von info@ra-abesser.de klappt wieder (9. 11.).
- [x] **Claude:** Datei `CNAME` mit `ra-abesser.de` wieder angelegt; https://ra-abesser.de zeigt die neue Website mit gültigem Zertifikat, die Vorschau liegt jetzt unter https://ra-abesser.de/preview/ (9. 11.).
- [ ] **Einrichtung:** Danach unter GitHub → Repository → Settings → Pages prüfen, dass „Custom domain“ `ra-abesser.de` lautet.

## 2. Kontaktformular

- [x] **Einrichtung:** Domain `ra-abesser.de` in Brevo authentifiziert (9. 11.).
- [x] **Einrichtung:** IP-Sperre für API-Schlüssel in Brevo ist aus (9. 11.).
- [x] **Claude/Einrichtung:** Testnachricht über https://ra-abesser.de/kontakt/ laut Brevo zugestellt (9. 11., 07:50).
- [x] Entschieden (9. 11.): Absender erhalten **keine** Kopie und keine Eingangsbestätigung per E-Mail (Missbrauchsgefahr als Spam-Versender). Die Erfolgsmeldung im Formular genügt.
- [ ] **Tobias:** Bestätigen, dass die Testnachricht im Postfach `info@ra-abesser.de` angekommen ist (auch im Spam-Ordner nachsehen).

## 3. Rechtliches

- [x] **Tobias:** Neue Abschnitte der Datenschutzerklärung („Hosting und Cloudflare“, „Kontaktformular“/Brevo, Spamschutz/Turnstile) geprüft und freigegeben (8. 11., im Chat mit Claude).
- [x] **Einrichtung/Tobias:** Auftragsverarbeitungsverträge (AVV) mit Cloudflare und Brevo abgeschlossen (laut Tobias, 8. 11.).
- [ ] **Tobias:** Impressum prüfen. Der Link „Internet: http://ra-abesser.de“ zeigt jetzt auf die eigene Domain (im Wix-Entwurf zeigte er auf eine andere Adresse).
- [x] **Claude:** Hinweis auf das „EU-US-Privacy-Shield“ durch das EU-US Data Privacy Framework ersetzt, Adresse der Berliner Datenschutzbeauftragten (Alt-Moabit 59–61) aktualisiert und Rechtschreibung auf allen Seiten korrigiert (8. 11., von Tobias freigegeben).
- [ ] **Tobias:** Telefonnummer prüfen: Angezeigt wird „+49 30 3990340-6“ (also 39903406), der anklickbare Telefon-Link wählt aber 399034006 (eine 0 mehr). Welche Nummer ist richtig?

## 4. Sicherheit

- [ ] **Einrichtung/Tobias:** Zwei-Faktor-Anmeldung aktivieren für Cloudflare, Brevo, GitHub und Strato – geplant beim nächsten Vor-Ort-Termin der Einrichtung.

## 5. Design

- [x] **Claude:** Alle Seiten dem Wix-Entwurf (https://info0239645.wixsite.com/aktuell) nachgebaut, Desktop und Smartphone.
- [x] **Claude:** Seitentitel (Text im Browser-Tab) enden jetzt auf „| Rechtsanwalt Abeßer“ statt wie bei Wix auf „| Aktuell“.
- [ ] **Tobias:** Design-Feinschliff in der Vorschau ansehen (https://raabesser.github.io/ra-abesser-de/preview/) und für die echte Website freigeben: Kopfzeile bleibt beim Scrollen oben stehen, Startbild bewegt sich beim Scrollen leicht mit (wie bei Wix), Formularfelder färben sich beim Anklicken grau und das Häkchen ist ein echtes Häkchen, „Nach oben“-Knopf erscheint auf dem Handy erst nach dem Scrollen, Menüeinträge auf dem Handy etwas eingerückt, zwei Links in der Datenschutzerklärung ohne Unterstreichung, hellblauer Seitenhintergrund unter kurzen Seiten.
- [ ] **Tobias:** Website auf Computer und Smartphone ansehen und Änderungswünsche an Claude geben (gern als Screenshot mit Markierungen).

## 6. Später / optional

- [ ] **Claude:** Wix-Website abschalten bzw. auf die neue Domain verweisen lassen, sobald ra-abesser.de live ist (**Tobias** entscheidet).
- [ ] **Claude:** Auf Wunsch die Schriftarten lokal ausliefern statt über Google Fonts (datenschutzfreundlicher; der Abschnitt „Google Fonts“ in der Datenschutzerklärung könnte dann entfallen).
