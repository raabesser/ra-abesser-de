# ra-abesser.de

Static website (plain HTML/CSS, no build step), hosted on GitHub Pages from `main`.

## Hosting
- Domain `ra-abesser.de` is on Cloudflare (zone `6b8d754c1632e183534ff0851dfe90df`).
- Apex A/AAAA records point to GitHub Pages; `www` is a CNAME to `raabesser.github.io`. All proxied (orange cloud).
- Cloudflare provides the TLS certificate. SSL mode "Full", Always Use HTTPS on.
- Mail records (Strato: MX, DMARC `p=reject`, DKIM, autodiscover) must not be changed. Keep the existing DMARC record; there can only be one.
- Brevo domain authentication: TXT `brevo-code:…` on the apex, CNAMEs `brevo1._domainkey` and `brevo2._domainkey` (DNS only).

## Permissions
- The owner has given standing permission to use the Cloudflare MCP for this domain at any time, without asking first.
- Standing permission for everything in this project (GitHub, Cloudflare, Brevo): just do the work, don't ask for confirmation each step.

## Contact form
- `kontakt/index.html` posts JSON to `/api/kontakt` with a Cloudflare Turnstile token (sitekey `0x4AAAAAAF41vy0mR_0UU8DL`).
- `/api/kontakt` is the Cloudflare Worker `ra-abesser-kontakt` (source: `worker/kontakt.js`). It verifies Turnstile and sends via the Brevo transactional API to info@ra-abesser.de with the visitor as reply-to.
- Worker secrets: `TURNSTILE_SECRET` (from the Turnstile widget), `BREVO_API_KEY` (set by the owner in the Cloudflare dashboard; never put keys in the repo or chat).
- If the API fails, the form offers a mailto fallback.
