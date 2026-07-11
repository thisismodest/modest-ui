#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import siteConfig from "../site.config.js";
import { renderComponentLinks } from "./sidebar.js";

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
      description: pageConfig.description || ""
    });
  }

  // Sort by key order in siteConfig.pages
  const configOrder = Object.keys(siteConfig.pages);
  pages.sort((a, b) => {
    const ai = configOrder.indexOf(a.slug);
    const bi = configOrder.indexOf(b.slug);
    return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
  });

  return pages;
}

// ---------------------------------------------------------------------------
// HTML extraction
// ---------------------------------------------------------------------------

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : "";
}

/**
 * Escape HTML-special characters so author-written strings (e.g. a component
 * description containing "<dialog>") are rendered as text rather than parsed
 * as markup, whether injected into element content or an attribute value.
 */
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function extractHeadStyles(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return "";
  const re = /<style[^>]*>[\s\S]*?<\/style>/gi;
  const styles = Array.from(headMatch[1].matchAll(re), (m) => m[0]);
  return styles.join("\n");
}

function extractScripts(bodyContent, slug, type) {
  const re = /<script[^>]*>[\s\S]*?<\/script>/gi;
  const scripts = Array.from(bodyContent.matchAll(re), (m) => m[0]);

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

  const componentLinks = renderComponentLinks(components, {
    href: (c) => `/${c.slug}/`,
    activeSlug
  });

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
  html = replaceSlot(html, "<!-- HEADER_TITLE -->", slots.headerTitle);
  html = replaceSlot(html, "<!-- LEAD -->", slots.lead || "");
  html = replaceSlot(html, "<!-- OG_IMAGE -->", `${siteConfig.url}/og-image.png`, true);
  html = replaceSlot(html, "<!-- JSONLD -->", slots.jsonLd || "");
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

  // Replace CDN_URL last so it resolves inside injected content (e.g. intro page)
  html = replaceSlot(html, "<!-- CDN_URL -->", siteConfig.cdnUrl, true);

  return html;
}

/**
 * Build a BreadcrumbList JSON-LD <script> block from an ordered list of
 * crumbs. Crumbs without a `url` (e.g. a component group with no page of its
 * own) are emitted as name-only list items.
 */
function breadcrumbJsonLd(crumbs) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => {
      const item = { "@type": "ListItem", position: i + 1, name: crumb.name };
      if (crumb.url) item.item = crumb.url;
      return item;
    })
  };
  return `    <script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// ---------------------------------------------------------------------------
// Page builders
// ---------------------------------------------------------------------------

async function buildComponentPage(template, component, components, pages) {
  const previewHtml = await readFile(join(COMPONENTS_DIR, component.slug, "preview.html"), "utf-8");

  const headStyles = extractHeadStyles(previewHtml);
  const bodyContent = extractBody(previewHtml);
  const { cleanBody, scripts } = extractScripts(bodyContent, component.slug, "component");

  const displayTitle = component.group ? `${component.group} / ${component.title}` : component.title;
  const pageTitle = `${component.title} | ${siteConfig.name}`;
  const canonicalPath = `/${component.slug}/`;
  const canonical = `${siteConfig.url}${canonicalPath}`;
  const description = escapeHtml(component.description);

  // Breadcrumb: Home > Component. The group (e.g. "Input") is intentionally
  // omitted because it has no page of its own, and a URL-less intermediate
  // crumb is invalid per Google's BreadcrumbList guidelines.
  const crumbs = [
    { name: "Home", url: `${siteConfig.url}/` },
    { name: component.title, url: canonical }
  ];

  const html = render(template, {
    title: pageTitle,
    description,
    canonical,
    headerTitle: `          <h1>${displayTitle}</h1>`,
    lead: `          <p class="component-lead">${description}</p>`,
    jsonLd: breadcrumbJsonLd(crumbs),
    className: component.className,
    sidebar: buildSidebar(components, pages, component.slug),
    content: cleanBody,
    headExtra: headStyles ? `    ${headStyles}` : "",
    scripts
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
  const pageTitle = isIntro ? `${siteConfig.name} | ${siteConfig.tagline}` : `${page.title} | ${siteConfig.name}`;
  const canonicalPath = isIntro ? "/" : `/${page.slug}/`;
  const canonical = `${siteConfig.url}${canonicalPath}`;

  // Homepage is the breadcrumb root, so it gets no BreadcrumbList of its own.
  const jsonLd = isIntro
    ? ""
    : breadcrumbJsonLd([
        { name: "Home", url: `${siteConfig.url}/` },
        { name: page.title, url: canonical }
      ]);

  const html = render(template, {
    title: pageTitle,
    description: escapeHtml(page.description),
    canonical,
    headerTitle: `          <span>${page.title}</span>`,
    jsonLd,
    className: null,
    sidebar: buildSidebar(components, pages, page.slug),
    content: cleanBody,
    headExtra: headStyles ? `    ${headStyles}` : "",
    scripts
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
  const assets = ["favicon.svg", "og-image.png", "index.css", "base", "components", "dist", "llms.txt", "examples"];

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

    // Discover example pages
    const examplesDir = join(ROOT, "examples");
    let exampleEntries = [];
    try {
      const exFiles = await readdir(examplesDir, { withFileTypes: true });
      exampleEntries = exFiles
        .filter((f) => f.isFile() && f.name.endsWith(".html"))
        .map((f) => ({ slug: f.name.replace(".html", ""), path: `/examples/${f.name}` }));
    } catch {
      // no examples directory, skip
    }

    // Sitemap
    const allEntries = [
      ...pages.map((p) => ({
        slug: p.slug,
        path: p.slug === "intro" ? "/" : `/${p.slug}/`
      })),
      ...components.map((c) => ({ slug: c.slug, path: `/${c.slug}/` })),
      ...exampleEntries
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
