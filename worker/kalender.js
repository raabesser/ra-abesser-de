// Cloudflare Worker "ra-abesser-kalender" – Kalenderabgleich für Videoberatungs-Anfragen.
// Keine öffentliche Route: nur über die Service-Bindung KALENDER des Kontaktformular-Workers erreichbar.
// Liest den Google-Kalender von Tobias über dessen geheime iCal-Adresse (Secret KALENDER_ICS)
// und prüft, ob Zeiträume frei oder belegt sind. Gibt nur Zeiten zurück, nie Titel oder Inhalte von Terminen.
//
//   POST { slots: [{ start: <ms UTC>, ende: <ms UTC> }, …] }
//   ->   { ok: true, ergebnis: [{ status: "frei"|"belegt", konflikte: [{ start, ende, ganztaegig }] }, …] }
//   ->   { ok: false, grund: "nicht-verbunden" | "abruf" | "eingabe" }

const TZ_STD = "Europe/Berlin";
const MAX_SCHRITTE = 20000; // Sicherung gegen sehr lange Wiederholungsserien

// ---------- Zeit ----------
const offsetCache = new Map(), fmtCache = new Map();
function formatierer(tz) {
  if (fmtCache.has(tz)) return fmtCache.get(tz);
  const opt = { hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  let fmt;
  try { fmt = new Intl.DateTimeFormat("en-US", { ...opt, timeZone: tz }); } catch { fmt = formatierer(TZ_STD); }
  fmtCache.set(tz, fmt);
  return fmt;
}
// Mitteleuropäische Zeit direkt berechnen (Sommerzeit: letzter Sonntag im März bis letzter Sonntag im Oktober, jeweils 01:00 UTC)
const MEZ = new Set(["Europe/Berlin", "Europe/Vienna", "Europe/Zurich", "Europe/Paris", "Europe/Amsterdam", "Europe/Brussels", "Europe/Luxembourg", "Europe/Copenhagen", "Europe/Prague", "Europe/Warsaw", "Europe/Rome", "Europe/Madrid", "Europe/Stockholm", "Europe/Oslo", "Europe/Budapest", "W. Europe Standard Time"]);
const letzterSonntag = (y, mo) => { const d = new Date(Date.UTC(y, mo, 0)); return d.getUTCDate() - d.getUTCDay(); };
const sommerCache = new Map();
function mezOffsetMs(utcMs) {
  const y = new Date(utcMs).getUTCFullYear();
  let g = sommerCache.get(y);
  if (!g) { g = [Date.UTC(y, 2, letzterSonntag(y, 3), 1), Date.UTC(y, 9, letzterSonntag(y, 10), 1)]; sommerCache.set(y, g); }
  return utcMs >= g[0] && utcMs < g[1] ? 7200000 : 3600000;
}
function tzOffsetMs(tz, utcMs) {
  // Abweichung der Zeitzone von UTC zum Zeitpunkt utcMs (in ms)
  if (MEZ.has(tz)) return mezOffsetMs(utcMs);
  const key = tz + "|" + Math.floor(utcMs / 1800000);
  if (offsetCache.has(key)) return offsetCache.get(key);
  const fmt = formatierer(tz);
  const p = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  const off = asUtc - Math.floor(utcMs / 1000) * 1000;
  offsetCache.set(key, off);
  return off;
}
function lokalZuUtc(tz, y, mo, d, h, mi, s) {
  const naiv = Date.UTC(y, mo - 1, d, h, mi, s);
  let utc = naiv - tzOffsetMs(tz, naiv);
  utc = naiv - tzOffsetMs(tz, utc);
  return utc;
}

// Wert einer DTSTART/DTEND/EXDATE/RECURRENCE-ID-Zeile -> { y, mo, d, h, mi, s, tz, utc, ganztaegig }
function parseZeit(params, wert) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(wert.trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (!m[4] || /VALUE=DATE(?!-)/.test(params)) {
    return { y, mo, d, h: 0, mi: 0, s: 0, tz: TZ_STD, ganztaegig: true, utc: lokalZuUtc(TZ_STD, y, mo, d, 0, 0, 0) };
  }
  const h = +m[4], mi = +m[5], s = +m[6];
  if (m[7]) return { y, mo, d, h, mi, s, tz: "UTC", ganztaegig: false, utc: Date.UTC(y, mo - 1, d, h, mi, s) };
  const tzm = /TZID=("?)([^;:"]+)\1/.exec(params);
  const tz = tzm ? tzm[2] : TZ_STD;
  return { y, mo, d, h, mi, s, tz, ganztaegig: false, utc: lokalZuUtc(tz, y, mo, d, h, mi, s) };
}
function parseDauer(w) {
  const m = /^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(w.trim());
  if (!m) return 0;
  const ms = (((+m[2] || 0) * 7 + (+m[3] || 0)) * 86400 + (+m[4] || 0) * 3600 + (+m[5] || 0) * 60 + (+m[6] || 0)) * 1000;
  return m[1] === "-" ? -ms : ms;
}

// ---------- iCal lesen ----------
// von/bis (optional): Einzeltermine, die weit außerhalb beginnen, gar nicht erst auswerten (spart Rechenzeit).
function tagNr(ms) { const d = new Date(ms); return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate(); }
function leseTermine(ics, von, bis) {
  const text = ics.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const ab = von ? tagNr(von - 40 * 86400000) : 0, bisTag = bis ? tagNr(bis + 2 * 86400000) : 99999999;
  const zeilen = [];
  let pos = 0;
  for (;;) {
    const a = text.indexOf("BEGIN:VEVENT", pos);
    if (a < 0) break;
    const e = text.indexOf("END:VEVENT", a);
    if (e < 0) break;
    pos = e + 10;
    const block = text.slice(a, pos);
    if (block.indexOf("RRULE") < 0) {
      const imFenster = (re) => { const m = re.exec(block); return !m || (+m[1] >= ab && +m[1] <= bisTag); };
      // Verschobene Serientermine (RECURRENCE-ID) behalten, wenn alter oder neuer Zeitpunkt in Frage kommt
      const hatRecId = block.indexOf("RECURRENCE-ID") >= 0;
      if (!imFenster(/\nDTSTART[^:\n]*:(\d{8})/) && !(hatRecId && imFenster(/\nRECURRENCE-ID[^:\n]*:(\d{8})/))) continue;
    }
    zeilen.push(...block.split(/\r?\n/));
  }
  const termine = [];
  let t = null;
  for (const z of zeilen) {
    if (z === "BEGIN:VEVENT") { t = { exdate: [] }; continue; }
    if (z === "END:VEVENT") { if (t && t.start) termine.push(t); t = null; continue; }
    if (!t) continue;
    const doppel = z.indexOf(":");
    if (doppel < 0) continue;
    const kopf = z.slice(0, doppel), wert = z.slice(doppel + 1);
    const semi = kopf.indexOf(";");
    const name = (semi < 0 ? kopf : kopf.slice(0, semi)).toUpperCase(), params = semi < 0 ? "" : kopf.slice(semi + 1);
    switch (name) {
      case "UID": t.uid = wert; break;
      case "DTSTART": t.start = parseZeit(params, wert); break;
      case "DTEND": t.ende = parseZeit(params, wert); break;
      case "DURATION": t.dauer = parseDauer(wert); break;
      case "RRULE": t.rrule = wert; break;
      case "EXDATE": for (const w of wert.split(",")) { const e = parseZeit(params, w); if (e) t.exdate.push(e.utc); } break;
      case "RECURRENCE-ID": t.recId = parseZeit(params, wert); break;
      case "STATUS": t.status = wert.trim().toUpperCase(); break;
      case "TRANSP": t.transp = wert.trim().toUpperCase(); break;
    }
  }
  return termine;
}

const TAGE = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

// Alle Vorkommen (Beginn in UTC-ms) eines Termins, deren Zeitraum [von, bis) berühren kann.
function vorkommen(t, dauerMs, von, bis) {
  const s = t.start;
  if (!t.rrule) return s.utc < bis && s.utc + dauerMs > von ? [s.utc] : [];
  const r = Object.fromEntries(t.rrule.split(";").map((x) => x.split("=")).map(([k, v]) => [k.toUpperCase(), v || ""]));
  const freq = r.FREQ, intervall = Math.max(1, +r.INTERVAL || 1), anzahl = r.COUNT ? +r.COUNT : Infinity;
  let bisRegel = Infinity;
  if (r.UNTIL) { const u = parseZeit("", r.UNTIL); if (u) bisRegel = u.ganztaegig ? u.utc + 86399999 : u.utc; }
  const exd = new Set(t.exdate);
  const byday = r.BYDAY ? r.BYDAY.split(",").map((x) => { const m = /^([+-]?\d+)?([A-Z]{2})$/.exec(x); return m ? { n: m[1] ? +m[1] : 0, tag: TAGE[m[2]] } : null; }).filter(Boolean) : [];
  const bymonthday = r.BYMONTHDAY ? r.BYMONTHDAY.split(",").map(Number) : [];
  const bymonth = r.BYMONTH ? r.BYMONTH.split(",").map(Number) : [];
  const ergebnis = [];
  let gezaehlt = 0, schritte = 0;
  // Weit vor dem geprüften Zeitraum genügt eine Überschlagsrechnung (Zeitzonen-Abweichung wie beim Serienbeginn)
  const startVersatz = Date.UTC(s.y, s.mo - 1, s.d, s.h, s.mi, s.s) - s.utc;
  const lokal = (y, mo, d) => {
    const naiv = Date.UTC(y, mo - 1, d, s.h, s.mi, s.s);
    if (s.tz === "UTC") return naiv;
    if (naiv < von - 2 * 86400000 || naiv > bis + 2 * 86400000) return naiv - startVersatz;
    return lokalZuUtc(s.tz, y, mo, d, s.h, s.mi, s.s);
  };
  const nimm = (utc) => {
    if (utc < s.utc) return true;
    if (utc > bisRegel || gezaehlt >= anzahl) return false;
    gezaehlt++;
    if (!exd.has(utc) && utc < bis && utc + dauerMs > von) ergebnis.push(utc);
    return utc < bis;
  };
  const tageImMonat = (y, mo) => new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const wochentag = (y, mo, d) => new Date(Date.UTC(y, mo - 1, d)).getUTCDay();

  // Ohne COUNT muss nicht vom Serienbeginn an gezählt werden: direkt kurz vor den geprüften Zeitraum springen.
  const tageBisVon = Math.floor((von - s.utc) / 86400000) - 2;
  const sprung = (einheitTage) => (anzahl === Infinity && tageBisVon > 0 ? Math.floor(tageBisVon / (einheitTage * intervall)) * intervall : 0);
  if (freq === "DAILY") {
    for (let i = sprung(1); schritte++ < MAX_SCHRITTE; i += intervall) {
      const dt = new Date(Date.UTC(s.y, s.mo - 1, s.d + i));
      const y = dt.getUTCFullYear(), mo = dt.getUTCMonth() + 1, d = dt.getUTCDate();
      if (bymonth.length && !bymonth.includes(mo)) continue;
      if (byday.length && !byday.some((b) => b.tag === dt.getUTCDay())) continue;
      if (!nimm(lokal(y, mo, d))) break;
    }
  } else if (freq === "WEEKLY") {
    const tage = byday.length ? byday.map((b) => b.tag) : [wochentag(s.y, s.mo, s.d)];
    const wkst = TAGE[(r.WKST || "MO").toUpperCase()] ?? 1;
    const startWt = wochentag(s.y, s.mo, s.d);
    const wochenAnfang = (startWt - wkst + 7) % 7; // Tage seit Wochenbeginn
    const reihenfolge = [...tage].sort((a, b) => ((a - wkst + 7) % 7) - ((b - wkst + 7) % 7));
    outer: for (let w = sprung(7); schritte++ < MAX_SCHRITTE; w += intervall) {
      for (const tag of reihenfolge) {
        const versatz = w * 7 - wochenAnfang + ((tag - wkst + 7) % 7);
        const dt = new Date(Date.UTC(s.y, s.mo - 1, s.d + versatz));
        if (!nimm(lokal(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()))) break outer;
      }
    }
  } else if (freq === "MONTHLY" || freq === "YEARLY") {
    const monate = freq === "YEARLY" ? 12 : 1;
    outer: for (let i = sprung(freq === "YEARLY" ? 366 : 31); schritte++ < MAX_SCHRITTE; i += intervall) {
      const kandidatenMonate = [];
      if (freq === "YEARLY") {
        const y = s.y + i;
        for (const mo of bymonth.length ? bymonth : [s.mo]) kandidatenMonate.push([y, mo]);
      } else {
        const dt = new Date(Date.UTC(s.y, s.mo - 1 + i * monate, 1));
        kandidatenMonate.push([dt.getUTCFullYear(), dt.getUTCMonth() + 1]);
      }
      for (const [y, mo] of kandidatenMonate) {
        const n = tageImMonat(y, mo);
        let tage = [];
        if (bymonthday.length) tage = bymonthday.map((x) => (x < 0 ? n + 1 + x : x)).filter((x) => x >= 1 && x <= n);
        else if (byday.length) {
          for (const b of byday) {
            const passende = [];
            for (let d = 1; d <= n; d++) if (wochentag(y, mo, d) === b.tag) passende.push(d);
            if (!b.n) tage.push(...passende);
            else { const d = b.n > 0 ? passende[b.n - 1] : passende[passende.length + b.n]; if (d) tage.push(d); }
          }
        } else if (s.d <= n) tage = [s.d];
        for (const d of [...new Set(tage)].sort((a, b) => a - b)) if (!nimm(lokal(y, mo, d))) break outer;
      }
    }
  }
  return ergebnis;
}

function pruefe(termine, slots) {
  // Einzelne geänderte Vorkommen (RECURRENCE-ID) ersetzen das ursprüngliche Vorkommen der Serie
  const ersetzt = new Map();
  for (const t of termine) if (t.recId && t.uid) { if (!ersetzt.has(t.uid)) ersetzt.set(t.uid, new Set()); ersetzt.get(t.uid).add(t.recId.utc); }
  return slots.map(({ start, ende }) => {
    const konflikte = [];
    for (const t of termine) {
      if (t.status === "CANCELLED" || t.transp === "TRANSPARENT") continue;
      const dauer = t.ende ? t.ende.utc - t.start.utc : t.dauer || (t.start.ganztaegig ? 86400000 : 0);
      if (dauer <= 0) continue;
      const weg = !t.recId && t.uid && ersetzt.get(t.uid);
      for (const b of vorkommen(t, dauer, start, ende)) {
        if (weg && weg.has(b)) continue;
        konflikte.push({ start: b, ende: b + dauer, ganztaegig: !!t.start.ganztaegig });
      }
    }
    konflikte.sort((a, b) => a.start - b.start);
    return { status: konflikte.length ? "belegt" : "frei", konflikte: konflikte.slice(0, 5) };
  });
}

export default {
  async fetch(request, env) {
    const antwort = (o) => new Response(JSON.stringify(o), { headers: { "content-type": "application/json" } });
    if (!env.KALENDER_ICS) return antwort({ ok: false, grund: "nicht-verbunden" });
    let slots;
    try {
      slots = (await request.json()).slots;
      if (!Array.isArray(slots) || !slots.length || slots.length > 5) throw 0;
      slots = slots.map((x) => ({ start: +x.start, ende: +x.ende }));
      if (slots.some((x) => !(x.ende > x.start))) throw 0;
    } catch {
      return antwort({ ok: false, grund: "eingabe" });
    }
    let ics;
    try {
      const r = await fetch(env.KALENDER_ICS, { headers: { "user-agent": "ra-abesser.de Kalenderabgleich" } });
      if (!r.ok) throw new Error(String(r.status));
      ics = await r.text();
    } catch (e) {
      console.log("Kalender-Abruf fehlgeschlagen", String(e));
      return antwort({ ok: false, grund: "abruf" });
    }
    const von = Math.min(...slots.map((x) => x.start)), bis = Math.max(...slots.map((x) => x.ende));
    return antwort({ ok: true, ergebnis: pruefe(leseTermine(ics, von, bis), slots) });
  },
};

