#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { transform } from "lightningcss";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INDEX_CSS = join(ROOT, "index.css");
const DIST_DIR = join(ROOT, "dist");
const BUNDLE_OUTPUT = join(DIST_DIR, "modest-ui.css");
const BUNDLE_MIN_OUTPUT = join(DIST_DIR, "modest-ui.min.css");

/**
 * Resolve @import statements recursively
 */
async function resolveImports(filePath, processedFiles = new Set()) {
  // Prevent circular imports
  if (processedFiles.has(filePath)) {
    console.warn(`Warning: Circular import detected for ${filePath}`);
    return "";
  }
  processedFiles.add(filePath);

  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const resolvedLines = [];

  for (const line of lines) {
    const importMatch = line.match(/@import\s+(?:url\()?["']([^"']+)["']\)?;?/);

    if (importMatch) {
      const importPath = importMatch[1];
      // Resolve relative path
      const absolutePath = join(dirname(filePath), importPath);

      try {
        // Recursively resolve the imported file
        const importedContent = await resolveImports(absolutePath, processedFiles);
        resolvedLines.push(importedContent);
      } catch (err) {
        console.error(`Error importing ${importPath} from ${filePath}:`, err.message);
        // Keep the original import if resolution fails
        resolvedLines.push(line);
      }
    } else {
      resolvedLines.push(line);
    }
  }

  return resolvedLines.join("\n");
}

async function buildBundle() {
  try {
    console.log("Building CSS bundle...");

    // Create dist directory if it doesn't exist
    await mkdir(DIST_DIR, { recursive: true });

    // Resolve all imports starting from index.css
    const bundledContent = await resolveImports(INDEX_CSS);

    // Add header comment
    const header = `/* modest-ui - Bundled CSS
 * Generated from index.css and all component styles
 * This file contains all styles in a single file for easy distribution
 */

`;

    const finalContent = header + bundledContent;

    // Write the unminified bundle
    await writeFile(BUNDLE_OUTPUT, finalContent);

    const size = (finalContent.length / 1024).toFixed(2);
    console.log(`✓ Bundle created: ${BUNDLE_OUTPUT}`);
    console.log(`  Size: ${size} KB`);

    // Minify with Lightning CSS
    const { code } = transform({
      filename: "modest-ui.css",
      code: Buffer.from(finalContent),
      minify: true,
    });

    await writeFile(BUNDLE_MIN_OUTPUT, code);

    const minSize = (code.length / 1024).toFixed(2);
    console.log(`✓ Minified bundle created: ${BUNDLE_MIN_OUTPUT}`);
    console.log(`  Size: ${minSize} KB`);
  } catch (err) {
    console.error("Error building bundle:", err.message);
    process.exit(1);
  }
}

buildBundle();
