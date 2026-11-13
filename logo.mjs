// The Giacobbi's matchbook mark (Giacobbi's Trattoria, Main & Eggert), redrawn as SVG with "CUCINA CITTA" in the banner.
// Used by build.mjs (inline in pages) and written to assets/img/logo-matchbook*.svg.
// Type: EB Garamond 800 (closest free match to the matchbook's bold old-style serif).

// Oven-mouth voussoirs: angle in degrees around the arch centre.
const ARCH = { cx: 364, cy: 262, r: 128, size: 54, angles: [170, 138, 106, 74, 42, 10] };
const brick = (a) => {
  const t = (a * Math.PI) / 180, x = ARCH.cx + ARCH.r * Math.cos(t), y = ARCH.cy - ARCH.r * Math.sin(t);
  return `<rect x="${(x - ARCH.size / 2).toFixed(1)}" y="${(y - ARCH.size / 2).toFixed(1)}" width="${ARCH.size}" height="${ARCH.size}" transform="rotate(${(90 - a).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
};
// Pizza toppings: little lumps along the pie.
const lumps = [[312, 282, 9], [329, 276, 8], [346, 279, 10], [364, 274, 8], [381, 278, 10], [398, 275, 8], [414, 280, 9], [428, 285, 6], [338, 289, 6], [372, 288, 7], [405, 289, 6]];

export function logoSVG({ ink = "#4a2e1c", paper = "transparent", banner = "CUCINA CITTA", title = "Giacobbi's Cucina Citta", standalone = false, id = "lg" } = {}) {
  const fontImport = standalone ? `<style>@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;800&amp;display=block');</style>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>${fontImport}
  ${paper !== "transparent" ? `<rect width="600" height="350" fill="${paper}"/>` : ""}
  <g fill="none" stroke="${ink}" stroke-width="2.6" stroke-linejoin="miter">
    ${ARCH.angles.map(brick).join("")}
    <rect x="186" y="262" width="60" height="30"/><rect x="478" y="266" width="58" height="44"/>
    <path d="M118 290 H300 M36 303 H292 M36 309 H286"/>
  </g>
  <g fill="${ink}">
    <path d="M280 302 L296 290 L458 286 L476 298 L466 312 L294 317 Z" fill="${paper === "transparent" ? "none" : paper}" stroke="${ink}" stroke-width="2.6"/>
    <ellipse cx="368" cy="289" rx="74" ry="15" fill="none" stroke="${ink}" stroke-width="3"/>
    ${lumps.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * 0.7).toFixed(1)}"/>`).join("")}
    <rect x="34" y="318" width="526" height="17"/>
    <rect x="166" y="160" width="380" height="54"/>
    <text x="356" y="198" text-anchor="middle" font-family="'EB Garamond', Garamond, Georgia, serif" font-weight="600" font-size="29" letter-spacing="9.5" fill="${paper === "transparent" ? "#f3e2b0" : paper}">${banner}</text>
    <text transform="translate(42 210) scale(.8 1)" font-family="'EB Garamond', Garamond, Georgia, serif" font-weight="800" font-size="218">G</text>
    <text x="172" y="150" font-family="'EB Garamond', Garamond, Georgia, serif" font-weight="800" font-size="150" textLength="390" lengthAdjust="spacingAndGlyphs">ìacobbi’s</text>
  </g>
</svg>`;
}
