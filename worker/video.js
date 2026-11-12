// Cloudflare Worker: ra-abesser.de/api/video/*  (Worker "ra-abesser-video")
// Vermittlung ("Signaling") für das Videoportal. Bild und Ton laufen NICHT über diesen Worker,
// sondern verschlüsselt direkt zwischen den beiden Browsern (WebRTC), notfalls über das
// Cloudflare-TURN-Relais (das die verschlüsselten Daten nur weiterreicht).
// Der Worker speichert keine Inhalte. Ein Gesprächsraum lebt nur, solange jemand verbunden ist.
//
// Endpunkte:
//   GET /api/video/ice          -> ICE-Server (STUN/TURN) für den Browser, kurzlebige Zugangsdaten
//   GET /api/video/raum/<id>    -> WebSocket in den Gesprächsraum <id> (höchstens 2 Teilnehmer)
//
// Secrets (in Cloudflare, nie in dieser Datei): TURN_KEY_ID, TURN_KEY_API_TOKEN
// Binding: Durable Object "ROOMS" (Klasse Room)

const ORIGINS = ["https://ra-abesser.de", "https://www.ra-abesser.de"];
const ROOM_ID = /^[A-Za-z0-9_-]{22,64}$/;
const MAX_PEERS = 2;
const MAX_MSG = 64 * 1024;
const STALE_MS = 45 * 1000; // Browser senden alle 15 s ein Lebenszeichen ("ping")

function json(data, status = 200, origin) {
  const h = { "content-type": "application/json", "cache-control": "no-store" };
  if (origin) { h["access-control-allow-origin"] = origin; h["vary"] = "Origin"; }
  return new Response(JSON.stringify(data), { status, headers: h });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    if (!ORIGINS.includes(origin)) return json({ ok: false, error: "origin" }, 403);

    if (url.pathname === "/api/video/ice" && request.method === "GET") {
      const fallback = [{ urls: ["stun:stun.cloudflare.com:3478"] }];
      if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) return json({ iceServers: fallback }, 200, origin);
      try {
        const r = await fetch(
          `https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`,
          {
            method: "POST",
            headers: { authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`, "content-type": "application/json" },
            body: JSON.stringify({ ttl: 4 * 3600 }),
          }
        );
        if (!r.ok) throw new Error("turn " + r.status);
        const data = await r.json();
        // Port 53 wird von manchen Browsern blockiert – herausfiltern.
        const ice = (data.iceServers || []).map((s) => ({
          ...s,
          urls: [].concat(s.urls).filter((u) => !/:53(\?|$)/.test(u)),
        }));
        return json({ iceServers: ice }, 200, origin);
      } catch (e) {
        console.log("ice error", String(e));
        return json({ iceServers: fallback }, 200, origin);
      }
    }

    const m = url.pathname.match(/^\/api\/video\/raum\/([^/]+)$/);
    if (m) {
      if (request.headers.get("Upgrade") !== "websocket") return json({ ok: false, error: "websocket" }, 426);
      if (!ROOM_ID.test(m[1])) return json({ ok: false, error: "room" }, 400);
      const stub = env.ROOMS.get(env.ROOMS.idFromName(m[1]));
      return stub.fetch(request);
    }
    return json({ ok: false, error: "notfound" }, 404);
  },
};

// Ein Gesprächsraum. Reicht Nachrichten (Verbindungsangebote, Netzadressen) an den anderen Teilnehmer weiter.
export class Room {
  constructor(state) {
    this.state = state;
  }

  others(ws) {
    return this.state.getWebSockets("peer").filter((o) => o !== ws);
  }

  async fetch() {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    // Verbindungen ohne Lebenszeichen (z. B. Handy hat Netz verloren) räumen, damit der Raum nicht blockiert.
    const now = Date.now();
    for (const o of this.state.getWebSockets("peer")) {
      const t = (o.deserializeAttachment() || {}).t || 0;
      if (now - t > STALE_MS) {
        for (const p of this.others(o)) { try { p.send(JSON.stringify({ type: "peer-left" })); } catch {} }
        try { o.close(4001, "stale"); } catch {}
      }
    }
    const present = this.state.getWebSockets("peer").filter((o) => now - ((o.deserializeAttachment() || {}).t || 0) <= STALE_MS);
    if (present.length >= MAX_PEERS) {
      this.state.acceptWebSocket(server, ["full"]);
      server.send(JSON.stringify({ type: "full" }));
      server.close(4000, "full");
      return new Response(null, { status: 101, webSocket: client });
    }
    this.state.acceptWebSocket(server, ["peer"]);
    server.serializeAttachment({ t: now });
    server.send(JSON.stringify({ type: "hello", peers: present.length }));
    for (const o of present) {
      try { o.send(JSON.stringify({ type: "peer-joined" })); } catch {}
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, msg) {
    if (!this.state.getTags(ws).includes("peer")) return;
    if (typeof msg !== "string" || msg.length > MAX_MSG) return;
    ws.serializeAttachment({ t: Date.now() });
    if (msg === "ping") { try { ws.send("pong"); } catch {} return; }
    for (const o of this.others(ws)) {
      try { o.send(msg); } catch {}
    }
  }

  webSocketClose(ws) {
    if (this.state.getTags(ws).includes("peer")) for (const o of this.others(ws)) {
      try { o.send(JSON.stringify({ type: "peer-left" })); } catch {}
    }
    try { ws.close(1000, "bye"); } catch {}
  }

  webSocketError(ws) {
    this.webSocketClose(ws);
  }
}
