// The Giacobbi's matchbook mark (Giacobbi's Trattoria, 3945 Main St. at Eggert), vectorized from a photo of the
// original matchbook with potrace, with CUCINA CITTA in the banner where it said TRATTORIA.
// Source paths: logo-trace.json. Colors default to the family's Vespa artwork palette.
import { readFileSync } from "node:fs";

const T = JSON.parse(readFileSync(new URL("./logo-trace.json", import.meta.url), "utf8"));
// The original banner sits at x 466–1420, y 468–572 in the 1600×1000 trace frame.
const BANNER = { x: 466, y: 467, w: 954, h: 106 };

export const VESPA = { teal: "#2f4a4f", mint: "#a5c4c4", red: "#c73a2f", cream: "#fbf6ea", olive: "#6b7f45", butter: "#e6c56a" };

export function logoSVG({ ink = VESPA.teal, banner = VESPA.red, bannerInk = VESPA.cream, title = "Giacobbi's Cucina Citta", id = "lg", cls = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="118 80 1364 848"${cls ? ` class="${cls}"` : ""} role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>
<g transform="${T.markTransform}" fill="${ink}"><path d="${T.mark}"/></g>
<rect x="${BANNER.x}" y="${BANNER.y}" width="${BANNER.w}" height="${BANNER.h}" fill="${banner}"/>
<g transform="translate(${BANNER.x} ${BANNER.y + 1}) scale(.5) ${T.bannerTransform}" fill="${bannerInk}"><path d="${T.banner}"/></g>
</svg>`;
}
