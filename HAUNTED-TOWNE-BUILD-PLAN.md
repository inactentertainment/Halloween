# HAUNTED TOWNE — Approved shopping, downloads and content blueprint

**Approved 2026-10-26.** Retain this plan across all later builds; do not replace existing story, movies, books, recipes, or games.

## Visual direction
- Horror-forward adult aesthetic: almost black and deep dried-blood red/oxblood, **not scarlet, pink, purple or cranberry**.
- Art direction: realistic or realistic illustrated cinematic horror, not childish cartoons. Disturbing and atmospheric without gratuitous offensive imagery.
- User screenshot reference: a Pinhead mask retail detail layout with large hero photography, several thumbnails, price/status, review section, a descriptive section, and related products. Reference only; do **not** copy proprietary product photographs or make up reviews.

## Navigation
- **Costumes** dropdown: Men, Women, Boys, Girls, Groups & Couples.
- **Masks**: Horror Icons, Monsters & Creatures, Realistic Latex, Cosplay & Collectibles.
- **Decor**: Life-Size Animatronics, Large Statues & Props, Haunted Home, Outdoor Graveyard, Lighting & Effects.
- Preserve Movies, Books, Recipes, History, Ghost Story, Fun & Games, Events, Shop.
- Fun & Games gets a prominent **Free Downloads** link.

## Product model
- Curated standout items, **not hundreds of generic listings**.
- Strong preference for big-ticket props, animated statues and dramatic set pieces, alongside costumes and masks.
- Product detail layout: large permitted main photo, clickable smaller thumbnails, brief item overview, specifications and safety/assembly/shipping pointers; short pop-culture, movie or historical context; verified reviews/price/inventory where legally available; one or more verified retailer/affiliate buttons; related suggestions.
- Contextual example: Pinhead/Hellraiser = Clive Barker-derived Cenobite pop culture background, license/quality/wearability guidance. Use accurate, sourced factual text rather than guessing.
- Start with AliExpress discovery, but consider other reputable merchants and affiliate partners where better items are found. Exact affiliate URLs are *not* activated until supplied/verified. No invented products, ratings, prices, purchase links or image permissions.

## Free downloads
- Four collections: Games; Adult Coloring Sheets; Kids Coloring Sheets; Activities. More collections can be added as resources are created.
- Future delivery through accessible public Google Drive folders, linked from Haunted Towne after user authorizes folders and actual share URLs exist.
- Do not imply inaccessible or hypothetical Google Drive folders are live. In the meantime, retain functioning Halloween trivia, Bingo, name generator, and candy estimator.
- Add downloadable PDF/doc files as they are authored and tested; no required sign-in.

## Site hosting
- Static GitHub Pages, independent of other InAct Entertainment LLC websites, keep hosting at zero incremental cost while practical.
- Keep images optimized; use lazy loading, no autoplay video grids, reusable templates.
- Preserve established reading toolbar and interactive fiction while developing this retail/discovery section.

## Planned build sequence
1. Navigation, decor storefront, downloads shell and editorial product guides.
2. Curate verified products (AliExpress and other retailers), licensing, images, direct links.
3. Detailed product pages with real photo galleries, available seller specs and historical notes.
4. Build accessible free Google Drive collections, real printables, and new games.
5. Whole-site interaction QA including mobile menu, products, links, downloads and performance.

## Cinematic browser engine (added October 26, 2026)
- Shared `cinematic-engine.js` and `cinematic-engine.css` added to the homepage, Halloween history and ghost-story pages; pure vanilla JS/CSS with no paid services or frameworks.
- Toggleable vignette and static film grain; short visual glitch on explicitly designated cursed elements; respects reduced-motion preference.
- Sound **off by default**. Web Audio-generated low drone and interaction tones use StereoPanner when the device supports it; user can switch audio on and off.
- Limited browser-only state machine tracks clicks on `data-cursed-object` elements; a clearly labeled reset erases the cinematic interaction memory. It does not track all user browsing or typing speed.
- `HTCinema.typewriter(element,text)`, `HTCinema.glitch(element)`, `HTCinema.tone(frequency,x)` and `HTCinema.record(id)` provide extension points for future story and game builds.
- First playable demonstration: **The Whispering Relic** under Fun & Games, responding differently to repeated visits. Existing games remain intact.
- Next cinematic phases: incorporate story branch choices in dedicated fiction, more object interactions, actual audio ambience sound design, mobile/performance and accessibility testing, visual screenshots. Keep engagement optional, not manipulative.
