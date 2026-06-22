// Genera public/og.png (1200×630) con la estética "terminal" del sitio.
// Uso: node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og.png");

const W = 1200;
const H = 630;
const STEP = 64;

let grid = "";
for (let x = STEP; x < W; x += STEP) {
  grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`;
}
for (let y = STEP; y < H; y += STEP) {
  grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`;
}

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <g stroke="rgba(255,255,255,0.035)" stroke-width="1">${grid}</g>

  <!-- barra de acento -->
  <rect x="40" y="232" width="5" height="210" fill="#76CE6B"/>

  <!-- eyebrow -->
  <circle cx="86" cy="92" r="7" fill="#76CE6B"/>
  <text x="108" y="100" font-family="monospace" font-size="22" letter-spacing="3" fill="#76CE6B">MDG</text>
  <text x="168" y="100" font-family="monospace" font-size="22" letter-spacing="3" fill="#6a6a6a">/ PRODUCT MANAGER</text>

  <!-- nombre -->
  <text x="76" y="300" font-family="sans-serif" font-size="112" font-weight="600" letter-spacing="-3" fill="#e7e5e0">Marcos Damián</text>
  <text x="76" y="412" font-family="sans-serif" font-size="112" font-weight="600" letter-spacing="-3" fill="#e7e5e0">González.</text>

  <!-- subtítulo acento -->
  <text x="80" y="482" font-family="monospace" font-size="30" font-weight="600" letter-spacing="-1" fill="#76CE6B">inversión · ahorro · banca digital</text>

  <!-- pie -->
  <text x="80" y="566" font-family="monospace" font-size="22" fill="#8a8a8a">+6 años construyendo productos de inversión</text>
  <text x="${W - 80}" y="566" text-anchor="end" font-family="monospace" font-size="22" fill="#6a6a6a">marcosdamiangonzalez.ar</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("OG image escrita en", out);
