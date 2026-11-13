// Generates the static pages from shared parts. Run: node build.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { logoSVG } from "./logo.mjs";
const GOLD = "#d4b25e", CHOC = "#3b2417";

// Family recipes the family approved for the site (the full private transcriptions live in git-ignored recipes/).
const RECIPES = JSON.parse(readFileSync("content/recipes.json", "utf8")).recipes;

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

// ---------- Dining menu ----------
// Transcribed from the current placemat on giacobbis.com/dining-menu/ (GiaNEW26PLACEMATNov26.jpg, Nov 2026).
// p: price (number), or [a, b] for two printed prices; v: options as [label, price, isAddOn]; img: file in assets/img.
const MENU = [
  { id: "appetizers", title: "Appetizers", items: [
    { n: "Beans & Greens", d: "Mixed Italian greens, crispy pancetta, seasoned olive oil, garlic, cannellini & fava beans", p: 11, img: "beans-and-greens" },
    { n: "Calamari Della Casa", d: "Delicately fried calamari tossed with banana peppers, roasted peppers, Kalamata olives, arugula & field greens", p: 17, img: "calamari-mista" },
    { n: "Baked Roman Artichokes", d: "Italian breadcrumb-encrusted, baked Roman long-stemmed artichoke hearts draped with a lemon-garlic cream sauce", p: 14 },
    { n: "Stuffed Hot Peppers", d: "Hungarian peppers stuffed with Italian cheese, bell pepper and herbs, broiled and served with grilled crostini", p: 14 },
    { n: "Clams Casino", d: "Six clams stuffed with Casino mix, baked and plated with drawn butter and lemon", p: 16, h: "Family recipe" },
  ]},
  { id: "soup", title: "Soup", items: [
    { n: "Crab & Shrimp Bisque", d: "Our Taste of Buffalo award-winning crab and shrimp bisque", p: 11 },
    { n: "Pasta e Fagiole", d: "White beans, crushed tomatoes & ditalini with pancetta, parmesan & stock vegetables in a ham stock", p: [6, 8], h: "Family recipe" },
  ]},
  { id: "salads", title: "Salads", items: [
    { n: "House Salad", d: "Mixed lettuce greens, grape tomato, cucumber, carrot, red onion & house croutons", p: 9 },
    { n: "Classic Caesar", d: "Romaine and baguette croutons tossed in our classic house-made Caesar dressing with shaved Parmesan", p: 12 },
    { n: "Steak Tagliata", d: "Olive oil, herb and sea salt rubbed NY Sirloin Strip, grilled, sliced and served over field greens, red onion, roasted red peppers & gorgonzola tossed with a balsamic vinaigrette", p: 25 },
  ], adds: "Add to the House or Caesar salad: chicken $6 · grilled shrimp $8" },
  { id: "pizza", title: "Pizza", items: [
    { n: "Classic Pepperoni", d: "House tomato pizza sauce, mozzarella, cup & char pepperoni and Italian spices", p: 20 },
    { n: "Prosciutto", d: "Roasted garlic cream sauce, Provolone, caramelized onions, prosciutto & fresh basil", p: 22 },
    { n: "Sausage Palermo", d: "Garlic sauce, mozzarella, sliced Italian sausage link, seasoned \"Palermo\" (hot & sweet) peppers, olives & shredded Asiago", p: 22 },
    { n: "Balsamic Chicken", d: "EVOO, garlic, Provolone, balsamic-glazed grilled chicken, plum tomatoes, Kalamata olives and arugula", p: 22 },
  ]},
  { id: "breads", title: "Breads", items: [
    { n: "House Bread Service", d: "Warm house garlic knots & baguette with roasted garlic EVOO & olive butter", p: 8, v: [["Just baguette", 5]] },
    { n: "Spinach Bread", d: "Fresh deck-oven-baked loaf with garlic spread, spinach, Asiago & Parmesan", p: 10 },
  ]},
  { id: "meatballs", title: "Meatballs & Sausage", items: [
    { n: "House Meatball", d: "Ground beef & pork, breading, garlic & basil in house red sauce, served with grilled crostini", p: 6, img: "meatball" },
    { n: "Italian Sausage Link", d: "Grilled Italian sausage link topped with house red sauce, served with grilled crostini", p: 6 },
  ]},
  { id: "pasta", title: "Pasta", items: [
    { n: "Spicy Brooklyn Style Rigatoni", d: "San Marzano tomatoes, spicy Calabrian chilies, shallots, garlic and cream reduced into a sauce and tossed with rigatoni", p: 20, v: [["With chicken", 26], ["With shrimp", 28]] },
    { n: "Penne Pink Vodka", d: "A plum tomato-basil cream sauce with prosciutto and a vodka finish, tossed with penne", p: 19, v: [["\"Al's Way\" with Palermo peppers & grilled chicken", 25]] },
    { n: "Spaghetti or Penne", d: "In our house plum tomato sauce", p: 16, v: [["\"Parm\" style with melted mozzarella", 5, true]] },
    { n: "Linguine Alfredo", d: "Linguine in our house Alfredo cream sauce", p: 19, v: [["Add chicken", 6, true], ["Add grilled shrimp", 8, true]] },
    { n: "Gnocchi", d: "Homemade potato gnocchi", p: null, v: [["With house plum tomato sauce", 22], ["With pink vodka sauce", 24]], img: "gnocci", h: "Homemade" },
    { n: "Clams Linguine", d: "Whole clams and baby clams tossed with linguine in a red or white clam sauce", p: 25 },
    { n: "Fruitti di Mare", d: "Clams, shrimp, mussels and calamari in a zesty plum tomato sauce tossed with linguine. Order it hot, medium or mild", p: 29, img: "frutti-di-mare" },
  ]},
  { id: "entrees", title: "Entrées", items: [
    { n: "Steak Giacobbi", d: "Our house greens & beans topped with a grilled, sliced 10oz NY Sirloin Strip. Served with spaghetti in house plum tomato sauce & grilled Italian bread", p: 28, h: "The namesake" },
    { n: "Eggplant Parmesan", d: "Eggplant cutlets layered with ricotta, marinara & melted mozzarella; side of penne", p: 20 },
    { n: "Lasagne", d: "Fresh pasta sheets layered with ground beef & pork, ricotta, mozzarella & house tomato sauce", p: 20, img: "lasagna" },
    { n: "Chicken Piccata", d: "Sautéed egg-battered chicken breasts in a lemon-caper wine sauce with mushrooms & artichoke hearts; side of spaghetti marinara", p: 24, img: "chicken-pix" },
    { n: "Chicken Marsala", d: "Sautéed chicken breasts in a mushroom-Marsala demi-glace; side of spaghetti marinara", p: 24 },
    { n: "Chicken Parmesan", d: "House-breaded, fried chicken cutlet baked with mozzarella; side of spaghetti marinara", p: 23, img: "chicken-parm" },
    { n: "Veal Parmesan", d: "House-breaded, fried fresh veal cutlets baked with mozzarella; side of spaghetti with house red sauce", p: 29 },
    { n: "Chicken Milanese", d: "Herb-panko-breaded, fried cutlet over an arugula salad with fresh shaved parmesan in a lemon vinaigrette", p: 23 },
  ]},
  { id: "fish-fry", title: "Friday Fish Fry", items: [
    { n: "Icelandic Haddock Fish Fry", d: "Served every Friday with cole slaw, bistro fries, tartar sauce and lemon", p: null, when: "Fridays" },
    { n: "Italian Baked Haddock", d: "Italian breadcrumb-encrusted and baked, topped with house beurre blanc, with vegetables & fries or pasta", p: null, when: "Fridays" },
  ]},
  { id: "sides", title: "Side Salads & Add-ons", items: [
    { n: "Dinner Salad", d: "Add a dinner-sized salad to any entrée or pasta", p: 5 },
    { n: "Caesar Salad", d: "Add a dinner-sized Caesar to any entrée or pasta", p: 8 },
    { n: "House Meatball", d: "Add-on", p: 6 },
    { n: "French Fries", d: "Add-on", p: 6 },
    { n: "Sautéed Vegetables", d: "Add-on", p: 7 },
    { n: "Italian Greens", d: "Add-on", p: 7 },
  ]},
];

// ---------- Party & catering ----------
// Transcribed from GiaPartyMenu25.jpg, GiaCaterMAINDrop-off25.jpg and GiaCateringTrays1.jpg on giacobbis.com.
const PARTY = {
  intro: "Family-style banquet dining at the restaurant for small parties, banquets and family gatherings. Served by our wait staff, with salads, entrées and sides passed family style.",
  min: "Minimum 12 adults",
  includes: "Every package comes with warm house bread & olive butter and a Chef or Caesar salad. Children under 10 are $2 less.",
  price: [["Choose 2 entrées", 28], ["Choose 3 entrées", 33]],
  entrees: ["Chicken Piccata (best seller)", "Chicken Marsala", "Chicken Parmesan", "Chicken Romano", "Panko-crusted Pork Chops", "Italian Sausage Cacciatore", "Tortellini Alfredo ala Giacobbi (spinach, artichoke hearts & prosciutto)", "Penne Pink Vodka with chicken", "Lasagna", "Eggplant Lasagne", "Shrimp Scampi (+$4)", "Seafood Marinara (+$4)", "Shrimp-Parmesan Risotto (+$5)"],
  sides: ["Mixed garden vegetable with herb butter", "Pasta broccoli with tomatoes & beans", "Gourmet macaroni & cheese (+$1.50)", "Penne with red sauce or marinara", "Roasted or smashed red potatoes", "Fried potatoes with peppers & onions"],
  sweets: "Ask about trays of cannoli or limoncello cheesecake for dessert.",
};
const DROPOFF = {
  price: 18.75, min: 15,
  pick: "Pick 2 entrées, 2 sides & 1 salad",
  extra: "Add another entrée ($3 pp) or side ($2 pp)",
  entrees: ["Chicken Piccata (best seller)", "Chicken Marsala", "Chicken Parmesan", "Chicken Romano with plum tomatoes & fresh mozzarella", "Panko-crusted Pork Chops", "BBQ Pulled Pork & rolls (48 hr notice)", "Chicken or Italian Sausage Cacciatore", "Italian Meatballs in sauce", "Roasted Chicken, cut up (lemon-herb or BBQ)", "Tortellini Alfredo ala Giacobbi", "Spinach Ravioli with tomato cream", "Lasagna", "Eggplant Parmesan", "Stuffed Shells Marinara", "Cheese Ravioli with house red sauce"],
  sides: ["Green beans almondine or Italian", "Mixed garden vegetable with herb butter", "Broccoli Olivetta", "Baked beans", "Pasta broccoli with tomatoes & beans", "Penne Pink Vodka", "Baked ziti", "Roasted red potatoes", "Garlic smashed red potatoes", "Cheddar potato casserole", "Fried potatoes with peppers & onions", "Wild rice pilaf"],
  salads: ["Chef", "Caesar", "Greek", "Three bean", "Cucumber-tomato", "Pasta salad with veggies", "Pasta salad with deli meats", "Potato salad", "Antipasto (+$1.50)", "Italian chopped (+$1.50)"],
  sweets: [["Mini cannoli or brownies", "$3 pp"], ["Cheesecake or carrot cake", "$4.25 pp"]], sweetsMin: 25,
  fine: ["Plastic serving utensils and condiments are included. Quality plates, forks, knives and spoons are $1.50 per person.", "$10 minimum delivery and set-up charge.", "Hot buffets come in large catering trays for family-style dining.", "Italian bread and butter service is $1.50 per person.", "We accept cash and all major credit cards. Prices are subject to change."],
};
const TRAYS = {
  appetizers: [["Spinach-Artichoke Dip with tortilla", "Tray", 65], ["Chicken Wing Dip with tortilla", "Tray", 65], ["Stuffed Hot Peppers", "25 ct", 75], ["Bacon-wrapped Shrimp", "50 ct", 140], ["Chicken Satay Kabobs", "50 ct", 90], ["Tomato Bruschetta with goat cheese", "50 ct", 65], ["Spinach-Sausage Stuffed Mushrooms", "50 ct", 95], ["Meatballs: BBQ, Italian or Swedish (half)", "Half", 65], ["Meatballs: BBQ, Italian or Swedish (full)", "Full", 125], ["Grilled Pork Tenderloin Crostini", "50 ct", 100]],
  // [name, half, full] — null = not offered, "mp" = market price
  sides: [["Antipasto Deluxe", null, 95], ["Chef Salad", 32, 60], ["Caesar Salad", 36, 70], ["Mediterranean Greek Salad", 45, 85], ["Three Bean Salad", null, 70], ["Italian Pasta Salad with deli meat", null, 70], ["Vegetable Pasta Salad", null, 70], ["Potato Salad", null, 70], ["Green Beans Almondine", null, 85], ["Green Beans Italiano", null, 85], ["Mixed Garden Vegetables", null, 75], ["Potatoes, fried with peppers & onion", null, 70], ["Roasted Red Potatoes", null, 65], ["Garlic Smashed Potatoes", null, 70], ["Cheddar Potato Casserole", null, 70], ["Baked Ziti", 34, 70]],
  pasta: [["Lasagne (half feeds 8, full 16)", 60, 115], ["Eggplant Lasagne (half feeds 8, full 16)", 60, 115], ["Penne Pink Vodka", 48, 90], ["Gourmet Mac 'n Cheese", 48, 90], ["Stuffed Shells Marinara", 48, 90], ["Tortellini Alfredo ala Giacobbi", 55, 95], ["Spinach Ravioli, tomato cream", 55, 95], ["Penne Palermo with sausage", 55, 95], ["Italian Sausage with peppers & onions", 55, 95], ["BBQ Pulled Pork with rolls (15/30)", 60, 115]],
  fresh: [["Chicken Cacciatore", 74, 138], ["Chicken Parmesan", 74, 138], ["Chicken Romano", 74, 138], ["Chicken Piccata", 78, 148], ["Chicken Marsala", 78, 148], ["Panko-breaded Pork Chops", 66, 122], ["Veal Marsala", "mp", "mp"], ["Veal Parmesan", "mp", "mp"]],
  roastBeef: "Roast Beef au Jus (6 lb.) with 32 rolls, slow-roasted medium rare with horseradish. Full tray $150, 48 hours' notice.",
};

const HOURS = [
  ["Monday", null], ["Tuesday", null],
  ["Wednesday", "Bar 4:30 · Kitchen 5–10pm"], ["Thursday", "Bar 4:30 · Kitchen 5–10pm"],
  ["Friday", "Bar 4:30 · Kitchen 5–10pm"], ["Saturday", "Bar 4:30 · Kitchen 5–10pm"],
  ["Sunday", "4–9pm"],
];

// ---------- helpers ----------
const money = (n) => (typeof n === "number" ? `$${Number.isInteger(n) ? n : n.toFixed(2)}` : n === "mp" ? "Market" : "—");
const priceText = (i) => (Array.isArray(i.p) ? i.p.map(money).join(" / ") : i.p != null ? money(i.p) : i.when || "");
const findItem = (name) => MENU.flatMap((s) => s.items).find((i) => i.n === name);
// Responsive photo: 800px copy in assets/img/sm, 1600px original in assets/img.
const pic = (file, alt, sizes = "(max-width:820px) 100vw, 400px", eager = false) =>
  `<img src="/assets/img/sm/${file}.jpg" srcset="/assets/img/sm/${file}.jpg 800w, /assets/img/${file}.jpg 1600w" sizes="${sizes}" alt="${alt}"${eager ? "" : ' loading="lazy"'} decoding="async">`;

// Round sticker badge with arched lettering (SVG). Colors: [face, text/ring].
let stickerId = 0;

const sticker = ({ top, bottom, mid = "", small = "", face = "var(--red)", ink = "#fbeed0", cls = "", label, art = "" }) => {
  const id = `st${++stickerId}`;
  const midSize = mid.length > 5 ? 30 : 40;
  return `<div class="sticker ${cls}" role="img" aria-label="${label || [top, mid, small, bottom].filter(Boolean).join(" ")}"><svg viewBox="0 0 200 200" aria-hidden="true" style="color:${ink}">
  <defs><path id="${id}t" d="M32 100 A68 68 0 0 1 168 100"/><path id="${id}b" d="M14 100 A86 86 0 0 0 186 100"/></defs>
  <circle cx="100" cy="100" r="97" fill="${face}" stroke="${CHOC}" stroke-width="4"/><circle cx="100" cy="100" r="90" fill="none" stroke="${ink}" stroke-width="1.2"/>
  <circle cx="100" cy="100" r="60" fill="none" stroke="${ink}" stroke-width="1.6"/>
  <text font-family="EB Garamond, Georgia, serif" font-weight="800" font-size="19" letter-spacing="2.5" fill="${ink}"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${top}</textPath></text>
  <text font-family="EB Garamond, Georgia, serif" font-weight="800" font-size="17" letter-spacing="2.5" fill="${ink}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>
  <text x="20" y="106" font-size="13" fill="${ink}">✦</text><text x="168" y="106" font-size="13" fill="${ink}">✦</text>
  ${art || `<text x="100" y="${small ? 106 : 114}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-weight="800" font-size="${midSize + 4}" fill="${ink}">${mid}</text>${small ? `<text x="100" y="128" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="12" letter-spacing="1" fill="${ink}">${small}</text>` : ""}`}
</svg></div>`;
};
const pageHero = (kicker, title, lead, img, alt, st) => `
<section class="menu-hero"><div class="wrap">
  <div><div class="eyebrow">${kicker}</div><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ""}</div>
  <div class="arch"><div class="frame">${pic(img, alt, "320px", true)}</div>${st}</div>
</div></section>`;

const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: R.name,
  image: ["https://giacobbis.com/assets/img/outside-patio.jpg", "https://giacobbis.com/assets/img/inside.jpg"],
  logo: "https://giacobbis.com/assets/img/og-image.jpg",
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

const offer = (price, name) => ({ "@type": "Offer", ...(name ? { name } : {}), price: price.toFixed(2), priceCurrency: "USD" });
const itemOffers = (i) => {
  const o = [];
  if (typeof i.p === "number") o.push(offer(i.p));
  if (Array.isArray(i.p)) i.p.forEach((x) => o.push(offer(x)));
  (i.v || []).forEach(([label, price, add]) => o.push(offer(add ? (typeof i.p === "number" ? i.p : 0) + price : price, `${i.n}, ${label.toLowerCase()}`)));
  return o;
};
const menuSchema = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: "Dining Menu",
  inLanguage: "en",
  hasMenuSection: MENU.map((s) => ({
    "@type": "MenuSection", name: s.title,
    hasMenuItem: s.items.map((i) => {
      const o = itemOffers(i);
      return { "@type": "MenuItem", name: i.n, description: i.d, ...(i.img ? { image: `https://giacobbis.com/assets/img/${i.img}.jpg` } : {}), ...(o.length ? { offers: o.length === 1 ? o[0] : o } : {}) };
    }),
  })),
};

const nav = (active) => `
<div class="demo-banner"><b>Staging preview</b> · A redesign concept for Giacobbi's. Menu prices are from the current menu; some copy is draft.</div>
<header class="nav"><div class="wrap">
  <a class="brand" href="/" aria-label="Giacobbi's Cucina Citta, home">${logoSVG({ ink: GOLD, paper: CHOC, id: "hdr" })}</a>
  <button class="menu-toggle" aria-label="Menu" onclick="document.querySelector('nav.links').classList.toggle('open')">☰</button>
  <nav class="links">
    ${[["/menu.html", "Menu"], ["/story.html", "Our Family"], ["/catering.html", "Catering"], ["/#visit", "Visit"]]
      .map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    <a class="btn ghost" href="${R.order}" target="_blank" rel="noopener">Order</a>
    <a class="btn primary" href="${R.resy}" target="_blank" rel="noopener">Reserve</a>
  </nav>
</div></header>`;

const footer = `
<div class="awning" aria-hidden="true"></div>
<footer><div class="wrap">
  <div class="cols">
    <div><a class="foot-logo" href="/">${logoSVG({ ink: GOLD, paper: CHOC, id: "ftr" })}</a>
      <p style="max-width:380px">Italian-American cooking from the Jacobbi family, on Allen Street in the heart of Allentown. From the Charlesgate to Allen Street.</p></div>
    <div><b>Visit</b><br>${R.street} at Franklin<br>${R.city}, ${R.region} ${R.zip}<br><a href="tel:${R.tel}">${R.phone}</a></div>
    <div><b>Elsewhere</b><br><a href="${R.resy}">Resy</a><br><a href="${R.order}">Order pickup</a><br><a href="${R.doordash}">DoorDash</a><br><a href="${R.facebook}">Facebook</a></div>
  </div>
  <div class="fine">© ${new Date().getFullYear()} Giacobbi's Cucina Citta · Staging preview, not the live site · <a href="/admin/">Owner dashboard (demo)</a></div>
</div></footer>
<script src="/assets/menu-data.js" defer></script>
<script src="/assets/chat.js" defer></script>`;

const page = (title, desc, active, main, extraSchema = [], path = "/") => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#3b2417">
<link rel="icon" type="image/png" href="/assets/img/favicon.png"><link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="restaurant">
<meta property="og:url" content="https://giacobbis.com${path}">
<meta property="og:image" content="https://giacobbis.com/assets/img/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Giacobbi's Cucina Citta logo">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Reenie+Beanie&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${[schema, ...extraSchema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head><body>
${nav(active)}
<main>${main}</main>
${footer}
</body></html>`;

const hoursList = `<ul class="info-list">${HOURS.map(([d, h]) => `<li><span>${d}</span><span class="${h ? "" : "closed"}">${h || "Closed"}</span></li>`).join("")}</ul>`;

// ---------- Home ----------
const FEATURED = [
  ["Lasagne", "House classic", "Fresh pasta sheets, ground beef & pork, ricotta and mozzarella in tall layers."],
  ["Chicken Piccata", "Best seller", "Lemon-caper wine sauce with mushrooms and artichoke hearts. The family's top seller on the party and catering menus."],
  ["Chicken Parmesan", "Classic", "House-breaded cutlet baked with mozzarella, with spaghetti marinara."],
  ["Beans & Greens", "Old-time favorite", "Italian greens, crispy pancetta, cannellini and fava beans. The Buffalo News noted the family's fava beans & greens back in 1995."],
  ["Fruitti di Mare", "From the sea", "Clams, shrimp, mussels and calamari over linguine. Order it hot, medium or mild."],
  ["Gnocchi", "Homemade", "Potato gnocchi made in house, in plum tomato or pink vodka sauce."],
];
const dishCard = ([name, tag, blurb]) => {
  const i = findItem(name);
  return `<article class="card dish"><div class="ph">${pic(i.img, name)}</div><span class="price">${(priceText(i) || money(i.v[0][1])).replace(" / ", "/")}</span><div class="body"><span class="tag">${tag}</span><h3>${name}</h3><p>${blurb}</p></div></article>`;
};

const home = page(
  "Giacobbi's Cucina Citta | Italian Restaurant in Allentown, Buffalo NY",
  "Family Italian-American restaurant at 59 Allen St. in Buffalo's Allentown. Lasagne, chicken piccata, beans & greens, Friday fish fry, takeout and drop-off catering. Reserve on Resy.",
  "",
  `
<section class="hero"><div class="wrap">
  <div class="cover">
    <h1 class="mark" style="margin:0">${logoSVG({ id: "hero", ink: CHOC, paper: GOLD })}</h1>
    <p class="tag">A Buffalo restaurant family since the Charlesgate</p>
    <p class="addr">${R.street} at Franklin · Allentown</p>
    <div class="ctas">
      <a class="btn primary" href="${R.resy}" target="_blank" rel="noopener">Reserve a table</a>
      <a class="btn ghost" href="${R.order}" target="_blank" rel="noopener">Order pickup</a>
      <a class="btn ghost" href="#" data-open-chat>Ask the concierge</a>
    </div>
  </div>
  <div class="hero-side">
    <h2 class="misprint">Family recipes, <em>city kitchen.</em></h2>
    <p class="lead">Italian-American cooking from the Jacobbi family. Generous plates, Friday fish fry and a bar that opens at 4:30, on Allen Street at Franklin.</p>
    <figure class="snap">${pic("outside-patio", "The Giacobbi's storefront and patio on Allen Street", "(max-width:880px) 90vw, 480px", true)}<figcaption>59 Allen Street, Allentown</figcaption>
      ${sticker({ top: "SINCE THE", bottom: "CHARLESGATE", mid: "1987" })}</figure>
    <div class="ticket">
      <div><b>Wed–Sat</b>Bar 4:30 · Kitchen 5–10</div>
      <div><b>Sunday</b>4–9pm</div>
      <div><b>Mon–Tue</b>Closed</div>
      <div><b>Fridays</b>Fish fry</div>
    </div>
  </div>
</div></section>

<div class="lineage-strip"><div class="wrap">
  <span><b>1987</b> The Charlesgate</span><i>◆</i><span><b>'90s</b> Giacobbi's Italian Oven</span><i>◆</i><span><b>Decades</b> Carmine's</span><i>◆</i><span><b>2016</b> Allen Street</span>
</div></div>

<section><div class="wrap">
  <div class="eyebrow">From the kitchen</div>
  <h2>The plates people come back for</h2>
  <p class="sub">A few favorites from the current menu.</p>
  <div class="grid g3" style="margin-top:36px">
    ${FEATURED.map(dishCard).join("\n    ")}
  </div>
  <p style="margin-top:28px"><a class="btn ghost" href="/menu.html">Full menu →</a></p>
</div></section>

<section class="alt"><div class="wrap split">
  <div>
    <div class="eyebrow">Our family</div>
    <h2>A Buffalo restaurant family, since the Charlesgate</h2>
    <p class="sub">The family has cooked for Western New York for generations: the Charlesgate on Transit Road, Giacobbi's Italian Oven, then Carmine's. In 2016, cousins Billy and Mike Jacobbi brought the recipes downtown to Allen Street.</p>
    <p class="quote">When you order from us, you order from our lineage in Buffalo.</p>
    <a class="btn primary" href="/story.html">Read the family story</a>
  </div>
  <figure class="photo vintage">${pic("billy-mike-2016", "Billy and Mike Jacobbi holding a spinach and steak pizza and shrimp pappardelle in the dining room, 2016", "(max-width:820px) 100vw, 480px")}
    <figcaption>Billy and Mike Jacobbi on Allen Street, 2016. Photo: Sharon Cantillon / The Buffalo News</figcaption></figure>
</div></section>

<section class="gallery-sec"><div class="wrap">
  <div class="eyebrow">The room</div>
  <h2>Pull up a chair on Allen Street</h2>
  <div class="gallery">
    <figure>${pic("inside", "Dining room with a painted Italian harbor mural", "(max-width:820px) 100vw, 560px")}</figure>
    <figure>${pic("bar-area", "The bar with a long wooden bar top and chalkboard specials", "(max-width:820px) 50vw, 280px")}</figure>
    <figure>${pic("bar-seating", "High-top bar seating", "(max-width:820px) 50vw, 280px")}</figure>
    <figure>${pic("mule", "A copper mug mule cocktail", "(max-width:820px) 50vw, 280px")}</figure>
    <figure>${pic("outside-patio", "Patio seating under umbrellas outside the Allen Street storefront", "(max-width:820px) 50vw, 280px")}</figure>
  </div>
</div></section>

<section class="alt"><div class="wrap grid g2">
  <div class="card">
    <div class="eyebrow">Catering</div>
    <h2 style="font-size:34px">Feeding the office, the party, the whole family</h2>
    <p class="sub">Hot drop-off buffets from $${DROPOFF.price} per person (minimum ${DROPOFF.min}), trays by the half or full, and family-style party packages at the restaurant.</p>
    <a class="btn primary" href="/catering.html">See catering menus</a>
  </div>
  <div class="card" id="visit">
    <div class="eyebrow">Visit</div>
    <h3 style="margin-top:8px">${R.street} at Franklin, ${R.city}, ${R.region} ${R.zip}</h3>
    ${hoursList}
    <p style="font-size:14px;color:var(--muted);margin-top:14px"><b>Parking:</b> use the lot behind the restaurant, entered from Delaware next to Tempo. It's public after 6pm on weekdays and all day on weekends.</p>
  </div>
</div></section>`
);

// ---------- Menu ----------
const itemRow = (i) => `<div class="item${i.img ? " has-img" : ""}">${i.img ? pic(i.img, i.n, "96px") : ""}<div class="txt"><div class="head"><span class="nm">${i.n}${i.h ? `<span class="heritage">${i.h}</span>` : ""}</span><span class="pr">${priceText(i)}</span></div><div class="ds">${i.d}</div>${i.v ? `<ul class="opts">${i.v.map(([l, p, add]) => `<li><span>${l}</span><span>${add ? "+" : ""}${money(p)}</span></li>`).join("")}</ul>` : ""}</div></div>`;
const menuPage = page(
  "Menu | Giacobbi's Cucina Citta, Buffalo NY",
  "Dining menu at Giacobbi's Cucina Citta in Allentown, Buffalo: beans & greens, calamari, pizza, Penne Pink Vodka, lasagne, chicken piccata, Steak Giacobbi and Friday fish fry.",
  "Menu",
  `
${pageHero("Dining menu", "The Menu", "Red sauce, family recipes and a Friday fish fry. Kitchen open Wednesday to Saturday 5–10, Sunday 4–9.", "frutti-di-mare", "Fruitti di Mare: clams, shrimp, mussels and calamari over linguine", sticker({ top: "FRIDAY", bottom: "FISH FRY", mid: "★", cls: "s1", face: CHOC, ink: GOLD, label: "Friday fish fry" }))}
<section style="padding-top:40px"><div class="wrap">
  <p class="note"><b>Staging note:</b> transcribed from the current placemat on giacobbis.com (November 2026). In the live site it's edited from the owner dashboard, and the site, the concierge and the search data all update together.</p>
  <div class="menu-nav">${MENU.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}</div>
  <div class="menu-cols">${MENU.map((s) => `
  <div class="menu-section" id="${s.id}"><h2>${s.title}</h2><div class="deco-rule">◆</div>
    ${s.items.map(itemRow).join("\n    ")}
    ${s.adds ? `<p class="adds">${s.adds}</p>` : ""}
  </div>`).join("")}</div>
  <p style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn primary" href="${R.order}" target="_blank" rel="noopener">Order pickup</a><a class="btn ghost" href="${R.resy}" target="_blank" rel="noopener">Reserve a table</a><a class="btn ghost" href="/catering.html">Catering & parties</a></p>
</div></section>`,
  [menuSchema], "/menu.html"
);

// ---------- Story ----------
const TIMELINE = [
  { era: "Where it started", t: "The Charlesgate", d: "The family's landmark restaurant on Transit Road in Williamsville, remembered as a local legend. The Buffalo News reviewed it in November 1987." },
  { era: "The '90s", t: "Giacobbi's Italian Oven & Rotisserie", d: "Opened at 4715 Transit Road on the Charlesgate site. It served Sicilian specialties, wood-fired pizza and family-style portions meant to feed the whole table. A second location, Giacobbi's Trattoria, opened at 3945 Main Street, on the corner of Main & Eggert in Eggertsville. Its gold matchbooks carried the oven logo you see at the top of this page." },
  { era: "Decades on Transit", t: "Carmine's", d: "For years the family ran Carmine's on Transit Road. That's where the eggplant lasagna became a favorite. A fire closed it in 2015." },
  { era: "2016 to today", t: "Giacobbi's Cucina Citta", d: "Cousins Billy and Mike Jacobbi brought the family's recipes downtown to 59 Allen Street in Allentown and served the first meal in May 2016." },
];
// Headline thumbnails only (no article scans): see the copyright note in CLAUDE.md.
const PRESS = [
  { y: "1987", src: "The Buffalo News", t: "Janice Okun reviewed The Charlesgate on Transit Road, calling it a neighborhood tavern in the suburbs.", thumb: "charlesgate-1987-headline", alt: "Headline: Restaurant Scene, a neighborhood tavern in the suburbs", url: "https://www.newspapers.com/image/876040354/", cite: "The Buffalo News, Nov. 20, 1987, p. 82" },
  { y: "1995", src: "The Buffalo News", t: "Janice Okun reviewed Giacobbi's Italian Oven & Rotisserie and named the grilled eggplant pizza its best dish.", thumb: "giacobbis-1995-headline", alt: "Headline: Mediterranean Avenue, at Giacobbi's, Sicilian specialties spiced for the '90s", url: "https://www.newspapers.com/image/875956309/", cite: "The Buffalo News, Jan. 20, 1995, p. 68" },
  { y: "2016", src: "Buffalo Rising", t: "Covered the family bringing its recipes to Allen Street after Carmine's." },
  { y: "2016", src: "The Buffalo News", t: "Photographed Billy and Mike Jacobbi with the spinach and steak pizza and the shrimp pappardelle." },
];
const pressItem = (x) => `<div class="pr-item"><span class="pr-y">${x.y}</span><div><b>${x.src}</b><br><span>${x.t}</span>${x.thumb ? `
      <a class="pr-thumb" href="${x.url}" target="_blank" rel="noopener"><img src="/assets/img/press/${x.thumb}.jpg" alt="${x.alt}" loading="lazy"><small>${x.cite} · view on Newspapers.com ↗</small></a>` : ""}</div></div>`;
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ingRow = (x) => { const [n, q] = x.split(" — "); return q ? `<li><span>${esc(n)}</span><span>${esc(q)}</span></li>` : `<li><span>${esc(x)}</span></li>`; };
const recipeCard = (r) => `<details class="recipe-card"><summary><div class="rc-from">${esc(r.from)}</div><h3>${esc(r.title)}</h3>${r.yield ? `<p class="rc-yield">Yield: ${esc(r.yield)}</p>` : ""}<p>${esc(r.blurb)}</p>${r.marks.length ? `<p class="rc-marks">${r.marks.map(esc).join(" · ")}</p>` : ""}<span class="rc-open">Read the card</span></summary>
      <div class="rc-body"><h4>Ingredients</h4><ul class="rc-ing">${r.ingredients.map(ingRow).join("")}</ul>${r.steps.length ? `<h4>Procedure</h4>${r.steps.map((x) => `<p>${esc(x.replace(/^-\s*/, ""))}</p>`).join("")}` : ""}</div></details>`;
const storyPage = page(
  "Our Family | A Buffalo Restaurant Lineage | Giacobbi's Cucina Citta",
  "The Jacobbi family's Buffalo restaurant history, from The Charlesgate and Giacobbi's Italian Oven on Transit Road to Carmine's and Giacobbi's Cucina Citta on Allen Street.",
  "Our Family",
  `
<section><div class="wrap story-head" style="max-width:820px">
  ${sticker({ top: "A BUFFALO FAMILY", bottom: "SINCE THE CHARLESGATE", mid: "1987", face: GOLD, ink: CHOC })}
  <div class="eyebrow">Our family</div>
  <h1 style="font-size:clamp(44px,6.4vw,72px);margin:14px 0 20px;line-height:1">A Buffalo restaurant family, since the Charlesgate</h1>
  <p class="sub">When you order from Giacobbi's, you're ordering from a family that has cooked for Western New York for generations: the Charlesgate, Giacobbi's on Transit, Carmine's, and now Allen Street.</p>

  <figure class="photo vintage wide" style="margin-top:36px">${pic("billy-mike-2016", "Billy and Mike Jacobbi holding a spinach and steak pizza and shrimp pappardelle in the dining room, 2016", "(max-width:820px) 100vw, 780px")}
    <figcaption>Cousins Billy and Mike Jacobbi, the year they opened on Allen Street. Photo: Sharon Cantillon / The Buffalo News, 2016</figcaption></figure>

  <div class="timeline">
    ${TIMELINE.map((x) => `<div class="tl"><div class="tl-era">${x.era}</div><h3>${x.t}</h3><p>${x.d}</p></div>`).join("")}
  </div>

  <h2 style="font-size:32px;margin-top:64px">In the papers</h2>
  <p class="sub">The family's restaurants have been covered in Buffalo food writing for decades.</p>
  <div class="press">${PRESS.map(pressItem).join("")}</div>
  <p class="fine-print">Headlines © The Buffalo News, shown as small thumbnails linking to the original pages on Newspapers.com.</p>

  <h2 style="font-size:32px;margin-top:64px">From the family binder</h2>
  <p class="sub">The kitchen still cooks from a binder of typed sheets in plastic sleeves, most of them carried over from Carmine's, with decades of pencil and marker on top. Here are a few, exactly as written. Quantities are restaurant batches, so you may want to cut them down.</p>
  <div class="recipes">
    ${RECIPES.map(recipeCard).join("\n    ")}
    <div class="recipe-card secret"><div class="rc-from">Giacobbi's</div><h3>Giacobbi's Red Sauce</h3><p class="rc-yield">Yield: about 9 gallons</p><p>The house red sauce, made nine gallons at a time. This card stays in the binder.</p><span class="rc-stamp">Family only</span></div>
  </div>
  <p style="margin-top:36px">Have a question about a family dish? <a href="#" data-open-chat>Ask our concierge →</a></p>
</div></section>`, [], "/story.html"
);

// ---------- Catering ----------
const list = (arr) => `<ul class="dot-list">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const trayTable = (rows, cols = ["½ tray", "Full tray"]) => `<table class="trays"><thead><tr><th></th>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(([n, a, b]) => `<tr><td>${n}</td><td>${a == null ? "—" : money(a)}</td><td>${money(b)}</td></tr>`).join("")}</tbody></table>`;
const cateringPage = page(
  "Catering | Giacobbi's Cucina Citta, Buffalo NY",
  `Drop-off Italian catering in Buffalo from Giacobbi's Cucina Citta: hot buffets from $${DROPOFF.price} per person, half and full trays, and family-style party packages.`,
  "Catering",
  `
${pageHero("Catering & parties", "Trays for the whole family", "", "penne-palermo", "Penne Palermo with sausage", sticker({ top: "DROP-OFF BUFFET", bottom: "MINIMUM 15", mid: money(DROPOFF.price), small: "PER PERSON", cls: "s1" }))}
<section style="padding-top:48px"><div class="wrap split" style="align-items:start">
  <div>
    <p class="sub">Hot, family-style drop-off buffets for office lunches, birthdays, showers, stags and holidays, plus family-style party packages in our dining room. Call <a href="tel:${R.tel}">${R.phone}</a> for special requests.</p>
    <div class="pkg card">
      <div class="eyebrow">Most popular package</div>
      <h2 style="font-size:34px;margin:6px 0">Main Drop-off Menu</h2>
      <p class="big-price">${money(DROPOFF.price)} <small>per person</small></p>
      <p><b>${DROPOFF.pick}.</b> Minimum ${DROPOFF.min} people. ${DROPOFF.extra}.</p>
      <div class="cols3">
        <div><h4>Entrées</h4>${list(DROPOFF.entrees)}</div>
        <div><h4>Sides</h4>${list(DROPOFF.sides)}<h4>Salads</h4>${list(DROPOFF.salads)}</div>
      </div>
      <h4>Sweeten the pot <small>(minimum ${DROPOFF.sweetsMin})</small></h4>
      <ul class="info-list">${DROPOFF.sweets.map(([n, p]) => `<li><span>${n}</span><span>add ${p}</span></li>`).join("")}</ul>
      <ul class="fine-list">${DROPOFF.fine.map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>
  </div>
  <div class="card sticky">
    <h3>Request a catering quote</h3>
    <form class="stack" onsubmit="event.preventDefault();this.innerHTML='<p><b>Thank you!</b> Demo only, nothing was sent. In the live site this request goes to the catering inbox in the owner dashboard.</p>'">
      <label>Name<input required></label>
      <label>Email or phone<input required></label>
      <label>Event date<input type="date" required></label>
      <label>Guests<select><option>15–25</option><option>25–40</option><option>40–75</option><option>75+</option></select></label>
      <label>What you need<select><option>Main drop-off package</option><option>Trays only</option><option>Party at the restaurant</option></select></label>
      <label>Anything else?<textarea rows="3" placeholder="Dietary needs, favorite dishes, budget…"></textarea></label>
      <button class="btn primary" style="justify-content:center">Send request</button>
    </form>
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <div class="eyebrow">Just trays</div>
  <h2>Trays by the half or full</h2>
  <p class="sub">Half trays feed about 8 to 12, full trays 16 to 24 (lasagne: half 8, full 16).</p>
  <div class="grid g2" style="margin-top:28px">
    <div class="card"><h3>Pasta & entrée trays</h3>${trayTable(TRAYS.pasta)}
      <h3 style="margin-top:22px">Fresh trays, cooked to order</h3>${trayTable(TRAYS.fresh, ["16 pc", "32 pc"])}
      <p class="fine-print">${TRAYS.roastBeef}</p></div>
    <div class="card"><h3>Cocktail & appetizer trays</h3>
      <table class="trays"><tbody>${TRAYS.appetizers.map(([n, c, p]) => `<tr><td>${n}</td><td>${c}</td><td>${money(p)}</td></tr>`).join("")}</tbody></table>
      <h3 style="margin-top:22px">Sides & salads</h3>${trayTable(TRAYS.sides)}</div>
  </div>
</div></section>

<section><div class="wrap split" style="align-items:start">
  <div>
    <div class="eyebrow">Parties at the restaurant</div>
    <h2>Family-style party package</h2>
    <p class="sub">${PARTY.intro}</p>
    <ul class="info-list" style="margin-top:18px">${PARTY.price.map(([n, p]) => `<li><span>${n}</span><span>${money(p)} per person</span></li>`).join("")}<li><span>${PARTY.min}</span><span></span></li></ul>
    <p style="color:var(--muted);margin-top:14px">${PARTY.includes} ${PARTY.sweets}</p>
  </div>
  <div class="card"><h4>Entrées</h4>${list(PARTY.entrees)}<h4>Sides (choose 1)</h4>${list(PARTY.sides)}</div>
</div></section>`, [], "/catering.html"
);

// ---------- Shared menu data for the admin editor and the concierge ----------
const menuData = {
  updated: "2026-11",
  source: "giacobbis.com/dining-menu/ placemat",
  sections: MENU.map((s) => ({ id: s.id, title: s.title, items: s.items.map((i) => ({ n: i.n, d: i.d, p: Array.isArray(i.p) ? i.p[0] : i.p ?? (i.v && !i.v[0][2] ? i.v[0][1] : null), price: priceText(i) || (i.v ? `from ${money(i.v[0][1])}` : ""), ...(i.h ? { h: i.h } : {}) })) })),
  catering: { perPerson: DROPOFF.price, min: DROPOFF.min, party: PARTY.price },
};

// ---------- GEO / crawler files ----------
const llms = `# Giacobbi's Cucina Citta

> Family-owned Italian-American restaurant at 59 Allen St. (at Franklin), Buffalo, NY 14202, in the Allentown neighborhood. Owned by cousins Billy and Mike Jacobbi, part of a Buffalo restaurant family whose restaurants include The Charlesgate (Transit Road, Williamsville), Giacobbi's Italian Oven & Rotisserie (4715 Transit Road, 1990s), Giacobbi's Trattoria (3945 Main St. at Eggert, Eggertsville) and Carmine's (Transit Road, closed after a 2015 fire). Open since May 2016.

## Essentials
- Phone: ${R.phone}
- Hours: Wed–Sat bar 4:30pm, kitchen 5–10pm; Sun 4–9pm; closed Mon–Tue
- Reservations: ${R.resy}
- Pickup ordering: ${R.order}
- Delivery: DoorDash
- Parking: lot behind the restaurant, entered from Delaware next to Tempo; public after 6pm weekdays and all day weekends
- Catering: hot drop-off buffets at $${DROPOFF.price} per person (minimum ${DROPOFF.min}; pick 2 entrées, 2 sides & 1 salad), half and full trays, and family-style party packages at the restaurant ($28 for 2 entrées, $33 for 3; minimum 12 adults)

## Known for
- Beans & Greens ($11), Calamari Della Casa ($17), Clams Casino (family recipe, $16), Crab & Shrimp Bisque (Taste of Buffalo award winner, $11)
- Lasagne ($20), Chicken Piccata ($24, best seller on the catering menu), Chicken Parmesan ($23), Steak Giacobbi ($28), Fruitti di Mare ($29), homemade gnocchi
- Friday fish fry: Icelandic haddock, fried or Italian baked
- Eggplant lasagne (a Carmine's recipe) and Tortellini Alfredo ala Giacobbi on the party and catering menus

## Pages
- [Menu](https://giacobbis.com/menu.html)
- [Our Family](https://giacobbis.com/story.html)
- [Catering](https://giacobbis.com/catering.html)
`;

writeFileSync("index.html", home);
writeFileSync("menu.html", menuPage);
writeFileSync("story.html", storyPage);
writeFileSync("catering.html", cateringPage);
writeFileSync("assets/menu-data.js", `// Generated by build.mjs. Do not edit by hand.\nwindow.GIA_MENU = ${JSON.stringify(menuData, null, 1)};\n`);
writeFileSync("llms.txt", llms);
// Staging: keep it out of search engines so it doesn't compete with the live site.
writeFileSync("robots.txt", "User-agent: *\nDisallow: /\n");
console.log("built");
