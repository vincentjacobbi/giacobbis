// Writes the logo files (pure paths, no fonts needed) and renders PNGs (og:image, favicon, apple-touch-icon)
// with headless Chrome. Run: node render-logo.mjs   (needs Google Chrome installed)
import { writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { logoSVG, VESPA } from "./logo.mjs";

writeFileSync("assets/img/logo-cucina-citta.svg", logoSVG());
writeFileSync("assets/img/logo-cucina-citta-reversed.svg", logoSVG({ ink: VESPA.cream }));
writeFileSync("assets/img/logo-cucina-citta-mint.svg", logoSVG({ banner: VESPA.teal }));

// Favicon: the matchbook's big G on mint.
const T = JSON.parse(readFileSync(new URL("./logo-trace.json", import.meta.url), "utf8"));
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 170 430 430"><rect x="70" y="170" width="430" height="430" fill="${VESPA.mint}"/><g transform="${T.markTransform}" fill="${VESPA.teal}"><path d="${T.mark}"/></g><rect x="462" y="170" width="60" height="430" fill="${VESPA.mint}"/></svg>`;
writeFileSync("assets/img/favicon.svg", fav);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "logo-"));
const shot = (name, w, h, body) => {
  const html = join(dir, name + ".html");
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${body}`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, `--screenshot=${resolve("assets/img/" + name + ".png")}`, "file://" + html], { stdio: "ignore" });
};
const awning = `repeating-linear-gradient(90deg,${VESPA.red} 0 40px,#fff 40px 80px)`;
shot("og-image", 1200, 630, `<div style="width:1200px;height:630px;background:${VESPA.cream};display:grid;place-items:center;position:relative"><div style="position:absolute;left:0;right:0;top:0;height:34px;background:${awning}"></div><div style="width:820px;margin-top:20px">${logoSVG({ id: "og" })}</div><div style="position:absolute;left:0;right:0;bottom:0;height:44px;background:${VESPA.teal}"></div></div>`);
shot("apple-touch-icon", 180, 180, fav.replace("<svg ", '<svg width="180" height="180" '));
shot("favicon", 64, 64, fav.replace("<svg ", '<svg width="64" height="64" '));
console.log("logo files written");
