// Writes the matchbook logo files and renders PNGs (og:image, favicon, apple-touch-icon) with headless Chrome.
// Run: node render-logo.mjs   (needs Google Chrome installed and an internet connection for the EB Garamond webfont)
import { writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { logoSVG } from "./logo.mjs";

const GOLD = "#d4b25e", CHOC = "#3b2417";
writeFileSync("assets/img/logo-matchbook.svg", logoSVG({ ink: CHOC, paper: GOLD, standalone: true }));
writeFileSync("assets/img/logo-matchbook-on-brown.svg", logoSVG({ ink: GOLD, paper: CHOC, standalone: true }));
writeFileSync("assets/img/logo-matchbook-transparent.svg", logoSVG({ ink: CHOC, standalone: true }));
// Favicon: the big G on a gold square with a brown border.
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@800&amp;display=block');</style><rect width="64" height="64" fill="${CHOC}"/><rect x="4" y="4" width="56" height="56" fill="${GOLD}"/><text transform="translate(32 52) scale(.82 1)" text-anchor="middle" font-family="'EB Garamond', Georgia, serif" font-weight="800" font-size="60" fill="${CHOC}">G</text></svg>`;
writeFileSync("assets/img/favicon.svg", fav);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const dir = mkdtempSync(join(tmpdir(), "logo-"));
const shot = (name, w, h, body) => {
  const html = join(dir, name + ".html");
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;800&display=block" rel="stylesheet"><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}</style>${body}`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, "--virtual-time-budget=4000", `--screenshot=${resolve("assets/img/" + name + ".png")}`, "file://" + html], { stdio: "ignore" });
};
shot("og-image", 1200, 630, `<div style="width:1200px;height:630px;background:${GOLD};display:grid;place-items:center"><div style="width:880px;border:8px solid ${CHOC};outline:3px solid ${CHOC};outline-offset:10px;padding:34px 40px 26px;background:${GOLD}">${logoSVG({ ink: CHOC, paper: GOLD })}</div></div>`);
shot("apple-touch-icon", 180, 180, fav.replace("<svg ", '<svg width="180" height="180" '));
shot("favicon", 64, 64, fav.replace("<svg ", '<svg width="64" height="64" '));
console.log("logo files written");
