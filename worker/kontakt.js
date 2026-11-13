// Cloudflare Worker: ra-abesser.de/api/kontakt
// Receives the contact form, checks Turnstile, and sends the message via Brevo.
// Optional attachments (anhaenge: [{name, content(base64)}]) are checked and passed on to Brevo.
// Identical messages sent again within 10 minutes are not mailed twice.
// Optional phone number (telefon) is included in the e-mail.
// Videoberatung: optional wunschtermine ["YYYY-MM-DDTHH:MM", …] (Berliner Zeit, höchstens 3). Dann enthält die E-Mail
// je Wunschtermin den Kalenderstatus (Service-Bindung KALENDER -> Worker "ra-abesser-kalender") sowie fertige
// Antwort-Entwürfe (mailto) mit neuem Videolink und einen Link zum Eintragen in Google Kalender.
// Secrets (set in Cloudflare, never in this file): TURNSTILE_SECRET, BREVO_API_KEY

const TO = { email: "info@ra-abesser.de", name: "Rechtsanwalt Abeßer" };
const SENDER = { email: "info@ra-abesser.de", name: "Kontaktformular ra-abesser.de" };
const ORIGINS = ["https://ra-abesser.de", "https://www.ra-abesser.de"];
const MAX = { vorname: 100, name: 100, email: 200, betreff: 200, nachricht: 10000 };
const MAX_FILES = 5;
const MAX_TOTAL = 10 * 1024 * 1024; // 10 MB (decoded)
// Allowed types: extension -> expected first bytes ("magic numbers")
const MAGIC = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47]],
  docx: [[0x50, 0x4b, 0x03, 0x04]],
  doc: [[0xd0, 0xcf, 0x11, 0xe0]],
};

// Returns { list, info } or null if the attachments are not acceptable.
function checkAttachments(raw) {
  if (raw === undefined) return { list: [], info: [] };
  if (!Array.isArray(raw) || raw.length > MAX_FILES) return null;
  let total = 0;
  const list = [], info = [];
  for (const a of raw) {
    if (!a || typeof a.name !== "string" || typeof a.content !== "string") return null;
    const name = a.name.normalize("NFC").replace(/[^\p{L}\p{N} ._()-]/gu, "_").slice(-150);
    const ext = (name.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
    if (!ext || !MAGIC[ext]) return null;
    const c = a.content;
    const size = Math.floor((c.length * 3) / 4) - (c.endsWith("==") ? 2 : c.endsWith("=") ? 1 : 0);
    if (size <= 0) return null;
    total += size;
    if (total > MAX_TOTAL) return null;
    let head;
    try {
      head = Uint8Array.from(atob(c.slice(0, 12)), (ch) => ch.charCodeAt(0));
    } catch {
      return null;
    }
    if (!MAGIC[ext].some((m) => m.every((b, i) => head[i] === b))) return null;
    list.push({ name, content: c });
    info.push(`${name} (${Math.max(1, Math.round(size / 1024))} KB)`);
  }
  return { list, info };
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// Duplicate protection: the same message (same e-mail, subject, text and files) is sent only once
// within DUP_SECONDS. A short-lived marker is kept in the Cloudflare cache (no message content is stored).
const DUP_SECONDS = 600;
async function dupKey(f, att, wunsch) {
  const raw = [f.email.toLowerCase(), f.betreff, f.nachricht, ...att.info, ...(wunsch || []).map((w) => String(w.start))].join("\n");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return new Request(`https://ra-abesser.de/__kontakt-dup/${hex}`);
}

// ---------- Videoberatung ----------
const VIDEO_DAUER_MIN = 60;
const VIDEO_BASIS = "https://ra-abesser.de/video/";
const letzterSonntag = (y, mo) => { const d = new Date(Date.UTC(y, mo, 0)); return d.getUTCDate() - d.getUTCDay(); };
function berlinOffset(utc) {
  const y = new Date(utc).getUTCFullYear();
  return utc >= Date.UTC(y, 2, letzterSonntag(y, 3), 1) && utc < Date.UTC(y, 9, letzterSonntag(y, 10), 1) ? 7200000 : 3600000;
}
function berlinZuUtc(y, mo, d, h, mi) {
  const naiv = Date.UTC(y, mo - 1, d, h, mi);
  return naiv - berlinOffset(naiv - berlinOffset(naiv));
}
const WT = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MON = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const zwei = (n) => String(n).padStart(2, "0");
function berlinTeile(utc) { const t = new Date(utc + berlinOffset(utc)); return { y: t.getUTCFullYear(), mo: t.getUTCMonth(), d: t.getUTCDate(), wt: t.getUTCDay(), h: t.getUTCHours(), mi: t.getUTCMinutes() }; }
const uhr = (utc) => { const t = berlinTeile(utc); return `${zwei(t.h)}:${zwei(t.mi)}`; };
const datumLang = (utc) => { const t = berlinTeile(utc); return `${WT[t.wt]}, ${t.d}. ${MON[t.mo]} ${t.y}`; };
const datumKurz = (utc) => { const t = berlinTeile(utc); return `${WT[t.wt].slice(0, 2)}., ${zwei(t.d)}.${zwei(t.mo + 1)}.${t.y}`; };
const gcalZeit = (utc) => new Date(utc).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function leseWunschtermine(raw) {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > 3) return null;
  const jetzt = Date.now(), out = [];
  for (const w of raw) {
    const m = typeof w === "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(w.trim());
    if (!m) return null;
    const start = berlinZuUtc(+m[1], +m[2], +m[3], +m[4], +m[5]);
    if (!(start > jetzt) || start > jetzt + 400 * 86400000) return null;
    if (!out.some((x) => x.start === start)) out.push({ start, ende: start + VIDEO_DAUER_MIN * 60000 });
  }
  return out.sort((a, b) => a.start - b.start);
}

async function kalenderPruefen(env, slots) {
  if (!env.KALENDER) return { ok: false, grund: "nicht-verbunden" };
  try {
    const r = await Promise.race([
      env.KALENDER.fetch("https://kalender.intern/pruefen", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slots }) }),
      new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 6000)),
    ]);
    return await r.json();
  } catch (e) {
    console.log("Kalenderabgleich fehlgeschlagen", String(e));
    return { ok: false, grund: "fehler" };
  }
}

function videoRaum() {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Liefert { text, html } für den Abschnitt „Videoberatung“ der E-Mail an die Kanzlei.
function videoAbschnitt(f, slots, kal) {
  const link = VIDEO_BASIS + "#" + videoRaum();
  const anrede = `Guten Tag ${f.vorname} ${f.name},`;
  const gruss = `Mit freundlichen Grüßen\n\nRechtsanwalt Tobias Abeßer\nKeithstr. 14, 10787 Berlin\nTel. +49 30 39 90 34 06\ninfo@ra-abesser.de`;
  const hinweis =
    `Sie benötigen kein Konto und kein Programm, nur einen aktuellen Browser (z. B. Chrome, Edge, Firefox oder Safari) ` +
    `auf Computer, Tablet oder Smartphone mit Kamera und Mikrofon. Kamera und Mikrofon können Sie vorab hier testen: ${VIDEO_BASIS}\n\n` +
    `Bitte geben Sie den Link nicht weiter.`;
  const mailto = (betreff, text) => `mailto:${encodeURIComponent(f.email).replace("%40", "@")}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
  const statusText = (i) => {
    if (!kal || !kal.ok) return kal && kal.grund === "nicht-verbunden" ? "Kalender noch nicht verbunden" : "Kalender konnte nicht geprüft werden";
    const e = kal.ergebnis[i];
    if (e.status === "frei") return "frei laut Kalender";
    return "BELEGT laut Kalender (" + e.konflikte.map((k) => (k.ganztaegig ? "ganztägiger Eintrag" : `${uhr(k.start)}–${uhr(k.ende)}`)).join(", ") + ")";
  };
  const zeilenText = [], zeilenHtml = [];
  slots.forEach((s, i) => {
    const wann = `${datumLang(s.start)}, um ${uhr(s.start)} Uhr`;
    const betreff = `Ihre Videoberatung am ${datumKurz(s.start)} um ${uhr(s.start)} Uhr`;
    const text =
      `${anrede}\n\nvielen Dank für Ihre Anfrage. Gern bestätige ich Ihnen den Termin zur Videoberatung am ${wann} ` +
      `(Dauer bis zu ${VIDEO_DAUER_MIN} Minuten).\n\nBitte öffnen Sie zum Termin diesen Link:\n${link}\n\n${hinweis}\n\n${gruss}`;
    const gcal =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent("Videoberatung " + f.vorname + " " + f.name)}` +
      `&dates=${gcalZeit(s.start)}/${gcalZeit(s.ende)}&ctz=Europe/Berlin` +
      `&details=${encodeURIComponent("Videolink: " + link + "\nE-Mail: " + f.email + (f.telefon ? "\nTelefon: " + f.telefon : ""))}`;
    const st = statusText(i), belegt = /^BELEGT/.test(st);
    zeilenText.push(`${i + 1}. ${datumKurz(s.start)}, ${uhr(s.start)}–${uhr(s.ende)} Uhr – ${st}\n   Antwort-Entwurf: ${mailto(betreff, text)}\n   In Google Kalender eintragen: ${gcal}`);
    zeilenHtml.push(
      `<li style="margin:0 0 12px"><b>${esc(datumKurz(s.start))}, ${uhr(s.start)}–${uhr(s.ende)} Uhr</b> – ` +
      `<span style="color:${belegt ? "#b3261e" : /^frei/.test(st) ? "#1b7f3b" : "#666"};font-weight:bold">${esc(st)}</span><br>` +
      `<a href="${esc(mailto(betreff, text))}">Antwort-Entwurf öffnen (Termin bestätigen)</a> · ` +
      `<a href="${esc(gcal)}">In Google Kalender eintragen</a></li>`
    );
  });
  const altText =
    `${anrede}\n\nvielen Dank für Ihre Anfrage. Leider passt keiner der vorgeschlagenen Termine. Ich schlage Ihnen stattdessen vor:\n\n` +
    `[Wochentag, Datum, Uhrzeit eintragen]\n\nBitte bestätigen Sie mir kurz, ob der Termin passt. Zum Termin öffnen Sie dann diesen Link:\n${link}\n\n${hinweis}\n\n${gruss}`;
  const alt = mailto("Ihre Anfrage zur Videoberatung – Terminvorschlag", altText);
  return {
    text:
      `\n\nVIDEOBERATUNG – Wunschtermine (je ${VIDEO_DAUER_MIN} Minuten):\n` + zeilenText.join("\n") +
      `\n\nAnderen Termin vorschlagen (Entwurf): ${alt}\n\nVideolink für dieses Gespräch: ${link}\n(Ihren Link öffnen Sie zum Termin ebenfalls – der Mandant erhält ihn mit der Antwort.)`,
    html:
      `<div style="margin:18px 0;padding:14px 16px;border:1px solid #c8d6ea;border-radius:8px;background:#f3f7fc">` +
      `<p style="margin:0 0 10px"><b>Videoberatung – Wunschtermine</b> (je ${VIDEO_DAUER_MIN} Minuten, mit Ihrem Kalender abgeglichen):</p>` +
      `<ol style="margin:0 0 6px;padding-left:20px">${zeilenHtml.join("")}</ol>` +
      `<p style="margin:0 0 8px"><a href="${esc(alt)}">Antwort-Entwurf: anderen Termin vorschlagen</a></p>` +
      `<p style="margin:0;color:#555">Videolink für dieses Gespräch: <a href="${esc(link)}">${esc(link)}</a><br>` +
      `Zum Termin öffnen Sie denselben Link. Ein Klick auf „Antwort-Entwurf öffnen“ öffnet eine fertige E-Mail an den Mandanten – bitte vor dem Senden prüfen.</p></div>`,
  };
}

const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return json(405, { ok: false, error: "method" });

    const origin = request.headers.get("origin");
    if (origin && !ORIGINS.includes(origin)) return json(403, { ok: false, error: "origin" });

    let data;
    try {
      data = await request.json();
    } catch {
      return json(400, { ok: false, error: "invalid" });
    }

    const f = {};
    for (const [k, max] of Object.entries(MAX)) {
      const v = typeof data[k] === "string" ? data[k].trim() : "";
      if (!v || v.length > max) return json(400, { ok: false, error: "field", field: k });
      f[k] = v;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return json(400, { ok: false, error: "field", field: "email" });
    // Telefonnummer (seit dem Telefonfeld im Formular; leer erlaubt, damit ältere Formularstände weiter funktionieren)
    const tel = typeof data.telefon === "string" ? data.telefon.trim() : "";
    if (tel && !/^[0-9 +\/.()-]{5,40}$/.test(tel)) return json(400, { ok: false, error: "field", field: "telefon" });
    f.telefon = tel;
    if (data.consent !== true) return json(400, { ok: false, error: "consent" });
    const att = checkAttachments(data.anhaenge);
    if (!att) return json(400, { ok: false, error: "files" });
    const wunsch = leseWunschtermine(data.wunschtermine);
    if (!wunsch) return json(400, { ok: false, error: "field", field: "wunschtermine" });

    // Turnstile check
    const ts = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: String(data.token || ""),
        remoteip: request.headers.get("cf-connecting-ip") || "",
      }),
    }).then((r) => r.json());
    if (!ts.success) return json(403, { ok: false, error: "captcha" });

    if (!env.BREVO_API_KEY) return json(503, { ok: false, error: "config" });

    const key = await dupKey(f, att, wunsch);
    if (await caches.default.match(key)) return json(200, { ok: true, duplicate: true });

    const fullName = `${f.vorname} ${f.name}`;
    const video = wunsch.length ? videoAbschnitt(f, wunsch, await kalenderPruefen(env, wunsch)) : { text: "", html: "" };
    const text =
      `Neue Anfrage über das Kontaktformular auf ra-abesser.de\n\n` +
      `Name: ${fullName}\nE-Mail: ${f.email}\n` + (f.telefon ? `Telefon: ${f.telefon}\n` : "") + `Betreff: ${f.betreff}\n\n${f.nachricht}\n\n` +
      (att.info.length ? `Anhänge: ${att.info.join(", ")}\n\n` : "") +
      `— Einwilligung zur Datenschutzerklärung erteilt.` + video.text;
    const html =
      `<p>Neue Anfrage über das Kontaktformular auf ra-abesser.de</p>` +
      `<p><b>Name:</b> ${esc(fullName)}<br><b>E-Mail:</b> ${esc(f.email)}<br>` + (f.telefon ? `<b>Telefon:</b> ${esc(f.telefon)}<br>` : "") + `<b>Betreff:</b> ${esc(f.betreff)}</p>` +
      `<p style="white-space:pre-wrap">${esc(f.nachricht)}</p>` +
      (att.info.length ? `<p><b>Anhänge:</b> ${att.info.map(esc).join(", ")}</p>` : "") +
      video.html +
      `<p style="color:#888">Einwilligung zur Datenschutzerklärung erteilt.</p>`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: SENDER,
        to: [TO],
        replyTo: { email: f.email, name: fullName },
        subject: `Kontaktformular: ${f.betreff}`,
        textContent: text,
        htmlContent: html,
        tags: ["kontaktformular"],
        ...(att.list.length ? { attachment: att.list } : {}),
      }),
    });
    if (!res.ok) {
      console.error("Brevo error", res.status, await res.text());
      return json(502, { ok: false, error: "send" });
    }
    await caches.default.put(key, new Response("1", { headers: { "cache-control": `max-age=${DUP_SECONDS}` } }));
    return json(200, { ok: true });
  },
};
