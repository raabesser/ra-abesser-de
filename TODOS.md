# Offene Aufgaben – ra-abesser.de

Stand: 9. November 2026. Erledigte Punkte bitte abhaken (`[x]`) oder entfernen. Claude aktualisiert diese Liste nach jeder erledigten Aufgabe.

**Zuständigkeiten:** **Tobias** = Rechtsanwalt Tobias Abeßer (Inhaber, Inhalte, Freigaben) · **Mitarbeiterin** = betreut die Website (Änderungen in der Vorschau) · **Einrichtung** = wer die Konten bei Strato, Cloudflare, GitHub und Brevo betreut · **Claude** = KI-Assistent (Claude Code), arbeitet auf Zuruf

## In Arbeit

Wer gerade woran arbeitet (Claude trägt ein und aus). Format: Seite/Thema – wer – seit wann.

- (derzeit nichts)

## 1. Website online bringen (Domain)

- [x] **Strato:** Nameserver auf Cloudflare umgestellt; Cloudflare meldet die Domain seit 8. 11. abends als „Active“.
- [x] **Claude:** Fehlende E-Mail-Einträge (SPF und Strato-DKIM) in Cloudflare ergänzt – ohne sie konnte Tobias nicht mehr von info@ra-abesser.de senden (9. 11.).
- [x] **Tobias:** Versand von info@ra-abesser.de klappt wieder (9. 11.).
- [x] **Claude:** Datei `CNAME` mit `ra-abesser.de` wieder angelegt; https://ra-abesser.de zeigt die neue Website mit gültigem Zertifikat, die Vorschau liegt jetzt unter https://ra-abesser.de/preview/ (9. 11.).
- [x] GitHub Pages nutzt die eigene Domain `ra-abesser.de` (github.io leitet dorthin weiter, geprüft 9. 11.).

## 2. Kontaktformular

- [x] **Einrichtung:** Domain `ra-abesser.de` in Brevo authentifiziert (9. 11.).
- [x] **Einrichtung:** IP-Sperre für API-Schlüssel in Brevo ist aus (9. 11.).
- [x] **Claude/Einrichtung:** Testnachricht über https://ra-abesser.de/kontakt/ laut Brevo zugestellt (9. 11., 07:50).
- [x] Entschieden (9. 11.): Absender erhalten **keine** Kopie und keine Eingangsbestätigung per E-Mail (Missbrauchsgefahr als Spam-Versender). Die Erfolgsmeldung im Formular genügt.
- [x] **Tobias:** Testnachricht ist im Postfach `info@ra-abesser.de` angekommen; Kontaktformular funktioniert vollständig (9. 11.).
- [x] **Claude:** Doppelte Formular-Mails behoben (9. 11., Freigabe Tobias): Ursache waren zwei Absendungen vom selben Handy. Das Formular verschwindet jetzt nach dem Senden (deutliche Bestätigung), und der Worker verschickt dieselbe Nachricht innerhalb von 10 Minuten nur einmal.

## 3. Rechtliches

- [x] **Tobias:** Neue Abschnitte der Datenschutzerklärung („Hosting und Cloudflare“, „Kontaktformular“/Brevo, Spamschutz/Turnstile) geprüft und freigegeben (8. 11., im Chat mit Claude).
- [x] **Einrichtung/Tobias:** Auftragsverarbeitungsverträge (AVV) mit Cloudflare und Brevo abgeschlossen (laut Tobias, 8. 11.).
- [x] **Tobias:** Neue, auf Anwaltskanzleien zugeschnittene Datenschutzerklärung geprüft und freigegeben; auf der echten Website veröffentlicht (9. 11.).
- [x] **Tobias:** Technik- und Design-Optimierung freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Tobias:** Datenschutzerklärung in dritter Person freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Claude:** Worker mit Dokumente-Upload bei Cloudflare hochgeladen (9. 11., Freigabe Tobias). Normale Nachrichten unverändert. Test: 10-MB-Anfrage verarbeitet (8–21 ms Rechenzeit), getarnte Datei abgelehnt.
- [x] **Tobias:** Dokumente-Upload freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Tobias:** Echte Handy-Darstellung freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Tobias:** Überarbeitetes Impressum freigegeben und veröffentlicht (Steuernummer entfernt, USt-IdNr. ergänzt, Rechtsgrundlagen, Streitschlichtung, 9. 11.).
- [x] **Tobias:** Dokumente-Upload selbst getestet – funktioniert (9. 11.).
- [x] **Claude:** Cloudflare Web Analytics (automatisch eingefügtes Statistik-Skript) abgeschaltet, damit die Datenschutzerklärung („keine Analysedienste“) stimmt (9. 11.).
- [x] **Claude:** Hinweis auf das „EU-US-Privacy-Shield“ durch das EU-US Data Privacy Framework ersetzt, Adresse der Berliner Datenschutzbeauftragten (Alt-Moabit 59–61) aktualisiert und Rechtschreibung auf allen Seiten korrigiert (8. 11., von Tobias freigegeben).
- [x] Telefonnummer geklärt: einheitlich +49 30 39 90 34 06 (9. 11.).

## 6. Videoportal (Test)

- [x] **Claude:** Testkopie der Website unter https://ra-abesser.de/videotest/ angelegt und darin ein eigenes Videoportal gebaut: Seite „Videoberatung“, Gesprächslinks für die Kanzlei unter https://ra-abesser.de/videotest/video/neu/, Worker `ra-abesser-video` bei Cloudflare. Test mit zwei simulierten Teilnehmern erfolgreich (12. 11.).
- [x] **Claude:** Virtueller Kamerahintergrund im Videoportal (Kanzleibüro, Arbeitszimmer, Besprechung, Foyer, Weichzeichner – modern und warm), wird lokal im Browser berechnet (12. 11.).
- [ ] **Tobias:** Videoportal mit echten Geräten ausprobieren (z. B. Computer in der Kanzlei + eigenes Handy) und Rückmeldung geben.
- [ ] **Einrichtung:** TURN-Schlüssel im Cloudflare-Dashboard anlegen und beim Worker `ra-abesser-video` eintragen (Anleitung in `AGENTS.md`, Abschnitt „Testkopie mit Videoportal“) – nötig für Firmen- und manche Mobilfunknetze.
- [ ] **Tobias:** Entwurf „8. Videoberatung“ in der Datenschutzerklärung der Testkopie prüfen und freigeben (https://ra-abesser.de/videotest/datenschutz/, seit 12. 11.; folgende Ziffern dort um eins verschoben). Die echte Datenschutzerklärung ist unverändert.

## 4. Sicherheit

- [ ] **Einrichtung/Tobias:** Zwei-Faktor-Anmeldung aktivieren für Cloudflare, Brevo, GitHub und Strato – geplant beim nächsten Vor-Ort-Termin der Einrichtung.

## 5. Design

- [x] **Claude:** Alle Seiten dem Wix-Entwurf (https://info0239645.wixsite.com/aktuell) nachgebaut, Desktop und Smartphone.
- [x] **Claude:** Seitentitel (Text im Browser-Tab) enden jetzt auf „| Rechtsanwalt Abeßer“ statt wie bei Wix auf „| Aktuell“.
- [x] **Tobias:** Design-Feinschliff (blauer Hintergrund u. a.) freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Claude:** Darstellung auf Handys im Querformat und Tablets (hoch und quer) repariert – vorher musste man dort seitlich wischen. Geprüft auf 9 Geräten in beiden Ausrichtungen (9. 11.).
- [x] **Tobias:** Handy-quer-/Tablet-Darstellung freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [ ] **Tobias:** Website auf Computer und Smartphone ansehen und Änderungswünsche an Claude geben (gern als Screenshot mit Markierungen).

- [x] **Claude:** In der Vorschau umgesetzt (9. 11.): eigene Seitenbeschreibung für jede Seite (Google-Suchergebnisse), Kanzlei-Angaben für Google (strukturierte Daten auf der Startseite), Knopf „Anrufen“ in der Kopfzeile auf Handys/Tablets, eigene Fehlerseite (`preview/404.html`), Startbild im WebP-Format und für Handys verkleinert (220 KB → 46 KB). Lesbarkeit der Farben geprüft – erfüllt WCAG AA, keine Änderung nötig. Auf Wunsch von Tobias außerdem: Hinweis „KI-generiert“ auf dem Foto „Der Anwalt“ deutlich verkleinert (aus dem Bild entfernt, stattdessen kleiner Text über dem Bild).
- [x] **Claude:** In der Vorschau das KI-generierte Foto auf „Der Anwalt“ durch das echte Foto von Tobias ersetzt; der Hinweis „KI-generiert“ entfällt (9. 11.).
- [x] **Tobias:** Kontaktformular („Absenden“, neuer Einleitungssatz), Buch-Symbol für die Leitfäden, Dokument-Symbol oben auf den Leitfaden-Seiten entfernt und „Der Anwalt“ bündig – freigegeben und auf der echten Website veröffentlicht (12. 11.).
- [x] **Tobias:** Diese Änderungen samt echtem Foto und neuem Erstberatungs-Satz („maximal 226,10 EUR brutto“) freigegeben und auf der echten Website veröffentlicht (9. 11.).
- [x] **Tobias:** Echtes Porträtfoto für „Der Anwalt“ geschickt; in der Vorschau eingebaut (9. 11.).
- [ ] **Tobias/Einrichtung (optional):** Google-Unternehmensprofil anlegen bzw. prüfen (https://business.google.com) – Claude hilft bei den Texten.

- [x] **Claude:** Kontaktformular in der Vorschau (9. 11., Wunsch Tobias): Hinweistext „Nennen Sie dabei bitte … Grund Ihrer Anfrage mit“ ganz gestrichen, neues Pflichtfeld „Telefonnummer“; Datenschutzerklärung Ziffer 7 um „Ihre Telefonnummer“ ergänzt.
- [x] **Tobias:** Telefonfeld, gestrichener Hinweistext und ergänzte Datenschutzerklärung freigegeben; Worker mit Feld `telefon` bei Cloudflare hochgeladen und getestet, Website veröffentlicht; Testnachricht von Tobias mit Telefonnummer angekommen (9. 11.).

- [x] **Tobias:** Neue Seite „Beamte vor Gericht“ (Text aus Word-Datei, mit Ausnahme zur Wahrheitspflicht) und Link auf der Startseite freigegeben; veröffentlicht und in `sitemap.xml` eingetragen (11. 11.). Danach umbenannt in „Leitfaden – Beamte vor dem Strafgericht“ (Freigabe Tobias, 11. 11.).

- [x] **Tobias:** Neue Seite „Leitfaden: Soldat/in unter Verdacht“ samt Link im Abschnitt „Soldaten“ der Startseite freigegeben; veröffentlicht und in `sitemap.xml` eingetragen (11. 11.).

- [x] **Tobias:** Neue Seite „Leitfaden – Disziplinarverfahren gegen Beamte“ samt Link im Abschnitt „Beamte“ der Startseite freigegeben; veröffentlicht, in `sitemap.xml` eingetragen, `style.css?v=18` (11. 11.).

- [x] **Tobias:** Überarbeitete Gestaltung der drei Leitfäden freigegeben; veröffentlicht, `style.css?v=19` (11. 11.). Hinweis „ersetzt keine Beratung im Einzelfall“: von Tobias nicht gewünscht.

- [x] **Tobias:** Leitfäden mit Dokument-Symbol statt des Wortes „Leitfaden“ freigegeben; veröffentlicht, `style.css?v=20` (11. 11.). Überschrift „Weitere Leitfäden“ und „LEITFADEN – …“ im Seitentitel bleiben bewusst.

- [x] **Tobias:** Leitfäden umbenannt in „So läuft ein Disziplinarverfahren“, „Vor dem Strafgericht“, „Unter Verdacht“ (Adressen unverändert); bei „Unter Verdacht“ Einleitungssatz und Inhaltsübersicht gestrichen. Freigegeben und veröffentlicht, `style.css?v=21` (11. 11.).

- [x] **Tobias:** Bei „Vor dem Strafgericht“ und „So läuft ein Disziplinarverfahren“ Einleitungssatz und Inhaltsübersicht (dort auch Überschrift „Der Ablauf in sechs Schritten“) gestrichen. Freigegeben und veröffentlicht, `style.css?v=22` (11. 11.).

## 6. Später / optional

- [x] **Tobias/Einrichtung:** Wix-Website abgeschaltet; Claude hat geprüft, dass https://info0239645.wixsite.com/aktuell nicht mehr erreichbar ist (Fehler 404, 9. 11.). Optional später: Wix-Website ganz löschen bzw. Wix-Abo kündigen, falls vorhanden.
- [x] **Claude:** Schriftarten werden lokal ausgeliefert, Datenschutzerklärung angepasst (9. 11.).
