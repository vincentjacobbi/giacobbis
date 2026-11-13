// Generates the static pages from shared parts. Run: node build.mjs
import { writeFileSync } from "node:fs";

const R = {
  name: "Giacobbi's Cucina Citta",
  street: "59 Allen St.",
  city: "Buffalo", region: "NY", zip: "14202",
  phone: "(716) 834-4000", tel: "+17168344000",
  resy: "https://resy.com/cities/buffalo-ny/venues/giacobbis",
  order: "https://ordering.chownow.com/order/20612/locations",
  doordash: "https://www.doordash.com/store/giacobbi's-cucina-citta-buffalo-36517553/82092749/",
  facebook: "https://www.facebook.com/giacobbisCucina/",
};

// Menu items we could confirm from public sources. Prices are placeholders until the real menu is added.
const MENU = [
  { id: "antipasti", title: "Antipasti & Bread", items: [
    { n: "Bread Service", d: "Warm bread with house accompaniments" },
    { n: "Meatballs", d: "Slow-simmered in Sunday sauce" },
  ]},
  { id: "pasta", title: "Pasta", items: [
    { n: "Lasagna", d: "Layered with ricotta, meat sauce and mozzarella" },
    { n: "Eggplant Lasagna", d: "Fried eggplant in place of pasta sheets", h: "From Carmine's" },
    { n: "Tortellini alla Giacobbi", d: "The house tortellini" },
    { n: "Spaghetti & Meatballs", d: "Red sauce, the way it should be" },
  ]},
  { id: "entrees", title: "Entrées", items: [
    { n: "Chicken Parmesan", d: "Breaded cutlet, red sauce, melted mozzarella, side of pasta" },
    { n: "Chicken Milanese", d: "Two pan-fried cutlets with baby arugula and grape tomato salad" },
  ]},
  { id: "dolci", title: "Dolci", items: [
    { n: "Peanut Butter Pie", d: "A guest favorite" },
  ]},
  { id: "bar", title: "Bar", items: [
    { n: "House Cocktails", d: "Crafted at the bar, which opens at 4:30" },
    { n: "Wine & Beer", d: "Italian and local selections" },
  ]},
];

const HOURS = [
  ["Monday", null], ["Tuesday", null],
  ["Wednesday", "Bar 4:30 · Kitchen 5–10pm"], ["Thursday", "Bar 4:30 · Kitchen 5–10pm"],
  ["Friday", "Bar 4:30 · Kitchen 5–10pm"], ["Saturday", "Bar 4:30 · Kitchen 5–10pm"],
  ["Sunday", "4–9pm"],
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: R.name,
  servesCuisine: ["Italian", "Italian-American"],
  priceRange: "$$",
  telephone: R.tel,
  url: "https://giacobbis.com/",
  address: { "@type": "PostalAddress", streetAddress: "59 Allen St", addressLocality: R.city, addressRegion: R.region, postalCode: R.zip, addressCountry: "US" },
  areaServed: "Buffalo, NY",
  foundingDate: "2016-05",
  founder: [{ "@type": "Person", name: "Billy Jacobbi" }, { "@type": "Person", name: "Mike Jacobbi" }],
  acceptsReservations: R.resy,
  hasMenu: "https://giacobbis.com/menu.html",
  sameAs: [R.facebook, R.resy],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"], opens: "16:30", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "16:00", closes: "21:00" },
  ],
  potentialAction: [
    { "@type": "ReserveAction", target: R.resy },
    { "@type": "OrderAction", target: R.order },
  ],
};

const menuSchema = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: "Dining Menu",
  hasMenuSection: MENU.map((s) => ({ "@type": "MenuSection", name: s.title, hasMenuItem: s.items.map((i) => ({ "@type": "MenuItem", name: i.n, description: i.d })) })),
};

const nav = (active) => `
<div class="demo-banner"><b>Staging preview</b> · A redesign concept for Giacobbi's. Prices and some copy are placeholders.</div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/">Giacobbi's<small>Cucina Citta · Allentown</small></a>
  <button class="menu-toggle" aria-label="Menu" onclick="document.querySelector('nav.links').classList.toggle('open')">☰</button>
  <nav class="links">
    ${[["/menu.html", "Menu"], ["/story.html", "Our Family"], ["/catering.html", "Catering"], ["/#visit", "Visit"]]
      .map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    <a class="btn ghost" href="${R.order}" target="_blank" rel="noopener">Order</a>
    <a class="btn primary" href="${R.resy}" target="_blank" rel="noopener">Reserve</a>
  </nav>
</div></header>`;

const footer = `
<footer><div class="wrap">
  <div class="cols">
    <div><div class="brand" style="color:#fff">Giacobbi's<small style="color:#a99c86">Cucina Citta</small></div>
      <p style="max-width:380px">Italian-American cooking from the Jacobbi family, on Allen Street in the heart of Allentown.</p></div>
    <div><b style="color:#fff">Visit</b><br>${R.street} at Franklin<br>${R.city}, ${R.region} ${R.zip}<br><a href="tel:${R.tel}">${R.phone}</a></div>
    <div><b style="color:#fff">Elsewhere</b><br><a href="${R.resy}">Resy</a><br><a href="${R.order}">Order pickup</a><br><a href="${R.doordash}">DoorDash</a><br><a href="${R.facebook}">Facebook</a></div>
  </div>
  <div class="fine">© ${new Date().getFullYear()} Giacobbi's Cucina Citta · Staging preview, not the live site · <a href="/admin/">Owner dashboard (demo)</a></div>
</div></footer>
<script src="/assets/chat.js" defer></script>`;

const page = (title, desc, active, main, extraSchema = []) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex,nofollow">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="restaurant">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${[schema, ...extraSchema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head><body>
${nav(active)}
<main>${main}</main>
${footer}
</body></html>`;

const hoursList = `<ul class="info-list">${HOURS.map(([d, h]) => `<li><span>${d}</span><span class="${h ? "" : "closed"}">${h || "Closed"}</span></li>`).join("")}</ul>`;

// ---------- Home ----------
const home = page(
  "Giacobbi's Cucina Citta | Italian Restaurant in Allentown, Buffalo NY",
  "Family Italian-American restaurant at 59 Allen St. in Buffalo's Allentown. Lasagna, chicken parm, house cocktails, takeout and drop-off catering. Reserve on Resy.",
  "",
  `
<section class="hero"><div class="wrap">
  <div class="eyebrow">Allentown · Buffalo, New York</div>
  <h1>Family recipes, <em>city kitchen.</em></h1>
  <p class="lead">Italian-American cooking from the Jacobbi family, with Sunday sauce, generous plates and a bar that pours a proper cocktail. On Allen Street at Franklin.</p>
  <div class="ctas">
    <a class="btn primary" href="${R.resy}" target="_blank" rel="noopener">Reserve a table</a>
    <a class="btn light" href="${R.order}" target="_blank" rel="noopener">Order pickup</a>
    <a class="btn light" href="#" data-open-chat>Ask our concierge</a>
  </div>
  <div class="meta">
    <div><b>Wed–Sat</b>Bar 4:30 · Kitchen 5–10</div>
    <div><b>Sunday</b>4–9pm</div>
    <div><b>${R.street}</b>at Franklin</div>
    <div><b>${R.phone}</b>Call ahead</div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="eyebrow" style="color:var(--tomato)">From the kitchen</div>
  <h2>The plates people come back for</h2>
  <p class="sub">These are the dishes guests mention most, plus one with a story behind it.</p>
  <div class="grid g3" style="margin-top:36px">
    <div class="card dish"><span class="tag">Guest favorite</span><h3>Lasagna</h3><p>Ricotta, meat sauce and mozzarella in tall layers.</p></div>
    <div class="card dish"><span class="tag">From Carmine's</span><h3>Eggplant Lasagna</h3><p>Fried eggplant instead of pasta sheets. It was a favorite at the family's restaurant on Transit Road.</p></div>
    <div class="card dish"><span class="tag">House signature</span><h3>Tortellini alla Giacobbi</h3><p>The dish that carries the family name.</p></div>
    <div class="card dish"><span class="tag">Classic</span><h3>Chicken Parmesan</h3><p>A breaded cutlet with red sauce and melted mozzarella.</p></div>
    <div class="card dish"><span class="tag">Classic</span><h3>Chicken Milanese</h3><p>Two pan-fried cutlets with arugula and grape tomatoes.</p></div>
    <div class="card dish"><span class="tag">Save room</span><h3>Peanut Butter Pie</h3><p>The dessert regulars order before they sit down.</p></div>
  </div>
  <p style="margin-top:28px"><a class="btn ghost" href="/menu.html">Full menu →</a></p>
</div></section>

<section class="alt"><div class="wrap split">
  <div>
    <div class="eyebrow" style="color:var(--tomato)">Our family</div>
    <h2>A Buffalo restaurant family, since the Charlesgate</h2>
    <p class="sub">The family has cooked for Western New York for generations: the Charlesgate on Transit Road, Giacobbi's Italian Oven, then Carmine's. In 2016, cousins Billy and Mike Jacobbi brought the recipes downtown to Allen Street.</p>
    <p class="quote">When you order from us, you order from our lineage in Buffalo.</p>
    <a class="btn primary" href="/story.html">Read the family story</a>
  </div>
  <div class="plate"><span>Photo placeholder · family photo or signature dish</span></div>
</div></section>

<section><div class="wrap grid g2">
  <div class="card">
    <div class="eyebrow" style="color:var(--tomato)">Catering</div>
    <h2 style="font-size:34px">Feeding the office, the party, the whole family</h2>
    <p class="sub">We offer drop-off catering trays for birthdays, showers, office lunches and holidays. Tell us the date and headcount and we'll put together a menu.</p>
    <a class="btn primary" href="/catering.html">Plan catering</a>
  </div>
  <div class="card" id="visit">
    <div class="eyebrow" style="color:var(--tomato)">Visit</div>
    <h3 style="margin-top:8px">${R.street} at Franklin, ${R.city}, ${R.region} ${R.zip}</h3>
    ${hoursList}
    <p style="font-size:14px;color:var(--muted);margin-top:14px"><b>Parking:</b> use the lot behind the restaurant, entered from Delaware next to Tempo. It's public after 6pm on weekdays and all day on weekends.</p>
  </div>
</div></section>`
);

// ---------- Menu ----------
const menuPage = page(
  "Menu | Giacobbi's Cucina Citta, Buffalo NY",
  "Dining menu at Giacobbi's Cucina Citta in Allentown, Buffalo: lasagna, eggplant lasagna, chicken parmesan, chicken Milanese, Tortellini alla Giacobbi and more.",
  "Menu",
  `
<section><div class="wrap">
  <div class="eyebrow" style="color:var(--tomato)">Dining menu</div>
  <h1 style="font-family:var(--serif);font-weight:500;font-size:56px;margin:8px 0">The Menu</h1>
  <p class="note"><b>Staging note:</b> items come from public sources and prices are placeholders. The full menu will be added from the restaurant's current placemat. In the live site, it's edited from the owner dashboard.</p>
  <div class="menu-nav">${MENU.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}</div>
  ${MENU.map((s) => `
  <div class="menu-section" id="${s.id}"><h2>${s.title}</h2>
    ${s.items.map((i) => `<div class="item"><div><div class="nm">${i.n}${i.h ? `<span class="heritage">${i.h}</span>` : ""}</div><div class="ds">${i.d}</div></div><div class="pr">$ —</div></div>`).join("")}
  </div>`).join("")}
  <p style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn primary" href="${R.order}" target="_blank" rel="noopener">Order pickup</a><a class="btn ghost" href="${R.resy}" target="_blank" rel="noopener">Reserve a table</a></p>
</div></section>`,
  [menuSchema]
);

// ---------- Story ----------
const TIMELINE = [
  { era: "Where it started", t: "The Charlesgate", d: "The family's first restaurant, on Transit Road in Williamsville, became a local legend. The Buffalo News reviewed it in November 1987." },
  { era: "The '90s", t: "Giacobbi's Italian Oven & Rotisserie", d: "Opened at 4715 Transit Road on the Charlesgate site. It served Sicilian specialties, wood-fired pizza and family-style portions meant to feed the whole table. A second location, Giacobbi's Trattoria, opened on Main Street at Eggert." },
  { era: "Decades on Transit", t: "Carmine's", d: "For years the family ran Carmine's on Transit Road. That's where the eggplant lasagna became a favorite. A fire closed it in 2015." },
  { era: "2016 to today", t: "Giacobbi's Cucina Citta", d: "Cousins Billy and Mike Jacobbi brought the family's recipes downtown to 59 Allen Street in Allentown and served the first meal in May 2016." },
];
const PRESS = [
  { y: "1987", src: "The Buffalo News", t: "Reviewed The Charlesgate on Transit Road" },
  { y: "1995", src: "The Buffalo News", t: "Janice Okun reviewed Giacobbi's Italian Oven & Rotisserie and named the grilled eggplant pizza its best dish" },
  { y: "2016", src: "Buffalo Rising", t: "Covered the family bringing its recipes to Allen Street after Carmine's" },
  { y: "2016", src: "The Buffalo News", t: "Photographed Billy and Mike Jacobbi with the spinach and steak pizza and the shrimp pappardelle" },
];
const storyPage = page(
  "Our Family | A Buffalo Restaurant Lineage | Giacobbi's Cucina Citta",
  "The Jacobbi family's Buffalo restaurant history, from The Charlesgate and Giacobbi's Italian Oven on Transit Road to Carmine's and Giacobbi's Cucina Citta on Allen Street.",
  "Our Family",
  `
<section><div class="wrap" style="max-width:820px">
  <div class="eyebrow" style="color:var(--tomato)">Our family</div>
  <h1 style="font-family:var(--serif);font-weight:500;font-size:56px;margin:8px 0 20px;line-height:1.05">A Buffalo restaurant family, since the Charlesgate</h1>
  <p class="sub">When you order from Giacobbi's, you're ordering from a family that has cooked for Western New York for generations: the Charlesgate, Giacobbi's on Transit, Carmine's, and now Allen Street.</p>

  <div class="timeline">
    ${TIMELINE.map((x) => `<div class="tl"><div class="tl-era">${x.era}</div><h3>${x.t}</h3><p>${x.d}</p></div>`).join("")}
  </div>

  <h2 style="font-size:32px;margin-top:64px">In the papers</h2>
  <p class="sub">The family's restaurants have been covered in Buffalo food writing for decades.</p>
  <div class="press">${PRESS.map((x) => `<div class="pr-item"><span class="pr-y">${x.y}</span><div><b>${x.src}</b><br><span>${x.t}</span></div></div>`).join("")}</div>
  <p class="note" style="margin-top:18px"><b>Staging note:</b> the original clippings from the family archive (1987 and 1995) will be shown here as scans.</p>

  <h2 style="font-size:32px;margin-top:64px">The family recipes</h2>
  <div class="grid" style="margin-top:20px">
    <div class="card"><span class="eyebrow" style="color:var(--basil)">From Carmine's</span><h3 style="margin-top:6px">Eggplant Lasagna</h3><p style="color:var(--muted)">Fried eggplant layered in place of pasta. Placeholder for the family's story behind it.</p></div>
    <div class="card"><span class="eyebrow" style="color:var(--basil)">From the Transit Road days</span><h3 style="margin-top:6px">Beans & Greens</h3><p style="color:var(--muted)">Sautéed fava beans and greens were an old-time favorite back in 1995 and are still a Buffalo Italian staple. Placeholder for the family recipe card.</p></div>
    <div class="card"><span class="eyebrow" style="color:var(--basil)">The namesake</span><h3 style="margin-top:6px">Tortellini alla Giacobbi</h3><p style="color:var(--muted)">Placeholder for how the dish got the family name.</p></div>
  </div>
  <p class="note" style="margin-top:18px"><b>Staging note:</b> the recipe cards from the family's Recipes folder will be transcribed here, with the family choosing what to share.</p>
  <p style="margin-top:36px">Have a question about a family dish? <a href="#" data-open-chat>Ask our concierge →</a></p>
</div></section>`
);

// ---------- Catering ----------
const cateringPage = page(
  "Catering | Giacobbi's Cucina Citta, Buffalo NY",
  "Drop-off Italian catering in Buffalo from Giacobbi's Cucina Citta: trays for office lunches, parties, showers and holidays.",
  "Catering",
  `
<section><div class="wrap split" style="align-items:start">
  <div>
    <div class="eyebrow" style="color:var(--tomato)">Catering</div>
    <h1 style="font-family:var(--serif);font-weight:500;font-size:56px;margin:8px 0 18px;line-height:1.05">Italian trays for any occasion</h1>
    <p class="sub">We offer drop-off catering for office lunches, birthdays, showers, graduations and holidays. Pasta, cutlets and salads in trays sized for your crowd.</p>
    <p class="note" style="margin-top:22px"><b>Staging note:</b> packages and prices will be added from the 2025 catering menu. In the live site, requests land in the owner dashboard and can take a card deposit.</p>
    <ul class="info-list" style="margin-top:22px">
      <li><span>Office lunches</span><span>Drop-off</span></li>
      <li><span>Parties & showers</span><span>Drop-off or pickup</span></li>
      <li><span>Holidays</span><span>Order ahead</span></li>
    </ul>
  </div>
  <div class="card">
    <h3>Request a catering quote</h3>
    <form class="stack" onsubmit="event.preventDefault();this.innerHTML='<p><b>Thank you!</b> Demo only, nothing was sent. In the live site this request goes to the catering inbox in the owner dashboard.</p>'">
      <label>Name<input required></label>
      <label>Email or phone<input required></label>
      <label>Event date<input type="date" required></label>
      <label>Guests<select><option>10–20</option><option>20–40</option><option>40–75</option><option>75+</option></select></label>
      <label>Drop-off or pickup<select><option>Drop-off</option><option>Pickup</option></select></label>
      <label>Anything else?<textarea rows="3" placeholder="Dietary needs, favorite dishes, budget…"></textarea></label>
      <button class="btn primary" style="justify-content:center">Send request</button>
    </form>
  </div>
</div></section>`
);

// ---------- GEO / crawler files ----------
const llms = `# Giacobbi's Cucina Citta

> Family-owned Italian-American restaurant at 59 Allen St. (at Franklin), Buffalo, NY 14202, in the Allentown neighborhood. Owned by cousins Billy and Mike Jacobbi, part of a Buffalo restaurant family whose restaurants include The Charlesgate (Transit Road, Williamsville), Giacobbi's Italian Oven & Rotisserie (4715 Transit Road, 1990s), Giacobbi's Trattoria (Main St. at Eggert) and Carmine's (Transit Road, closed after a 2015 fire). Open since May 2016.

## Essentials
- Phone: ${R.phone}
- Hours: Wed–Sat bar 4:30pm, kitchen 5–10pm; Sun 4–9pm; closed Mon–Tue
- Reservations: ${R.resy}
- Pickup ordering: ${R.order}
- Delivery: DoorDash
- Parking: lot behind the restaurant, entered from Delaware next to Tempo; public after 6pm weekdays and all day weekends
- Catering: drop-off catering trays for offices, parties and holidays

## Known for
- Lasagna, eggplant lasagna (a Carmine's recipe), Tortellini alla Giacobbi, chicken parmesan, chicken Milanese, peanut butter pie, house cocktails

## Pages
- [Menu](https://giacobbis.com/menu.html)
- [Our Family](https://giacobbis.com/story.html)
- [Catering](https://giacobbis.com/catering.html)
`;

writeFileSync("index.html", home);
writeFileSync("menu.html", menuPage);
writeFileSync("story.html", storyPage);
writeFileSync("catering.html", cateringPage);
writeFileSync("llms.txt", llms);
// Staging: keep it out of search engines so it doesn't compete with the live site.
writeFileSync("robots.txt", "User-agent: *\nDisallow: /\n");
console.log("built");
