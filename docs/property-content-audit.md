# Property content audit

Data file: `src/content/properties.ts`. Audited 15 Oct 2026.

Status values:

- **[V]** verified from the source reel's caption or post date
- **[O]** observed in the footage, a visual description and not a specification
- **[—]** unknown; stored as `null` and shown as "On request"

## Sources

| Source | What it supports |
| --- | --- |
| [instagram.com/venora_dubai](https://www.instagram.com/venora_dubai/), read 15 Oct 2026 | Name, logo, bio and positioning, the contact method (DM only), and the audience figures (26K followers, 86 posts) |
| The 12 most recent reels (`…/reel/{id}/`) | Property type, post date, "for sale", footage and the stills cut from it |

- No official website, listing-portal profile or broker register entry for Venora was found.
- Logged out, Instagram shows only the latest 12 posts.
- Raw reel tracks are kept in `media-source/reels/`, which is git-ignored. Rebuild the web media with `pnpm media`.

## Per-field verification

| Field | Status | Source | Notes |
| --- | --- | --- | --- |
| Property type | [V] | Caption ("Luxury villa / penthouse / apartment for sale") | A unit test asserts that each record's type appears in its caption. |
| Presented date | [V] | Reel post date | |
| Listing category: sale | [V] | Caption ("for sale") | Status as of the post date only. |
| Availability | [—] | — | Not published. Homes may have sold since. |
| City: Dubai | [V] | Caption | One caption, DdRH57EMqE1, omits "in Dubai". The account and bio are Dubai-only. |
| Community / address | [—] | — | Not published. Views suggest some locations, but those are not stated and are deliberately not used. |
| Price | [—] | — | Not published. |
| Bedrooms / bathrooms / size | [—] | — | Not published. |
| Developer / completion / payment plan | [—] | — | Not published. Captions do not indicate off-plan stock. |
| Title | [O] | Written from the film | Descriptive, for example "White villa behind a pivot door". It is not a project name. |
| Observed features | [O] | Frames from the film | Rendered under the heading "In the film". |
| Original caption | [V] | Reel caption with hashtags stripped | Quoted on each home page under "As published". |
| Media | [V] | The reel itself | Loops, films and stills are cut by `pnpm media`. |

## Records

| Slug | Reel | Type | Presented | Poster (s) | Gallery (s) | Loop |
| --- | --- | --- | --- | --- | --- | --- |
| villa-2026-10-13 | DebXKIxsAkw | Villa | 13 Oct 2026 | 6 | 16 | 4–12 s |
| villa-2026-10-09 | DeRAGRJsSvN | Villa | 9 Oct 2026 | 19 | 0.5 | 10–18 s |
| villa-2026-10-06 | DeLgdPpMHIa | Villa | 6 Oct 2026 | 4.7 | 7 | 0–9 s (hero) |
| villa-2026-10-01 | Dd9CQGjsh6t | Villa | 1 Oct 2026 | 2.7 | 26.7 | 0–8 s |
| apartment-2026-09-30 | Dd6Y9N7seI9 | Apartment | 30 Sep 2026 | 0.5 | 10.3 | 0–8 s |
| penthouse-2026-09-28 | Dd1SeRxMS-z | Penthouse | 28 Sep 2026 | 15 | 5 | 12–20 s |
| villa-2026-09-23 | Ddn1fjLshCx | Villa | 23 Sep 2026 | 7.3 | 18.2 | 0–8 s |
| villa-2026-09-21 | DdjBe4csG7h | Villa | 21 Sep 2026 | 4 | 0.5 | 0–8 s |
| villa-2026-09-16 | DdWNDZaMOI0 | Villa | 16 Sep 2026 | 8.5 | 14 | 6–14 s |
| penthouse-2026-09-14 | DdS88dKsDzG | Penthouse | 14 Sep 2026 | 3.3 | 33 | 0–8 s |
| villa-2026-09-14 | DdRH57EMqE1 | Villa | 14 Sep 2026 | 9.1 | 30.2 | 7–15 s |
| villa-2026-09-09 | DdEQCzlMs_y | Villa | 9 Sep 2026 | 25 | 10.8 | 0–8 s |

## Where each still appears

Every still belongs to exactly one home. A unit test enforces that no still key is used twice in the data. Sections reuse a home's own stills only.

| Placement | Home / still |
| --- | --- |
| Hero film frame and wordmark fill | villa-2026-10-06 (poster and loop) |
| Why triptych | villa-2026-10-13, penthouse-2026-09-28, villa-2026-10-01 (loops) |
| Portals | villa-2026-10-09, penthouse-2026-09-14, apartment-2026-09-30, villa-2026-09-16 (posters) |
| Type rows | villa-2026-10-13-b, penthouse-2026-09-14-b, apartment-2026-09-30-b |
| Route cards | villa-2026-10-06-b, penthouse-2026-09-28-b, villa-2026-09-23-b |
| Outro | villa-2026-09-21 (loop, blurred under a scrim) |

## Known gaps, to resolve with the client

1. Price, community, bedrooms, size and current availability for each home. Add them to the record and the UI shows them automatically, because `displayValue` renders real values when they are not `null`.
2. Whether any of these homes has sold. If so, remove the record or set `listing.availability`.
3. The 74 older posts were not reachable logged out. Each one can become a record.
4. Higher-resolution masters. Instagram streams are capped at 720×1280.

## Update workflow

1. Save the reel's video track as `media-source/reels/{reelId}.mp4`.
2. Add a `home(...)` entry in `src/content/properties.ts` with the poster and gallery timestamps, the loop window, alt text and observed features.
3. Run `pnpm media`, then `pnpm test`. The tests check type versus caption, unique stills and that media files exist.
4. Run `pnpm build`.
