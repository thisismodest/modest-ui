#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "components");
const INDEX_HTML = join(ROOT, "index.html");

function toTitleCase(str) {
  // Handle special acronyms
  const acronyms = ["otp", "url", "api", "css", "html", "json"];

  return str
    .split("-")
    .map((word) => {
      if (acronyms.includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

async function getComponents() {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Check if preview.html exists
      try {
        await readFile(join(COMPONENTS_DIR, entry.name, "preview.html"));
        components.push({
          slug: entry.name,
          title: toTitleCase(entry.name),
        });
      } catch {
        // No preview.html, skip
      }
    }
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

function generateLinks(components) {
  return components.map((c) => `          <a href="#${c.slug}" class="sidebar-link" data-component="${c.slug}">${c.title}</a>`).join("\n");
}

async function updateIndexHtml(components) {
  const html = await readFile(INDEX_HTML, "utf-8");

  const startMarker = "<!-- COMPONENTS_LIST_START -->";
  const endMarker = "<!-- COMPONENTS_LIST_END -->";

  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find component list markers in index.html");
    process.exit(1);
  }

  const before = html.slice(0, startIndex + startMarker.length);
  const after = html.slice(endIndex);
  const links = generateLinks(components);

  const newHtml = `${before}\n${links}\n${after}`;

  await writeFile(INDEX_HTML, newHtml);

  console.log(`Updated index.html with ${components.length} components:`);
  components.forEach((c) => console.log(`  - ${c.title}`));
}

async function main() {
  try {
    const components = await getComponents();

    if (components.length === 0) {
      console.warn("No components found with preview.html");
      return;
    }

    await updateIndexHtml(components);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
