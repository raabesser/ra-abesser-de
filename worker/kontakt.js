// Cloudflare Worker: ra-abesser.de/api/kontakt
// Receives the contact form, checks Turnstile, and sends the message via Brevo.
// Secrets (set in Cloudflare, never in this file): TURNSTILE_SECRET, BREVO_API_KEY

const TO = { email: "info@ra-abesser.de", name: "Rechtsanwalt Abeßer" };
const SENDER = { email: "info@ra-abesser.de", name: "Kontaktformular ra-abesser.de" };
const ORIGINS = ["https://ra-abesser.de", "https://www.ra-abesser.de"];
const MAX = { vorname: 100, name: 100, email: 200, betreff: 200, nachricht: 10000 };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

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

    const fullName = `${f.vorname} ${f.name}`;
    const text =
      `Neue Anfrage über das Kontaktformular auf ra-abesser.de\n\n` +
      `Name: ${fullName}\nE-Mail: ${f.email}\nBetreff: ${f.betreff}\n\n${f.nachricht}\n\n` +
      `— Einwilligung zur Datenschutzerklärung erteilt.`;
    const html =
      `<p>Neue Anfrage über das Kontaktformular auf ra-abesser.de</p>` +
      `<p><b>Name:</b> ${esc(fullName)}<br><b>E-Mail:</b> ${esc(f.email)}<br><b>Betreff:</b> ${esc(f.betreff)}</p>` +
      `<p style="white-space:pre-wrap">${esc(f.nachricht)}</p>` +
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
      }),
    });
    if (!res.ok) {
      console.error("Brevo error", res.status, await res.text());
      return json(502, { ok: false, error: "send" });
    }
    return json(200, { ok: true });
  },
};
