// Genera public/og.png (1200×630) con la estética "terminal" del sitio:
// nombre + sparkline ascendente verde.
// Uso: node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og.png");

const W = 1200, H = 630, STEP = 64;
const BG = "#0a0a0a", FG = "#e7e5e0", AC = "#76CE6B", DIM = "#8a8a8a", MUTE = "#6a6a6a";

let gridLines = "";
for (let x = STEP; x < W; x += STEP) gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`;
for (let y = STEP; y < H; y += STEP) gridLines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`;

// sparkline ascendente dentro de la caja (x0,y0,w,h)
function spark(x0, y0, w, h, n = 48) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let v = Math.pow(t, 1.5) * 0.85 + 0.08;
    v += Math.sin(i * 0.7) * 0.03 + Math.cos(i * 1.3) * 0.02;
    pts.push(v);
  }
  const max = Math.max(...pts), min = Math.min(...pts);
  const xy = pts.map((v, i) => {
    const x = x0 + (i / (n - 1)) * w;
    const y = y0 + h - ((v - min) / (max - min)) * h;
    return [x, y];
  });
  const line = xy.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${x0 + w} ${y0 + h} L ${x0} ${y0 + h} Z`;
  return { line, area };
}
const sp = spark(80, 430, W - 160, 120);

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="f" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="${AC}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${AC}" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <g stroke="rgba(255,255,255,0.035)" stroke-width="1">${gridLines}</g>

  <circle cx="86" cy="92" r="7" fill="${AC}"/>
  <text x="108" y="100" font-family="monospace" font-size="22" letter-spacing="3" fill="${AC}">MDG</text>
  <text x="168" y="100" font-family="monospace" font-size="22" letter-spacing="3" fill="${MUTE}">/ PRODUCT MANAGER</text>

  <text x="76" y="232" font-family="sans-serif" font-size="92" font-weight="600" letter-spacing="-3" fill="${FG}">Marcos Damián González.</text>
  <text x="80" y="296" font-family="monospace" font-size="27" font-weight="600" letter-spacing="-1" fill="${AC}">inversión · ahorro · banca digital</text>

  <path d="${sp.area}" fill="url(#f)"/>
  <path d="${sp.line}" fill="none" stroke="${AC}" stroke-width="2.5"/>
  <text x="80" y="600" font-family="monospace" font-size="22" fill="${DIM}">CARRERA · 6Y &#160;&#160; +10.0× &#160;&#160; ▲ growth</text>
  <text x="${W - 80}" y="600" text-anchor="end" font-family="monospace" font-size="22" fill="${MUTE}">marcosdamiangonzalez.ar</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("OG image escrita en", out);
