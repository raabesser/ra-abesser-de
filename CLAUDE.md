# ra-abesser.de

Static website (plain HTML/CSS, no build step), hosted on GitHub Pages from `main`.

## Hosting
- Domain `ra-abesser.de` is on Cloudflare (zone `6b8d754c1632e183534ff0851dfe90df`).
- Apex A/AAAA records point to GitHub Pages; `www` is a CNAME to `raabesser.github.io`. All proxied (orange cloud).
- Cloudflare provides the TLS certificate. SSL mode "Full", Always Use HTTPS on.
- Mail records (Strato: MX, DMARC, DKIM, autodiscover) must not be changed.

## Permissions
- The owner has given standing permission to use the Cloudflare MCP for this domain at any time, without asking first.
