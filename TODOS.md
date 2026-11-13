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
- [x] **Claude:** Virtueller Kamerahintergrund im Videoportal (Büroraum einer Sicherheitsbehörde als Hauptwahl, dazu Blau in drei Tönen und Weichzeichner), wird lokal im Browser berechnet (12. 11.).
- [x] **Tobias/Mitarbeiterin:** Videoportal mit echten Geräten ausprobieren – Schritt für Schritt nach [videotest/TESTANLEITUNG.md](videotest/TESTANLEITUNG.md) – erledigt, erfolgreich (12. 11.).
- [x] **Claude (Auftrag Tobias):** TURN-Schlüssel „ra-abesser-video“ per Cloudflare-API angelegt und als Secrets `TURN_KEY_ID`/`TURN_KEY_API_TOKEN` beim Worker `ra-abesser-video` eingetragen; `/api/video/ice` liefert jetzt TURN-Server (12. 11.).
- [x] **Tobias:** Videogespräch mit TURN getestet – erfolgreich (12. 11.).
- [x] **Tobias:** Entwurf „8. Videoberatung“ der Datenschutzerklärung freigegeben; Videoportal auf der echten Website veröffentlicht: https://ra-abesser.de/video/ (Gesprächslink erzeugen: https://ra-abesser.de/video/neu/) (12. 11.).

## 7. Mandantenformulare

- [x] **Claude:** Neue Seite „Mandantenformulare“ in der Vorschau (https://ra-abesser.de/preview/formulare/, 12. 11., Wunsch Tobias): Mandanten-Aufnahmebogen, Schweigepflichtbefreiung für E-Mail-Korrespondenz und Handakten-Erklärung online ausfüllen, mit Finger/Maus unterschreiben, drucken oder als PDF speichern. Keine Datenübertragung, alles bleibt im Browser. Verlinkt auf der Kontaktseite und in der Fußzeile („Formulare“).
- [x] **Claude:** Vollmacht als Formular 4 ergänzt (12. 11., Wunsch Tobias): Texte je Rechtsgebiet (Soldaten-, Beamten-, Disziplinar-, Strafrecht; Richter- und öffentliches Dienstrecht am 12. 11. auf Wunsch gestrichen), Unterschriftsfeld, Kanzlei-Bereich unter …/formulare/#kanzlei zum Vorgeben von Rechtsgebiet und Gegenstand (Link oder Datei für den Mandanten).
- [x] **Tobias:** Vollmachtstexte geprüft und angepasst (Soldaten-, Beamten- und Strafrecht nach Diktat, Bußgeldverfahren gestrichen; 12. 11.).
- [x] **Tobias:** Mandantenformulare samt Vollmacht, Links (Kontaktseite, Fußzeile) und Datenschutzerklärung ohne „Fax“ freigegeben; auf der echten Website veröffentlicht unter https://ra-abesser.de/formulare/ (12. 11.). Kanzlei-Bereich: https://ra-abesser.de/formulare/#kanzlei

- [x] **Claude:** Mandantenformulare direkt an die Kanzlei senden (13. 11., Wunsch Tobias): Knopf „An Kanzlei senden“ erzeugt im Browser ein PDF (jsPDF/html2canvas, selbst gehostet in `formulare/lib/`) und sendet es über den Kontaktformular-Worker (Turnstile, Brevo) an das Kanzleipostfach. Nur mit allen Unterschriften und Einverständnis. In der Vorschau; Datenschutzerklärung Ziffer 7 in der Vorschau ergänzt.
- [x] **Tobias:** Freigabe 13. 11.: Versand, Prüfung der Eingaben, einheitliche Schrift, Datenschutz Ziffer 7, neue Reihenfolge auf der Kontaktseite – veröffentlicht.
- [x] **Claude:** In der Vorschau: Mandantenformulare merken sich die Eingaben (13. 11., Wunsch Tobias). Immer bis zum Schließen des Fensters; mit Häkchen „Eingaben auf diesem Gerät merken“ bis zu 30 Tage. Nur im Browser des Mandanten, nie Unterschriften, Einverständnis oder Datum; „Löschen“ und erfolgreicher Versand (ohne Häkchen) entfernen alles.
- [x] **Claude:** In der Vorschau: Adressvorschläge beim Tippen von Straße und PLZ (Worker `ra-abesser-adresse`, OpenStreetMap über Photon/komoot) und besseres automatisches Ausfüllen durch den Browser (gespeicherte Name/Anschrift/Telefon) (13. 11., Wunsch Tobias). Datenschutzerklärung der Vorschau, Ziffer 7: Entwurf zu Adressvorschlägen und Zwischenspeicherung.
- [x] **Tobias:** Freigabe 13. 11.: „Eingaben merken“, Adressvorschläge, Browser-Ausfüllen, Hinweis Besoldungsgruppe und Datenschutz Ziffer 7 (Adressvorschläge, Zwischenspeicherung) – auf der echten Website veröffentlicht.
- [ ] **Tobias:** Einmal echten Versand testen (https://ra-abesser.de/formulare/ mit eigenen Testdaten ausfüllen, unterschreiben, senden) und prüfen, ob E-Mail mit PDF ankommt.

## 8. Videoberatung anfragen und Termin bestätigen

- [x] **Claude:** In der Vorschau: Kontaktseite mit Link „Videoberatung anfragen“ – Betreff und Anfragetext vorausgefüllt, bis zu drei Wunschtermine (https://ra-abesser.de/preview/kontakt/?anliegen=video, 13. 11., Wunsch Tobias).
- [x] **Claude:** Kontaktformular-Worker erweitert und Kalender-Worker `ra-abesser-kalender` eingerichtet: Die E-Mail an die Kanzlei zeigt je Wunschtermin „frei/belegt laut Kalender“ und enthält fertige Antwort-Entwürfe mit Datum, Uhrzeit und Videolink sowie „In Google Kalender eintragen“ (13. 11.). Normale Anfragen unverändert.
- [ ] **Tobias/Einrichtung:** Google-Kalender verbinden: „Privatadresse im iCal-Format“ als Secret `KALENDER_ICS` beim Worker `ra-abesser-kalender` eintragen (Anleitung in `AGENTS.md`, Abschnitt Kontaktformular → Kalenderabgleich). Nicht in den Chat schreiben.
- [ ] **Tobias:** In der Vorschau eine Testanfrage senden (https://ra-abesser.de/preview/kontakt/?anliegen=video) und die E-Mail mit den Antwort-Entwürfen prüfen; danach Freigabe für die echte Website (dann auch Knopf „Videoberatung anfragen“ auf https://ra-abesser.de/video/).

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
