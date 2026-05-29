/**
 * One-off: read legacy HTML and write src/data/pathwayNodes.json
 * Run from repo root: node web/scripts/extract-nodes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "../../ai-framework-23.html");
const outPath = path.join(__dirname, "../src/data/pathwayNodes.json");

const html = fs.readFileSync(htmlPath, "utf8");
const marker = "const nodes = ";
const start = html.indexOf(marker);
if (start === -1) throw new Error("const nodes = not found");
let i = start + marker.length;
if (html[i] !== "[") throw new Error("expected [");
let depth = 0;
const begin = i;
for (; i < html.length; i++) {
  const c = html[i];
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) {
      i++;
      break;
    }
  }
}
const arrayLiteral = html.slice(begin, i);
const nodes = new Function(`"use strict"; return ${arrayLiteral}`)();
const stripped = nodes.map(({ x, y, ...rest }) => rest);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(stripped, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "nodes:", stripped.length);
