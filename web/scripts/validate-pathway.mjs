/**
 * Validates pathwayNodes.json: every option.target references an existing node id.
 * Run: node web/scripts/validate-pathway.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../src/data/pathwayNodes.json");
const nodes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const ids = new Set(nodes.map((n) => n.id));

let errors = 0;
for (const n of nodes) {
  for (const opt of n.options ?? []) {
    if (opt.target && !ids.has(opt.target)) {
      console.error(`Missing target "${opt.target}" referenced from "${n.id}"`);
      errors++;
    }
  }
}

if (errors) {
  process.exit(1);
}
console.log("pathwayNodes.json OK:", nodes.length, "nodes, all targets resolve.");
