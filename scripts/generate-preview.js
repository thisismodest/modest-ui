#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import siteConfig from "../site.config.js";
import { buildSidebarItems, renderComponentLinks } from "./sidebar.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "components");
const INDEX_HTML = join(ROOT, "index.html");
const README_PATH = join(ROOT, "README.md");

/**
 * Load a component's config.js, returning null if it doesn't exist.
 */
async function loadComponentConfig(slug) {
  try {
    const configPath = join(COMPONENTS_DIR, slug, "config.js");
    const config = await import(configPath);
    return config.default;
  } catch {
    return null;
  }
}

async function getComponents() {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;

    // Check if preview.html exists
    try {
      await readFile(join(COMPONENTS_DIR, slug, "preview.html"));
    } catch {
      continue;
    }

    // Load config (title, className, group) from config.js
    const config = await loadComponentConfig(slug);
    if (!config) {
      console.warn(`  Warning: ${slug} has preview.html but no config.js — skipping`);
      continue;
    }

    components.push({
      slug,
      title: config.title,
      className: config.className,
      group: config.group || null,
    });
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

function generateLinks(components) {
  return renderComponentLinks(components, {
    href: (c) => `#${c.slug}`,
    linkAttrs: (c) => ` data-component="${c.slug}"`,
  });
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

  // Stamp version between markers
  const versionStartMarker = "<!-- VERSION_START -->";
  const versionEndMarker = "<!-- VERSION_END -->";
  const versionStartIndex = html.indexOf(versionStartMarker);
  const versionEndIndex = html.indexOf(versionEndMarker);

  if (versionStartIndex !== -1 && versionEndIndex !== -1) {
    const beforeVersion = html.slice(0, versionStartIndex + versionStartMarker.length);
    const afterVersion = html.slice(versionEndIndex);
    html = `${beforeVersion}v${siteConfig.version}${afterVersion}`;
  }

  await writeFile(INDEX_HTML, html);

  // Log output — show groups
  const items = buildSidebarItems(components);
  const totalCount = components.length;
  const groupCount = items.filter((i) => i.type === "group").length;
  console.log(`Updated index.html with ${totalCount} components${groupCount ? ` (${groupCount} group${groupCount > 1 ? "s" : ""})` : ""}:`);
  for (const item of items) {
    if (item.type === "link") {
      console.log(`  - ${item.component.title} (${item.component.className})`);
    } else {
      console.log(`  ▸ ${item.groupName}`);
      for (const c of item.children) {
        console.log(`    - ${c.title} (${c.className})`);
      }
    }
  }
}

async function updateReadmeCdnUrl() {
  let readme = await readFile(README_PATH, "utf-8");
  readme = readme.replace(/modest-ui@v[^/]+/g, `modest-ui@v${siteConfig.version}`);
  await writeFile(README_PATH, readme);
}

async function main() {
  try {
    const components = await getComponents();

    if (components.length === 0) {
      console.warn("No components found with preview.html and config.js");
      return;
    }

    await updateIndexHtml(components);
    await updateReadmeCdnUrl();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
