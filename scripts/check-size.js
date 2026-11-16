#!/usr/bin/env node

// Fails when the gzipped bundle grows past the budget, so growth is a choice
// made in a PR (raise BUDGET_KB) rather than something that creeps in.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 12;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(join(ROOT, "dist", "modest-ui.min.css"));
const gzipped = gzipSync(css).length;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

console.log(`dist/modest-ui.min.css: ${kb(css.length)} minified, ${kb(gzipped)} gzipped (budget ${BUDGET_KB} kB gzipped)`);

if (gzipped > BUDGET_KB * 1024) {
  console.error(`Over budget by ${kb(gzipped - BUDGET_KB * 1024)}. Trim the CSS, or raise BUDGET_KB in scripts/check-size.js if the growth is worth it.`);
  process.exit(1);
}
