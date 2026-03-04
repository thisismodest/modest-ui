#!/usr/bin/env node

import { readdir, readFile, writeFile, mkdir, cp } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import siteConfig from "../site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "components");
const PAGES_DIR = join(ROOT, "pages");
const SITE_DIR = join(ROOT, "site");
const TEMPLATE_PATH = join(ROOT, "base", "template.html");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

/**
 * Discover all components that have both a preview.html and a config.js.
 */
async function getComponents() {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const config = await loadComponentConfig(slug);
    if (!config) continue;

    // Ensure preview.html exists
    try {
      await readFile(join(COMPONENTS_DIR, slug, "preview.html"));
    } catch {
      continue;
    }

    components.push({ slug, ...config });
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Discover all pages in the pages/ directory.
 */
async function getPages() {
  const entries = await readdir(PAGES_DIR, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const slug = entry.name.replace(".html", "");
    const pageConfig = siteConfig.pages[slug] || {};
    pages.push({
      slug,
      title: pageConfig.title || slug,
      description: pageConfig.description || "",
    });
  }

  return pages;
}

// ---------------------------------------------------------------------------
// HTML extraction
// ---------------------------------------------------------------------------

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : "";
}

function extractHeadStyles(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return "";
  const styles = [];
  const re = /<style[^>]*>[\s\S]*?<\/style>/gi;
  let m;
  while ((m = re.exec(headMatch[1])) !== null) {
    styles.push(m[0]);
  }
  return styles.join("\n");
}

function extractScripts(bodyContent, slug, type) {
  const scripts = [];
  const re = /<script[^>]*>[\s\S]*?<\/script>/gi;
  let m;
  while ((m = re.exec(bodyContent)) !== null) {
    scripts.push(m[0]);
  }

  const cleanBody = bodyContent.replace(re, "").trim();

  // Rewrite relative imports so they work from /slug/index.html
  const rewrittenScripts = scripts.map((script) => {
    if (type === "component") {
      return script.replace(/from\s+["']\.\/([^"']+)["']/g, `from "../components/${slug}/$1"`);
    }
    return script;
  });

  return { cleanBody, scripts: rewrittenScripts };
}

// ---------------------------------------------------------------------------
// Template rendering
// ---------------------------------------------------------------------------

function buildSidebar(components, pages, activeSlug) {
  const pageLinks = pages
    .map((p) => {
      const active = p.slug === activeSlug ? " active" : "";
      const href = p.slug === "intro" ? "/" : `/${p.slug}/`;
      const label = p.slug === "intro" ? "Introduction" : p.title;
      return `            <a href="${href}" class="sidebar-link${active}">${label}</a>`;
    })
    .join("\n");

  const componentLinks = components
    .map((c) => {
      const active = c.slug === activeSlug ? " active" : "";
      return `            <a href="/${c.slug}/" class="sidebar-link${active}">${c.title}</a>`;
    })
    .join("\n");

  return `${pageLinks}\n            <hr class="sidebar-separator" />\n${componentLinks}`;
}

/**
 * Replace a slot marker in the template, matching it regardless of
 * leading whitespace so the template can be freely indented.
 */
function replaceSlot(html, marker, value, all = false) {
  const re = new RegExp(`[ \\t]*${marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, all ? "g" : "");
  return html.replace(re, value);
}

function render(template, slots) {
  let html = template;

  html = replaceSlot(html, "<!-- TITLE -->", slots.title, true);
  html = replaceSlot(html, "<!-- DESCRIPTION -->", slots.description, true);
  html = replaceSlot(html, "<!-- CANONICAL -->", slots.canonical, true);
  html = replaceSlot(html, "<!-- VERSION -->", siteConfig.version, true);
  html = replaceSlot(html, "<!-- DISPLAY_TITLE -->", slots.displayTitle);
  html = replaceSlot(html, "<!-- SIDEBAR -->", slots.sidebar);
  html = replaceSlot(html, "<!-- CONTENT -->", slots.content);

  // Class name badge (optional)
  const classNameHtml = slots.className ? `          <span class="main-header-class">${slots.className}</span>` : "";
  html = replaceSlot(html, "<!-- CLASS_NAME -->", classNameHtml);

  // Extra <style> blocks from the source page's <head>
  html = replaceSlot(html, "<!-- HEAD_EXTRA -->", slots.headExtra || "");

  // Extra <script> blocks from the source page's <body>
  const scriptsHtml = slots.scripts.length ? slots.scripts.map((s) => `    ${s}`).join("\n") : "";
  html = replaceSlot(html, "<!-- SCRIPTS -->", scriptsHtml);

  return html;
}

// ---------------------------------------------------------------------------
// Page builders
// ---------------------------------------------------------------------------

async function buildComponentPage(template, component, components, pages) {
  const previewHtml = await readFile(join(COMPONENTS_DIR, component.slug, "preview.html"), "utf-8");

  const headStyles = extractHeadStyles(previewHtml);
  const bodyContent = extractBody(previewHtml);
  const { cleanBody, scripts } = extractScripts(bodyContent, component.slug, "component");

  const pageTitle = `${component.title} — ${siteConfig.name}`;
  const canonicalPath = `/${component.slug}/`;

  const html = render(template, {
    title: pageTitle,
    description: component.description,
    canonical: `${siteConfig.url}${canonicalPath}`,
    displayTitle: component.title,
    className: component.className,
    sidebar: buildSidebar(components, pages, component.slug),
    content: cleanBody,
    headExtra: headStyles ? `    ${headStyles}` : "",
    scripts,
  });

  const outputDir = join(SITE_DIR, component.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), html);
}

async function buildStaticPage(template, page, components, pages) {
  const pageHtml = await readFile(join(PAGES_DIR, `${page.slug}.html`), "utf-8");

  const headStyles = extractHeadStyles(pageHtml);
  const bodyContent = extractBody(pageHtml);
  const { cleanBody, scripts } = extractScripts(bodyContent, page.slug, "page");

  const isIntro = page.slug === "intro";
  const pageTitle = isIntro ? `${siteConfig.name} — ${siteConfig.tagline}` : `${page.title} — ${siteConfig.name}`;
  const canonicalPath = isIntro ? "/" : `/${page.slug}/`;

  const html = render(template, {
    title: pageTitle,
    description: page.description,
    canonical: `${siteConfig.url}${canonicalPath}`,
    displayTitle: page.title,
    className: null,
    sidebar: buildSidebar(components, pages, page.slug),
    content: cleanBody,
    headExtra: headStyles ? `    ${headStyles}` : "",
    scripts,
  });

  if (isIntro) {
    await writeFile(join(SITE_DIR, "index.html"), html);
  } else {
    const outputDir = join(SITE_DIR, page.slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, "index.html"), html);
  }
}

// ---------------------------------------------------------------------------
// Sitemap & robots
// ---------------------------------------------------------------------------

function generateSitemap(allEntries) {
  const urls = allEntries
    .map((entry) => {
      const priority = entry.slug === "intro" ? "1.0" : "0.8";
      return `  <url>\n    <loc>${siteConfig.url}${entry.path}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function generateRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`;
}

// ---------------------------------------------------------------------------
// Static assets
// ---------------------------------------------------------------------------

async function copyStaticAssets() {
  const assets = ["favicon.svg", "index.css", "base", "components", "dist", "llms.txt"];

  for (const asset of assets) {
    try {
      await cp(join(ROOT, asset), join(SITE_DIR, asset), { recursive: true });
    } catch (err) {
      console.warn(`  Warning: Could not copy ${asset}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  try {
    console.log("Building static site…\n");

    await mkdir(SITE_DIR, { recursive: true });

    const template = await readFile(TEMPLATE_PATH, "utf-8");
    const components = await getComponents();
    const pages = await getPages();

    console.log(`Found ${pages.length} pages and ${components.length} components.\n`);

    // Pages
    for (const page of pages) {
      const dest = page.slug === "intro" ? "/index.html" : `/${page.slug}/index.html`;
      await buildStaticPage(template, page, components, pages);
      console.log(`  ✓ Page: ${page.title} → ${dest}`);
    }

    // Components
    for (const component of components) {
      await buildComponentPage(template, component, components, pages);
      console.log(`  ✓ Component: ${component.title} → /${component.slug}/index.html`);
    }

    // Sitemap
    const allEntries = [
      ...pages.map((p) => ({
        slug: p.slug,
        path: p.slug === "intro" ? "/" : `/${p.slug}/`,
      })),
      ...components.map((c) => ({ slug: c.slug, path: `/${c.slug}/` })),
    ];

    await writeFile(join(SITE_DIR, "sitemap.xml"), generateSitemap(allEntries));
    console.log("\n  ✓ sitemap.xml");

    await writeFile(join(SITE_DIR, "robots.txt"), generateRobotsTxt());
    console.log("  ✓ robots.txt");

    // CNAME
    try {
      const cname = await readFile(join(ROOT, "CNAME"), "utf-8");
      await writeFile(join(SITE_DIR, "CNAME"), cname);
      console.log("  ✓ CNAME");
    } catch {
      // no CNAME, skip
    }

    // Static assets
    console.log("\nCopying static assets…");
    await copyStaticAssets();
    console.log("  ✓ Static assets copied");

    console.log(`\n✓ Site built to ./site/ (${allEntries.length} pages)`);
  } catch (err) {
    console.error("Error building site:", err);
    process.exit(1);
  }
}

main();
