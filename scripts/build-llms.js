#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import siteConfig from "../site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "components");
const TOKENS_PATH = join(ROOT, "base", "tokens.css");
const OUTPUT_PATH = join(ROOT, "llms.txt");
const SITE_OUTPUT_PATH = join(ROOT, "site", "llms.txt");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
    const config = await loadComponentConfig(slug);
    if (!config) continue;

    try {
      await readFile(join(COMPONENTS_DIR, slug, "preview.html"));
    } catch {
      continue;
    }

    components.push({ slug, ...config });
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ---------------------------------------------------------------------------
// Tokens parser
// ---------------------------------------------------------------------------

function parseTokens(css) {
  const groups = [];
  let currentGroup = null;

  for (const line of css.split("\n")) {
    const trimmed = line.trim();

    // Section comment like /* Colors */
    const sectionMatch = trimmed.match(/^\/\*\s*(.+?)\s*\*\/$/);
    if (sectionMatch && !trimmed.includes(":")) {
      currentGroup = { name: sectionMatch[1], tokens: [] };
      groups.push(currentGroup);
      continue;
    }

    // Token line like --mdst-color-fg: #000;
    const tokenMatch = trimmed.match(/^(--mdst[\w-]+):\s*(.+?);$/);
    if (tokenMatch && currentGroup) {
      currentGroup.tokens.push({ name: tokenMatch[1], value: tokenMatch[2] });
    }
  }

  return groups;
}

function formatTokens(groups) {
  const lines = [];

  lines.push("## Design Tokens");
  lines.push("");
  lines.push("Override these CSS custom properties on `:root` to theme the entire library.");

  for (const group of groups) {
    lines.push("");
    lines.push(`### ${group.name}`);
    lines.push("");

    // Calculate column widths
    const nameWidth = Math.max(8, ...group.tokens.map((t) => t.name.length));
    const valueWidth = Math.max(8, ...group.tokens.map((t) => t.value.length));

    lines.push(`| ${"Token".padEnd(nameWidth)} | ${"Value".padEnd(valueWidth)} |`);
    lines.push(`| ${"-".repeat(nameWidth)} | ${"-".repeat(valueWidth)} |`);

    for (const token of group.tokens) {
      lines.push(`| ${token.name.padEnd(nameWidth)} | ${token.value.padEnd(valueWidth)} |`);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// CSS class extractor
// ---------------------------------------------------------------------------

function extractClasses(css, slug, className) {
  const classes = new Set();
  // Match .mdst-something including __ BEM sub-elements
  const re = /\.(mdst[\w-]+)/g;
  let m;

  // Wildcard components (className ".mdst-*") like typography and utilities
  // own every class in their CSS file — no prefix filtering needed.
  const isWildcard = className === ".mdst-*";

  while ((m = re.exec(css)) !== null) {
    const cls = m[1];

    if (!isWildcard) {
      // Only include classes that belong to this component. A class belongs to
      // the component if it starts with "mdst-{slug}" (handling multi-word slugs
      // like "otp-input" and "color-picker"). This filters out foreign classes
      // that appear in nested selectors, e.g. `.mdst-table td > .mdst-pre`.
      const prefix = `mdst-${slug}`;
      if (!cls.startsWith(prefix)) continue;
      // Guard against partial prefix matches: after the prefix there should be
      // nothing, or a delimiter (-, _, uppercase via BEM).
      const rest = cls.slice(prefix.length);
      if (rest && !rest.startsWith("-") && !rest.startsWith("_")) continue;
    }

    classes.add(`.${cls}`);
  }
  return [...classes].sort();
}

/**
 * Group classes into base, elements, and modifiers for display.
 *
 * Uses the component's className (from config.js) to determine what counts
 * as the base class. Everything else is either an element (single-dash child
 * or __ sub-element of the base) or a modifier (-- variant).
 *
 *   .mdst-card            → base
 *   .mdst-card-header     → element
 *   .mdst-card__input     → element
 *   .mdst-card--compact   → modifier
 */
function groupClasses(classes, baseClassName) {
  const modifiers = [];
  const elements = [];
  const bases = [];

  // Normalise: ".mdst-card" → "mdst-card", handle ".mdst-*" as null
  const baseRoot = baseClassName && !baseClassName.includes("*") ? baseClassName.replace(/^\./, "") : null;

  for (const cls of classes) {
    const plain = cls.replace(/^\./, "");

    if (plain.includes("--")) {
      modifiers.push(cls);
    } else if (baseRoot && plain !== baseRoot && plain.startsWith(baseRoot)) {
      // It's a child/sub-element of the base (e.g. mdst-card-header, mdst-color-picker__input)
      elements.push(cls);
    } else {
      bases.push(cls);
    }
  }

  return { bases, elements, modifiers };
}

// ---------------------------------------------------------------------------
// Usage block extractor
// ---------------------------------------------------------------------------

function extractUsageBlock(html) {
  // Find the code-section's <pre><code>...</code></pre> and decode HTML entities
  const match = html.match(/<div\s+class="code-section"[\s\S]*?<code>([\s\S]*?)<\/code>/i);
  if (!match) return null;

  return match[1]
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// ---------------------------------------------------------------------------
// Component section builder
// ---------------------------------------------------------------------------

function formatComponent(component, classes, usage) {
  const lines = [];
  const { bases, elements, modifiers } = groupClasses(classes, component.className);

  lines.push(`### ${component.title} \`${component.className}\``);
  lines.push("");

  if (component.description) {
    lines.push(component.description);
    lines.push("");
  }

  lines.push("Classes:");

  for (const cls of bases) {
    lines.push(`- \`${cls}\``);
  }
  for (const cls of elements) {
    lines.push(`- \`${cls}\``);
  }
  for (const cls of modifiers) {
    // Show modifier with dimmed base: .mdst-button--solid
    lines.push(`- \`${cls}\``);
  }

  if (usage) {
    lines.push("");
    lines.push("```html");
    lines.push(usage);
    lines.push("```");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Quick reference builder
// ---------------------------------------------------------------------------

function buildQuickReference(componentData) {
  const lines = [];

  lines.push("## Quick Class Reference");
  lines.push("");

  for (const { component, classes } of componentData) {
    const { bases, elements, modifiers } = groupClasses(classes, component.className);

    const basePart = bases.join("  ");

    // Strip the base class prefix from element names for compact display
    // e.g. .mdst-card-header → -header, .mdst-color-picker__input → __input
    const baseRoot = component.className && !component.className.includes("*") ? component.className.replace(/^\./, "") : null;
    const elementPart = elements.length
      ? "  +  " +
        elements
          .map((e) => {
            if (baseRoot) return e.replace(`.${baseRoot}`, "");
            return e;
          })
          .join("  ")
      : "";

    const modPart = modifiers.length
      ? "  |  " +
        modifiers
          .map((m) => {
            const idx = m.indexOf("--");
            return m.slice(idx);
          })
          .join("  ")
      : "";

    const label = (component.title + ":").padEnd(16);
    lines.push(`${label}${basePart}${elementPart}${modPart}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Theming section
// ---------------------------------------------------------------------------

function buildThemingSection(tokenGroups) {
  const lines = [];

  lines.push("## Theming Example");
  lines.push("");
  lines.push("```css");
  lines.push(":root {");

  // Use the tokens we already parsed to build the example
  for (const group of tokenGroups) {
    for (const token of group.tokens) {
      // Skip aliases (values that reference other vars)
      if (token.value.startsWith("var(")) continue;
      lines.push(`  ${token.name}: ${token.value};`);
    }
  }

  lines.push("}");
  lines.push("```");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  try {
    console.log("Generating llms.txt…\n");

    // 1. Parse tokens
    const tokensCss = await readFile(TOKENS_PATH, "utf-8");
    const tokenGroups = parseTokens(tokensCss);

    // 2. Discover components
    const components = await getComponents();

    // 3. For each component, read CSS + preview.html
    const componentData = [];

    for (const component of components) {
      const cssPath = join(COMPONENTS_DIR, component.slug, `${component.slug}.css`);
      let css = "";
      try {
        css = await readFile(cssPath, "utf-8");
      } catch {
        // Some components might not have a CSS file with matching name
      }

      const classes = extractClasses(css, component.slug, component.className);

      let usage = null;
      try {
        const previewHtml = await readFile(join(COMPONENTS_DIR, component.slug, "preview.html"), "utf-8");
        usage = extractUsageBlock(previewHtml);
      } catch {
        // no preview
      }

      componentData.push({ component, classes, usage });
      console.log(`  ✓ ${component.title} (${classes.length} classes)`);
    }

    // 4. Assemble the document
    const sections = [];

    // Header
    sections.push(`# ${siteConfig.name}

> ${siteConfig.tagline}

- Version: ${siteConfig.version}
- Docs: ${siteConfig.url}
- GitHub: https://github.com/thisismodest/modest-ui
- License: MIT

## Installation

CDN:
  <link rel="stylesheet" href="${siteConfig.cdnUrl}" />

npm:
  npm install github:thisismodest/modest-ui

Import (bundled):
  @import "modest-ui/dist/modest-ui.css";

Cherry-pick:
  @import "modest-ui/base/tokens.css";
  @import "modest-ui/components/button/button.css";

## Naming Convention

All classes use the \`mdst-\` prefix with BEM-style naming:
- Block: \`.mdst-component\`
- Element: \`.mdst-component-element\`
- Modifier: \`.mdst-component--variant\`

## Classless Usage

Add \`.mdst-ui\` to \`<body>\` and bare HTML elements are styled automatically — no classes needed.

\`\`\`html
<body class="mdst-ui">
  <button>Styled button</button>
  <input type="text" placeholder="Styled input" />
  <select><option>Styled select</option></select>
  <details><summary>Styled disclosure</summary><p>Content</p></details>
  <table><tr><th>Styled</th><th>Table</th></tr></table>
</body>
\`\`\`

Classless selectors use \`:where(.mdst-ui)\` so specificity stays at zero — any class-based selector always wins.

Add variant modifiers directly to bare elements without the base class:

\`\`\`html
<button class="mdst-button--ghost">Ghost</button>
<button class="mdst-button--inverted">Inverted</button>
<table class="mdst-table--striped">...</table>
<details class="mdst-details--compact">...</details>
\`\`\`

Elements that map to native tags: button, input (text/email/etc), textarea, select, input[type="checkbox"], input[type="radio"], input[type="range"], input[type="file"], details, dialog, table, code, pre, h1-h6, p, a, strong, em, small, mark, blockquote, hr, ul, ol, li.

Elements that remain class-only (no native tag mapping): card, tag, tooltip, popover, password-input, otp-input, color-picker, utilities.`);

    // Tokens
    sections.push(formatTokens(tokenGroups));

    // Components header
    sections.push("## Components");

    // Each component
    for (const { component, classes, usage } of componentData) {
      sections.push(formatComponent(component, classes, usage));
    }

    // Theming
    sections.push(buildThemingSection(tokenGroups));

    // Quick reference
    sections.push(buildQuickReference(componentData));

    const output = sections.join("\n\n---\n\n") + "\n";

    // 5. Write to root
    await writeFile(OUTPUT_PATH, output);
    console.log(`\n✓ llms.txt written (${(output.length / 1024).toFixed(1)} KB)`);

    // 6. Also write to site/ if it exists
    try {
      await writeFile(SITE_OUTPUT_PATH, output);
      console.log(`✓ site/llms.txt written`);
    } catch {
      // site/ dir may not exist yet, that's fine
    }
  } catch (err) {
    console.error("Error generating llms.txt:", err);
    process.exit(1);
  }
}

main();
