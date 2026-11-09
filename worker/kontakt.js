// Cloudflare Worker: ra-abesser.de/api/kontakt
// Receives the contact form, checks Turnstile, and sends the message via Brevo.
// Optional attachments (anhaenge: [{name, content(base64)}]) are checked and passed on to Brevo.
// Identical messages sent again within 10 minutes are not mailed twice.
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
async function dupKey(f, att) {
  const raw = [f.email.toLowerCase(), f.betreff, f.nachricht, ...att.info].join("\n");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return new Request(`https://ra-abesser.de/__kontakt-dup/${hex}`);
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
    if (data.consent !== true) return json(400, { ok: false, error: "consent" });
    const att = checkAttachments(data.anhaenge);
    if (!att) return json(400, { ok: false, error: "files" });

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

    const key = await dupKey(f, att);
    if (await caches.default.match(key)) return json(200, { ok: true, duplicate: true });

    const fullName = `${f.vorname} ${f.name}`;
    const text =
      `Neue Anfrage über das Kontaktformular auf ra-abesser.de\n\n` +
      `Name: ${fullName}\nE-Mail: ${f.email}\nBetreff: ${f.betreff}\n\n${f.nachricht}\n\n` +
      (att.info.length ? `Anhänge: ${att.info.join(", ")}\n\n` : "") +
      `— Einwilligung zur Datenschutzerklärung erteilt.`;
    const html =
      `<p>Neue Anfrage über das Kontaktformular auf ra-abesser.de</p>` +
      `<p><b>Name:</b> ${esc(fullName)}<br><b>E-Mail:</b> ${esc(f.email)}<br><b>Betreff:</b> ${esc(f.betreff)}</p>` +
      `<p style="white-space:pre-wrap">${esc(f.nachricht)}</p>` +
      (att.info.length ? `<p><b>Anhänge:</b> ${att.info.map(esc).join(", ")}</p>` : "") +
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
