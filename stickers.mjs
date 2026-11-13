// Giacobbi's sticker set: our own illustrations (tomato, olives, spritz, Vespa) in round badges,
// colored from the family's Vespa artwork. Inspired by Italian-restaurant sticker sheets; drawn from scratch.
export const C = {
  ink: "#2a2422", teal: "#2f4a4f", mint: "#a5c4c4", mintDk: "#709599", red: "#c73a2f", redDk: "#9a2a22",
  cream: "#fbf6ea", olive: "#6b7f45", oliveDk: "#4c5c2f", leaf: "#7d9150", butter: "#e6c56a", orange: "#ec7a2c", cobble: "#9c816e",
};
const S = `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

const ART = {
  tomato: `<g ${S}>
    <path d="M100 74 C74 72 58 92 60 114 C62 140 82 150 100 150 C120 150 142 140 142 114 C143 90 126 72 100 74 Z" fill="${C.red}"/>
    <path d="M128 92 C140 108 136 136 112 146 C128 132 132 112 128 92 Z" fill="${C.redDk}" stroke="none"/>
    <path d="M100 79 L86 70 L92 82 L74 84 L92 90 L84 102 L100 92 L112 104 L110 90 L128 90 L112 82 L118 70 Z" fill="${C.leaf}"/>
    <path d="M100 80 C100 72 102 64 108 58" fill="none" stroke-width="4"/>
  </g>
  <ellipse cx="80" cy="104" rx="9" ry="5" transform="rotate(-35 80 104)" fill="#fff" opacity=".7"/>`,
  olives: `<g ${S}>
    <path d="M52 70 C80 74 110 80 150 104" fill="none" stroke-width="4"/>
    <path d="M70 72 C80 56 104 52 118 56 C104 64 88 72 70 72 Z" fill="${C.leaf}"/>
    <path d="M104 80 C122 66 146 70 156 78 C140 84 120 86 104 80 Z" fill="${C.olive}"/>
    <path d="M128 94 C140 82 160 84 168 92 C154 98 140 98 128 94 Z" fill="${C.leaf}"/>
    <path d="M84 76 L84 90" fill="none"/><path d="M116 86 L118 100" fill="none"/>
    <ellipse cx="82" cy="110" rx="17" ry="22" fill="${C.ink}" transform="rotate(-12 82 110)"/>
    <ellipse cx="118" cy="122" rx="16" ry="21" fill="${C.oliveDk}" transform="rotate(14 118 122)"/>
  </g>
  <ellipse cx="76" cy="102" rx="4" ry="7" transform="rotate(-12 76 102)" fill="#fff" opacity=".55"/>
  <ellipse cx="113" cy="114" rx="4" ry="6" transform="rotate(14 113 114)" fill="#fff" opacity=".5"/>`,
  spritz: `<defs><clipPath id="glass"><path d="M68 66 C66 112 80 128 100 128 C120 128 134 112 132 66 Z"/></clipPath></defs>
  <g clip-path="url(#glass)"><rect x="60" y="82" width="80" height="60" fill="${C.orange}"/><rect x="60" y="82" width="80" height="6" fill="#f6a35b"/>
    <rect x="78" y="94" width="16" height="16" rx="3" fill="#fff" opacity=".45" transform="rotate(-12 86 102)"/><circle cx="108" cy="116" r="3" fill="#fff" opacity=".6"/><circle cx="90" cy="120" r="2" fill="#fff" opacity=".6"/></g>
  <g ${S}>
    <path d="M118 46 L96 112" fill="none" stroke-width="6" stroke="${C.ink}"/>
    <path d="M118 46 L96 112" fill="none" stroke-width="3.5" stroke="#fff" stroke-dasharray="6 6"/>
    <path d="M68 66 C66 112 80 128 100 128 C120 128 134 112 132 66 Z" fill="none"/>
    <path d="M100 128 L100 156" fill="none"/><path d="M80 158 C88 154 112 154 120 158" fill="none"/>
    <circle cx="128" cy="70" r="15" fill="${C.orange}"/><circle cx="128" cy="70" r="10" fill="#f9c27a" stroke-width="1.5"/>
    <path d="M128 60 L128 80 M118 70 L138 70 M121 63 L135 77 M135 63 L121 77" fill="none" stroke-width="1.2"/>
  </g>`,
  vespa: `<g ${S}>
    <circle cx="66" cy="136" r="14" fill="${C.ink}"/><circle cx="146" cy="138" r="14" fill="${C.ink}"/>
    <path d="M44 126 C42 100 58 88 82 88 L102 88 C110 88 114 94 114 102 L116 128 L50 130 Z" fill="${C.mint}"/>
    <path d="M52 118 C60 108 76 104 96 106" fill="none" stroke-width="2" stroke="${C.mintDk}"/>
    <path d="M100 124 L134 124 L134 130 L100 130 Z" fill="${C.mintDk}"/>
    <path d="M126 128 C124 104 130 86 144 72 L150 76 C140 94 138 110 140 128 Z" fill="${C.mint}"/>
    <path d="M128 132 C132 118 158 116 164 132 Z" fill="${C.mint}"/>
    <rect x="62" y="80" width="40" height="10" rx="5" fill="${C.cobble}"/>
    <path d="M144 72 L150 58 M138 58 L160 56" fill="none"/>
    <circle cx="156" cy="66" r="6" fill="${C.cream}"/>
    <circle cx="44" cy="112" r="3.5" fill="${C.red}"/>
  </g>
  <circle cx="66" cy="136" r="5" fill="${C.cream}"/><circle cx="146" cy="138" r="5" fill="${C.cream}"/>`,
};

let n = 0;
// face/ink: badge background and lettering; art: one of ART's keys.
export function sticker({ art, top, bottom, face = C.cream, ink = C.red, ring = C.ink, cls = "", label }) {
  const id = `sk${++n}`;
  return `<div class="sticker ${cls}" role="img" aria-label="${label || [top, bottom].join(", ")}"><svg viewBox="0 0 200 200" aria-hidden="true">
  <defs><path id="${id}t" d="M30 100 A70 70 0 0 1 170 100"/><path id="${id}b" d="M14 100 A86 86 0 0 0 186 100"/></defs>
  <circle cx="100" cy="100" r="97" fill="${face}" stroke="${ring}" stroke-width="3"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="${ink}" stroke-width="1.4"/>
  <text font-family="EB Garamond, Georgia, serif" font-weight="800" font-size="23" letter-spacing="1.5" fill="${ink}"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${top}</textPath></text>
  <text font-family="EB Garamond, Georgia, serif" font-weight="800" font-size="16" letter-spacing="2" fill="${ink}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>
  <g transform="translate(100 108) scale(.84) translate(-100 -108)">${ART[art].replaceAll('id="glass"', `id="${id}g"`).replaceAll("url(#glass)", `url(#${id}g)`)}</g>
  <text x="22" y="108" font-size="12" fill="${ink}">✦</text><text x="168" y="108" font-size="12" fill="${ink}">✦</text>
</svg></div>`;
}

export const STICKERS = {
  tomato: (o = {}) => sticker({ art: "tomato", top: "PLUM TOMATO", bottom: "HOUSE RED SAUCE", ...o }),
  olives: (o = {}) => sticker({ art: "olives", top: "KALAMATA", bottom: "SINCE 1970", face: C.olive, ink: C.cream, ...o }),
  spritz: (o = {}) => sticker({ art: "spritz", top: "THE BAR", bottom: "OPENS AT 4:30", face: C.teal, ink: C.cream, ...o }),
  vespa: (o = {}) => sticker({ art: "vespa", top: "TAKE IT HOME", bottom: "PICKUP & DELIVERY", ink: C.teal, ...o }),
};
