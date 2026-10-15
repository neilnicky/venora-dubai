# Venora Dubai

The website for **Venora Dubai** (`@venora_dubai`), presenting luxury villas, penthouses and apartments for sale in Dubai, each with its walkthrough film.

Built with Astro 7 (static output), vanilla TypeScript motion modules and Lenis.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Type check (`astro check`), then static build to `dist/` |
| `pnpm preview` | Serve `dist/` |
| `pnpm test` | Vitest unit tests: filtering, enquiry composition and content integrity |
| `pnpm test:e2e` | Playwright E2E against the production build, desktop and mobile. Run `pnpm build` first. |
| `pnpm media` | Cut stills, loops and films from `media-source/reels/` (needs `ffmpeg`) |
| `pnpm wordmark` | Regenerate the VENORA wordmark paths from Marcellus |

## Where things live

```
src/content/          site-config.ts (contacts, enquiry endpoint), properties.ts (homes),
                      venora-content.ts (all copy), navigation.ts, types.ts, wordmark.ts (generated)
src/lib/              homes.ts (filter/sort/format), enquiry.ts (validate/compose), media.ts
src/components/       shell + home/ sections
src/motion/           one scroll driver (scroll.ts) + per-pattern modules
src/styles/tokens.css design tokens (brand palette, type scale, easing)
docs/                 design-system.md, property-content-audit.md
                      (docs/internal/ is git-ignored: local working notes only)
```

## Enquiries

Venora publishes one contact channel: Instagram direct message.

- With `siteConfig.enquiry.endpoint = null` (the current setting), the form validates the input and writes the message. It copies the message to the clipboard and offers an **Open Instagram chat** link to `ig.me/m/venora_dubai`. It never says a message was sent.
- If you set `endpoint` to a URL that accepts `POST` JSON (see `toPayload` in `src/lib/enquiry.ts`), the form submits there instead. It shows success only on a 2xx response.
- Phone, WhatsApp, email and address are `null` until the client confirms them. The UI hides null channels.

## Content rules

- Never publish a price, community, size, developer, availability, testimonial or performance claim unless it has a source. Unknown fields stay `null` and render as "On request".
- `tests/unit/content.test.ts` enforces this, and also checks for unique stills and that media files exist.

## Documentation

- `docs/design-system.md`: brand basis, tokens, type, layout, components, motion and open items
- `docs/property-content-audit.md`: content sources, per-field verification and the update workflow

## Before launch

Confirm these with the client:

- domain (update `astro.config.mjs` `site` and `siteConfig.url`)
- licence and legal details
- extra contact channels
- per-home facts and availability
- vector logo artwork
