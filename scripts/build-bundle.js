#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const INDEX_CSS = join(ROOT, "index.css");
const DIST_DIR = join(ROOT, "dist");
const BUNDLE_OUTPUT = join(DIST_DIR, "modest-components.css");

/**
 * Resolve @import statements recursively
 */
async function resolveImports(filePath, processedFiles = new Set()) {
  // Prevent circular imports
  if (processedFiles.has(filePath)) {
    return "";
  }
  processedFiles.add(filePath);

  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const resolvedLines = [];

  for (const line of lines) {
    const importMatch = line.match(/@import\s+["'](.+?)["'];?/);

    if (importMatch) {
      const importPath = importMatch[1];
      // Resolve relative path
      const absolutePath = join(dirname(filePath), importPath);

      try {
        // Recursively resolve the imported file
        const importedContent = await resolveImports(
          absolutePath,
          processedFiles
        );
        resolvedLines.push(importedContent);
      } catch (err) {
        console.error(`Error importing ${importPath}:`, err.message);
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
    const header = `/* modest-components - Bundled CSS
 * Generated from index.css and all component styles
 * This file contains all styles in a single file for easy distribution
 */

`;

    const finalContent = header + bundledContent;

    // Write the bundled file
    await writeFile(BUNDLE_OUTPUT, finalContent);

    console.log(`✓ Bundle created: ${BUNDLE_OUTPUT}`);
    console.log(`  Size: ${(finalContent.length / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.error("Error building bundle:", err.message);
    process.exit(1);
  }
}

buildBundle();
