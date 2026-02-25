#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "components");
const INDEX_HTML = join(ROOT, "index.html");

// Override map for components that don't follow the .mdst-{slug} convention
const classOverrides = {
  typography: ".mdst-*",
};

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

function getClassName(slug) {
  // Use override if exists, otherwise derive from convention
  return classOverrides[slug] || `.mdst-${slug}`;
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
          className: getClassName(entry.name),
        });
      } catch {
        // No preview.html, skip
      }
    }
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

function generateLinks(components) {
  return components
    .map((c) => `            <a href="#${c.slug}" class="sidebar-link" data-component="${c.slug}">${c.title}</a>`)
    .join("\n");
}

function generateClassNames(components) {
  const entries = components
    .map((c) => {
      // Quote the key if it contains a hyphen
      const key = c.slug.includes("-") ? `"${c.slug}"` : c.slug;
      return `        ${key}: "${c.className}",`;
    })
    .join("\n");

  return `const classNames = {\n${entries}\n      };`;
}

async function updateIndexHtml(components) {
  let html = await readFile(INDEX_HTML, "utf-8");

  // Update component links
  const linksStartMarker = "<!-- COMPONENTS_LIST_START -->";
  const linksEndMarker = "<!-- COMPONENTS_LIST_END -->";

  const linksStartIndex = html.indexOf(linksStartMarker);
  const linksEndIndex = html.indexOf(linksEndMarker);

  if (linksStartIndex === -1 || linksEndIndex === -1) {
    console.error("Could not find component list markers in index.html");
    process.exit(1);
  }

  const beforeLinks = html.slice(0, linksStartIndex + linksStartMarker.length);
  const afterLinks = html.slice(linksEndIndex);
  const links = generateLinks(components);

  html = `${beforeLinks}\n${links}\n${afterLinks}`;

  // Update classNames object
  const classNamesStartMarker = "/* CLASSNAMES_START */";
  const classNamesEndMarker = "/* CLASSNAMES_END */";

  const classNamesStartIndex = html.indexOf(classNamesStartMarker);
  const classNamesEndIndex = html.indexOf(classNamesEndMarker);

  if (classNamesStartIndex === -1 || classNamesEndIndex === -1) {
    console.error("Could not find classNames markers in index.html");
    console.error("Add /* CLASSNAMES_START */ and /* CLASSNAMES_END */ markers around the classNames object");
    process.exit(1);
  }

  const beforeClassNames = html.slice(0, classNamesStartIndex + classNamesStartMarker.length);
  const afterClassNames = html.slice(classNamesEndIndex);
  const classNamesObj = generateClassNames(components);

  html = `${beforeClassNames}\n      ${classNamesObj}\n      ${afterClassNames}`;

  await writeFile(INDEX_HTML, html);

  console.log(`Updated index.html with ${components.length} components:`);
  components.forEach((c) => console.log(`  - ${c.title} (${c.className})`));
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
