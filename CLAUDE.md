# Giacobbi's — website redesign (staging)

Redesign of giacobbis.com for Giacobbi's Cucina Citta, 59 Allen St. (at Franklin), Buffalo NY 14202. It's the owner's family restaurant (owners: cousins Billy and Mike Jacobbi). The current live site is WordPress on GoDaddy cPanel hosting, with DNS on Cloudflare. This repo is a **staging demo** meant to show the owner what's possible. It is not the live site yet.

## Brand direction
- Keep the existing branding and add nostalgia. The core message: "When you order from us, you order from our lineage in Buffalo."
- **Official logo today: `Logo.jpg`** (Drive: Projects/Giacobbis/Logo.jpg). Don't use New_Logo.png or the idea*/Vespa files as assets.
- **Staging pitch: the matchbook rebrand.** The owner's child (who runs this project) is pitching a return to the old Giacobbi's Trattoria matchbook mark, with **CUCINA CITTA** in the banner where it said TRATTORIA.
  - The mark is **vectorized from a photo of the real matchbook** (potrace, deskewed 1.75°). The traced paths are in `logo-trace.json`, and `logo.mjs` → `logoSVG({ ink, banner, bannerInk })` draws it. The banner words are EB Garamond 800, traced to paths, so the logo needs no fonts. Don't redraw the lettering by hand; it should stay identical to the matchbook.
  - `node render-logo.mjs` writes `assets/img/logo-cucina-citta*.svg`, `favicon.svg/png`, `apple-touch-icon.png` and the `og-image` (headless Chrome).
- **Colors come from the owner's Vespa artwork** (sampled): deep teal `#2f4a4f`, mint `#a5c4c4` / `#d7e6e3`, tomato red `#c73a2f`, olive `#6b7f45`, butter `#e6c56a`, cobblestone `#9c816e`, cream `#fbf6ea`. The Vespa illustration itself is another artist's signed work, so don't publish it.
- **Stickers:** `stickers.mjs` has our own drawings (plum tomato, Kalamata olives, a spritz, a mint Vespa) in round badges, inspired by Italian-restaurant sticker sheets (the user liked Pierre Huet's "Longo Brothers" stickers on Dribbble). Don't copy that shot's art or wording.
- **Layout rule from the user:** no bordered text boxes or cards (they read as AI-made). Content sits on the page like print: photos as snapshots, leader-dot menu lists, dotted rules, columns split by a thin line. The logo's banner bar is used for section labels. Recipe index cards are the one paper object kept on purpose.
- **Type:** EB Garamond (headings and body), Courier Prime (labels, prices, recipe cards), Reenie Beanie (handwritten recipe edits only).
- The family lineage below is confirmed by the owner's family. Use it on the site and in the GEO data:
  1. **The Charlesgate Supper Club**: the family's landmark restaurant at 4715 Transit Road, Williamsville (grandfather's). **Opened around 1970; the user believes it's 1970 but hasn't confirmed, so check before launch.** Reviewed by The Buffalo News, Nov 20, 1987 (the photo shows Mary Jacobbi and her daughter Lisa).
  2. **Giacobbi's Italian Oven & Rotisserie**: 4715 Transit Rd, on the Charlesgate site. Sicilian specialties, wood oven, family-style portions. Also **Giacobbi's Trattoria**, 3945 Main St., corner of Main & Eggert, Eggertsville (from the matchbook). Reviewed by Janice Okun in The Buffalo News, Jan 20, 1995 (best dish: grilled eggplant pizza; she also mentioned sautéed fava beans & greens).
  3. **Carmine's**: Transit Road, run by the family for decades. Home of the eggplant lasagna. Closed after a 2015 fire.
  4. **Giacobbi's Cucina Citta**: opened May 2016 at 59 Allen St.
- **Il Fiorentino** (the Bruni family, Kenmore) was a family friend. Leave it off the site for now.

## Source material (owner's Google Drive: Projects/Giacobbis)
- `Logo.jpg`, `LOGO/` (old logo drafts; ignore unless asked)
- `Food Gallery/`: dish photos (Chicken_Pix is the Chicken Piccata; Calamari_Mista matches today's Calamari Della Casa) (Lasagna, Chicken_Parm, Calamari_Mista, Bruschetta_trio, Gnocci, Penne_Palermo, Beans+Greens, Mule cocktails)
- Root + `Pics/`: Inside, Bar_Area, Bar_Seating, Outside_Patio, Steak_Spinach_Pizza, Fruitti Di Mare, meatball, and the 2016 Buffalo News photo `1006307600-Giacobbis-16-Ca4.jpg` (by Sharon Cantillon, The Buffalo News; credited on the site; get permission before launch)
- `Janice Okun/`: newspaper clippings (Charlesgate 1987, Giacobbi's 1995; the Il Fiorentino ones are excluded)
- `Recipes/Photos-1-001/`: 32 HEIC photos, mostly typed kitchen prep sheets from the Carmine's and Giacobbi's "Corporate Recipes" binder (13 with handwritten edits; Pork Rub is fully handwritten). These are proprietary house recipes. Transcriptions are in `recipes/recipes.json`, which is **git-ignored on purpose** because the repo is public. Each recipe has `approved_to_publish: false`. Publish a recipe only after the family approves it. The approved ones are copied into `content/recipes.json` (committed), which the story page renders. Giacobbi's Red Sauce is shown as a "family only" teaser on purpose.
- `Menus/`: 2016 menus, which are outdated. The current menus are images on giacobbis.com/dining-menu/ (placemat Nov 2026 + party menu) and /catering-menus/ (drop-off menu + trays, 2025). They're transcribed into `MENU`, `PARTY`, `DROPOFF` and `TRAYS` in `build.mjs`. Re-check them when the live images change.

## Press clips
The user says they bought the rights to the 1987 and 1995 Buffalo News clippings (Nov 2026), so the story page shows large article crops (`assets/img/press/*-clip.jpg`) with citations and links to the original newspapers.com pages (1987 → /image/876040354/, 1995 → /image/875956309/). The 2016 photo of Billy and Mike (Sharon Cantillon / The Buffalo News) is a separate work; confirm its rights before launch.

## Current structure (static, no build step needed to host)
- `build.mjs` generates `index.html`, `menu.html`, `story.html`, `catering.html`, `assets/menu-data.js` (shared by the admin menu editor and the concierge), `llms.txt` and `robots.txt`. Edit content there, then run `node build.mjs`.
- Images: `assets/img/*.jpg` are 1600px and `assets/img/sm/*.jpg` are 800px, made with `sips` (WebP isn't available on this Mac without installing a tool).
- `assets/site.css` holds the styles. `assets/chat.js` is the scripted demo concierge (reservations → Resy, pickup → ChowNow, delivery → DoorDash, catering lead capture). `assets/chart.umd.js` is a vendored copy of Chart.js.
- `admin/index.html` is the demo owner dashboard. **All numbers are labeled sample data.** Tabs: sales & forecast, menu editor, menu profitability, market prices (anonymized competitors; never put real competitor names next to invented prices), catering campaigns, and "Ask your business".
- Staging is kept out of search engines through `robots.txt`, the `X-Robots-Tag` header (`vercel.json` / `netlify.toml`) and noindex meta tags. Keep all three until launch.

## Real links
- Resy: https://resy.com/cities/buffalo-ny/venues/giacobbis
- Pickup (ChowNow): https://ordering.chownow.com/order/20612/locations
- DoorDash: https://www.doordash.com/store/giacobbi's-cucina-citta-buffalo-36517553/82092749/
- Facebook: https://www.facebook.com/giacobbisCucina/
- Phone (716) 834-4000. Hours: Wed–Sat bar 4:30, kitchen 5–10pm; Sun 4–9pm; closed Mon–Tue.
- Parking: lot behind the restaurant, entered from Delaware next to Tempo. It's public after 6pm on weekdays and all day on weekends.

## Rules
- Don't invent facts about the family, the dishes or prices. Placeholders must look like placeholders (`$ —`, "Staging note").
- Menu prices are transcribed from the current menu images. In the admin, only food cost and units sold are sample data.
- Hosting: Vercel for staging. Vercel Hobby is non-commercial, so production needs Vercel Pro or Netlify.

## Later phase (not in this demo)
Next.js app with: owner login; a menu editor backed by a database that publishes to the site, the chatbot and the schema; a real AI concierge grounded in the menu and family content; Shift4 SkyTab sales sync (requires the Shift4 Marketplace integrator program); catering email through Resend or Postmark with unsubscribe handling; Stripe or Shift4 deposits for catering.
