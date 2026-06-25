// Codemod: transforma src/components/Site.astro
//  1) extrae el objeto I18N -> src/i18n.ts (export const translations)
//  2) reemplaza data-i18n / data-i18n-html por interpolación server-side {t["..."]}
//  3) elimina el const I18N del <script> del componente
// Uso: node scripts/i18n-codemod.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitePath = join(root, "src", "components", "Site.astro");
let src = readFileSync(sitePath, "utf8");

// 1) Extraer I18N (objeto literal entre `const I18N = {` y el primer `\n  };`)
const i18nRe = /const I18N = (\{[\s\S]*?\n  \});/;
const m = src.match(i18nRe);
if (!m) { console.error("No encontré el objeto I18N"); process.exit(1); }
const objLiteral = m[1];

const i18nTs = `// Traducciones generadas desde el index original (es/en).
export type Lang = "es" | "en";
export const translations: Record<Lang, Record<string, string>> = ${objLiteral};
`;
writeFileSync(join(root, "src", "i18n.ts"), i18nTs, "utf8");

// 3) sacar el const I18N del componente
src = src.replace(/  const I18N = \{[\s\S]*?\n  \};\n/, "");

// 2a) data-i18n-html="K"  (con hijos anidados, cierre por backreference del mismo tag)
src = src.replace(
  /<(\w+)([^>]*?)\sdata-i18n-html="([^"]+)"([^>]*?)>[\s\S]*?<\/\1>/g,
  (_full, tag, pre, key, post) => `<${tag}${pre}${post} set:html={t["${key}"]}></${tag}>`
);

// 2b) data-i18n="K" (texto simple, sin tags anidados)
src = src.replace(
  /<(\w+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*?)>[^<]*<\/\1>/g,
  (_full, tag, pre, key, post) => `<${tag}${pre}${post}>{t["${key}"]}</${tag}>`
);

writeFileSync(sitePath, src, "utf8");

const left = (src.match(/data-i18n/g) || []).length;
console.log("i18n.ts escrito. data-i18n restantes en Site.astro:", left);
