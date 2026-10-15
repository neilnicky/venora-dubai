# Venora Dubai design system

How the site looks and moves, and where each decision lives in code. Content rules and the property data workflow are in `property-content-audit.md`.

## Brand basis

- **Name and lockup:** VENORA with "LUXURY REAL ESTATE" beneath it, from the Instagram avatar of @venora_dubai.
- **Positioning:** taken from the bio. "Your gateway to Dubai's ultra-luxury real estate. Exclusive homes and investment opportunities. DM to discover more."
- **Contact:** the only published channel is Instagram direct message, so the enquiry flow ends in a DM.
- **Wordmark:** `pnpm wordmark` rebuilds it as SVG outlines from Marcellus, keeping the logo's dot inside the O. It is a stand-in until the client supplies vector artwork. The generated paths in `src/content/wordmark.ts` also serve as the hero's CSS mask.

## Colour (`src/styles/tokens.css`)

| Token | Value | Origin | Use |
| --- | --- | --- | --- |
| `--teal-900` | `#013134` | Logo | Dark sections, footer, primary buttons, hero |
| `--gold-200` | `#DFD9B2` | Logo | Wordmark, text and accents on teal (9.9:1) |
| `--teal-950` / `--teal-800` / `--teal-700` | `#012325` / `#063D40` / `#0E4A4C` | Extension | Depth, hover states, hairlines on dark |
| `--gold-mute` | `#94A087` | Extension | Second tone on teal (5.1:1) |
| `--gold-700` | `#7A6A33` | Extension | Gold accents on light surfaces (5.1:1) |
| `--paper` / `--sand-100` / `--sand-200` | `#FBFAF6` / `#F2EEE4` / `#E6E0D1` | Extension | Light surfaces, warmed to sit with the travertine in the footage |
| `--ink` / `--ink-mute` | `#0B1D1E` / `#667170` | Extension | Text on light (16.6:1 and 4.8:1) |

Gold is never used for body text on light surfaces. To change the palette, edit the tokens; components use the variables only.

## Type

- **Marcellus** (display) for headings from 34 px up and for the large type-row words. It is a single weight, so emphasis comes from tone, not boldness.
- **Hanken Grotesk** (variable) for text and UI.
- **Two-tone lines:** headings and leads set the first phrase in full ink and the rest in the muted tone. These are `ToneLine` objects in `venora-content.ts`, rendered by `Tone.astro`.
- **Scale:**
  - H1: 44 → 105 px
  - H2: 34 → 54 px
  - Lead: 20 → 24 px
  - UI: 13.5 px
  - Eyebrows: 12 px uppercase, tracked +0.18em to echo the logo's tagline

## Layout

- **Container:** 1290 px of content with a fluid gutter (16 → 75 px).
- **Editorial grid (`.split`):** a caption column and a content column at about 43 : 57. It collapses to one column below 900 px.
- **Vertical rhythm:** `--section-y`, 80 → 160 px.
- **Arches:** frames with a semicircular head repeat across the hero film, the portals row and the home-page film player.

## Components

| Component | Notes |
| --- | --- |
| `Button` | 44 px pill with an arrow. Variants: ink, light, outline, outline-light. Pass `enquire` to open the enquiry dialog with presets; without JS it falls back to `/enquire?…`. |
| `Still` | AVIF/WebP `<picture>` from `src/assets/stills`, with focal position from the data. |
| `LoopVideo` | A muted loop. It loads only near the viewport and plays only while visible. Pass `withPoster={false}` when a still already sits underneath. |
| `PropertyCard` | Poster with a hover loop on fine pointers. The whole card links to the home page; the enquiry button sits above that link. |
| `EnquiryForm` / `EnquiryDialog` | One form used in a native `<dialog>` and on `/enquire`. |
| Header | Fixed. Hides on scroll down and returns on scroll up. Takes its colour from the section beneath it (`data-header-theme`). |

## Motion (`src/motion/`)

One rAF-batched scroll loop (`scroll.ts`) drives every scrubbed scene. Scenes write only `transform`, `opacity` and `clip-path`. Lenis adds smooth scrolling.

| Pattern | Module | Behaviour |
| --- | --- | --- |
| Hero scene | `hero.ts` | 300svh of travel over a sticky stage. By scroll progress: 0–25% the copy recedes and the gold wordmark outline draws over the rising film frame. At 30–50% the frame crossfades into the wordmark filled with the villa facade. Throughout, the frame scales 1 → 1.29 and a sand haze rises. At 84–98% a paper veil hands off to the next section. |
| Line wipe | `wipe.ts` | Text splits into rendered lines. Each line's cover (90% of the section colour) scrubs `scaleX` 1 → 0. Lines re-split when the width changes. |
| Panel growth | `grow.ts` | The Why triptych opens from an inset clip as it enters. |
| Enter reveals | `reveal.ts` | One-shot `.is-in` for `[data-reveal]` and the portals cascade (scale .8 and −26 px to rest, staggered 120 ms). |
| Type rows | CSS | On hover or focus, the image reveals by clip (1 s) and settles in scale (1.05 → 1 over 4 s), the arrow slides in (0.8 s) and an underline draws. Sibling rows dim. |
| Route cards | CSS | The hovered card widens through `grid-template-columns` (1 s) and its text fades in. |

The easing curves are `--ease-out: cubic-bezier(.16,1,.3,1)` and `--ease-settle: cubic-bezier(.5,1,.89,1)`.

**Reduced motion:**

- no smooth scrolling and no scrubbing
- no autoplay; posters show instead
- the hero is a single static composition
- every section renders its final state

Save-Data also suppresses video.

## Imagery

- Use only Venora's own footage (the reels). Do not use stock or developer imagery.
- Sources are portrait 720×1280, so the layouts favour portrait frames. Full-bleed use is limited to the softened outro and the type-mask, where the letterforms hide the softness.
- Each still belongs to one home, and no still is reused for a different home.

## Accessibility

- semantic landmarks and a skip link
- one `h1` per page
- labelled form fields with live error messages
- native dialogs for the menu and the enquiry form
- visible focus rings in both themes
- 44 px touch targets
- E2E checks for horizontal overflow at 320, 390, 768 and 1280 px

## Open items for the client

- domain
- broker licence and legal details
- phone, email or WhatsApp
- per-home price, community, size and availability
- vector logo
- higher-resolution footage
