// Cloudflare Worker: ra-abesser.de/api/adresse  (Worker "ra-abesser-adresse")
// Adressvorschläge für die Mandantenformulare. Leitet nur den eingegebenen Adressteil an den
// Adressdienst Photon (komoot GmbH, Potsdam; Daten: OpenStreetMap) weiter – ohne IP-Adresse,
// Cookies oder sonstige Daten des Besuchers. Es wird nichts gespeichert oder protokolliert.
//
//   GET /api/adresse?plz=10787                      -> { orte: ["Berlin"] }
//   GET /api/adresse?q=Keithstr 14&plz=10787&ort=…   -> { vorschlaege: [{strasse, nr, plz, ort}] }

const ORIGINS = ["https://ra-abesser.de", "https://www.ra-abesser.de"];
const PHOTON = "https://photon.komoot.io/api/";
const BBOX_DE = "5.86,47.27,15.04,55.06";

function json(data, status = 200, origin) {
  const h = { "content-type": "application/json", "cache-control": "no-store" };
  if (origin) { h["access-control-allow-origin"] = origin; h["vary"] = "Origin"; }
  return new Response(JSON.stringify(data), { status, headers: h });
}

async function photon(q, extra) {
  const u = new URL(PHOTON);
  u.searchParams.set("q", q);
  u.searchParams.set("lang", "de");
  u.searchParams.set("limit", "10");
  u.searchParams.set("bbox", BBOX_DE);
  for (const [k, v] of extra || []) u.searchParams.append(k, v);
  const r = await fetch(u, { headers: { "user-agent": "ra-abesser.de Adressvorschlaege" } });
  if (!r.ok) throw new Error("photon " + r.status);
  const d = await r.json();
  return (d.features || []).map((f) => f.properties || {}).filter((p) => p.countrycode === "DE");
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let origin = request.headers.get("Origin");
    if (!origin && request.headers.get("Sec-Fetch-Site") === "same-origin") origin = url.origin;
    if (!ORIGINS.includes(origin)) return json({ ok: false, error: "origin" }, 403);
    if (url.pathname !== "/api/adresse" || request.method !== "GET") return json({ ok: false, error: "notfound" }, 404);

    const clean = (s, n) => (s || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
    const plz = clean(url.searchParams.get("plz"), 5);
    const ort = clean(url.searchParams.get("ort"), 60);
    const q = clean(url.searchParams.get("q"), 100);

    try {
      // Ort zur Postleitzahl
      if (!q) {
        if (!/^\d{5}$/.test(plz)) return json({ orte: [] }, 200, origin);
        const ps = await photon(plz);
        const orte = [...new Set(ps.filter((p) => p.postcode === plz || p.name === plz).map((p) => p.city || p.town || p.village).filter(Boolean))];
        return json({ orte: orte.slice(0, 5) }, 200, origin);
      }
      // Straße (mit Hausnummer)
      if (q.length < 3) return json({ vorschlaege: [] }, 200, origin);
      const such = [q, /^\d{5}$/.test(plz) ? plz : "", ort].filter(Boolean).join(" ");
      const ps = await photon(such, [["layer", "house"], ["layer", "street"]]);
      const seen = new Set(), out = [];
      for (const p of ps) {
        const strasse = p.type === "street" ? p.name : p.street;
        const v = { strasse: strasse || "", nr: p.housenumber || "", plz: p.postcode || "", ort: p.city || p.town || p.village || "" };
        if (!v.strasse || !v.plz) continue;
        if (/^\d{5}$/.test(plz) && v.plz !== plz) continue;
        const key = [v.strasse, v.nr, v.plz].join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(v);
        if (out.length >= 6) break;
      }
      return json({ vorschlaege: out }, 200, origin);
    } catch (e) {
      return json({ vorschlaege: [], orte: [], fehler: true }, 200, origin);
    }
  },
};
