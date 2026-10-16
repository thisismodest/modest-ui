#!/usr/bin/env node

// Generates llms.txt: a single-file reference an AI model (or a person) can
// read to write correct modest-ui markup. Tokens come from base/tokens.css,
// classes from each component's CSS, and examples from each preview.html.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import siteConfig from "../site.config.js";
import { COMPONENTS_DIR, ROOT, getComponents } from "./components.js";

const TOKENS_PATH = join(ROOT, "base", "tokens.css");
const OUTPUT_PATH = join(ROOT, "llms.txt");
const MAJOR = siteConfig.version.split(".")[0];

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

/**
 * Read the tokens declared in the main :root block of tokens.css, grouped by
 * the comment above them. The dark-mode and reduced-motion blocks that follow
 * are described in the header instead of listed here.
 */
function parseTokens(css) {
  const start = css.indexOf(":root {");
  const body = css.slice(start + ":root {".length, css.indexOf("\n  }", start));
  const groups = [];
  let current = null;
  let inComment = false;

  for (const raw of body.split("\n")) {
    const line = raw.trim();

    if (inComment) {
      if (line.includes("*/")) inComment = false;
      continue;
    }

    if (line.startsWith("/*")) {
      // Group name: the comment's first words, up to a colon or full stop
      const text = line.replace(/^\/\*\s*/, "").replace(/\s*\*\/$/, "");
      if (!text.startsWith("--")) {
        current = { name: text.split(/[:.—]/)[0].trim(), tokens: [] };
        groups.push(current);
      }
      if (!line.includes("*/")) inComment = true;
      continue;
    }

    const token = line.match(/^(--mdst[\w-]+):\s*(.+?);$/);
    if (token && current) current.tokens.push({ name: token[1], value: token[2] });
  }

  return groups.filter((group) => group.tokens.length);
}

function formatTokens(groups) {
  const lines = ["## Design Tokens", "", "Override these custom properties on `:root` (or any element) to theme modest-ui."];

  for (const group of groups) {
    const nameWidth = Math.max(5, ...group.tokens.map((t) => t.name.length));
    const valueWidth = Math.max(5, ...group.tokens.map((t) => t.value.length));
    lines.push("", `### ${group.name}`, "");
    lines.push(`| ${"Token".padEnd(nameWidth)} | ${"Value".padEnd(valueWidth)} |`);
    lines.push(`| ${"-".repeat(nameWidth)} | ${"-".repeat(valueWidth)} |`);
    for (const t of group.tokens) lines.push(`| ${t.name.padEnd(nameWidth)} | ${t.value.padEnd(valueWidth)} |`);
  }

  lines.push(
    "",
    "### Optional tokens",
    "",
    "Not set by default; set them to change behaviour everywhere.",
    "",
    "| Token | Effect |",
    "| --- | --- |",
    "| `--mdst-focus-ring` | Replaces the keyboard focus ring, e.g. `3px dashed hotpink`, or `none` |",
    "| `--mdst-color-info` | Colour for `--info` variants (defaults to the text colour) |",
    "| `--mdst-button-hover-shadow` | Button hover (default: an inset ring in the text colour), or `none` |",
    "",
    "### Button variables",
    "",
    "Set on a button, a class, or a container to make your own variant:",
    "",
    "| Variable | Default |",
    "| --- | --- |",
    "| `--mdst-button-tone` | `--mdst-color-fg` (text, and the fill of solid buttons) |",
    "| `--mdst-button-bg` | `--mdst-color-bg` |",
    "| `--mdst-button-fg` | the tone |",
    "| `--mdst-button-border` | `--mdst-color-border` |"
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

/**
 * Every class a component's CSS defines, except ones that belong to another
 * component (e.g. .mdst-code referenced inside pre.css). Ownership goes to the
 * longest matching component slug, so .mdst-otp-input belongs to otp-input,
 * not input. Classes with no matching slug (.mdst-toggle in checkbox.css,
 * .mdst-fieldset in form.css) belong to the file that defines them.
 */
function extractClasses(css, slug, allSlugs) {
  const owner = (cls) => {
    const matches = allSlugs.filter((s) => cls === `mdst-${s}` || cls.startsWith(`mdst-${s}-`) || cls.startsWith(`mdst-${s}_`));
    return matches.sort((a, b) => b.length - a.length)[0];
  };
  const classes = new Set();
  for (const [, cls] of css.matchAll(/\.(mdst-[\w-]+)/g)) {
    if (cls === "mdst-ui") continue;
    const own = owner(cls);
    if (own && own !== slug) continue;
    classes.add(`.${cls}`);
  }
  return [...classes].sort();
}

function groupClasses(classes) {
  const elements = classes.filter((c) => c.includes("__") && !c.includes("--"));
  const modifiers = classes.filter((c) => c.includes("--"));
  const blocks = classes.filter((c) => !elements.includes(c) && !modifiers.includes(c));
  return { blocks, elements, modifiers };
}

function extractUsage(html) {
  const match = html.match(/<div\s+class="code-section"[\s\S]*?<code>([\s\S]*?)<\/code>/i);
  if (!match) return null;
  return match[1]
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function formatComponent(component, classes, usage) {
  const { blocks, elements, modifiers } = groupClasses(classes);
  const lines = [`### ${component.title} \`${component.className}\``, ""];
  if (component.description) lines.push(component.description, "");
  lines.push("Classes:");
  for (const cls of [...blocks, ...elements, ...modifiers]) lines.push(`- \`${cls}\``);
  if (usage) lines.push("", "```html", usage, "```");
  return lines.join("\n");
}

function formatQuickReference(data) {
  const lines = ["## Quick Class Reference", ""];
  for (const { component, classes } of data) {
    const { blocks, elements, modifiers } = groupClasses(classes);
    const parts = [blocks.join("  ")];
    if (elements.length) parts.push("+ " + elements.map((e) => e.slice(e.indexOf("__"))).join("  "));
    if (modifiers.length) parts.push("| " + modifiers.map((m) => m.slice(m.indexOf("--"))).join("  "));
    lines.push(`${(component.title + ":").padEnd(16)}${parts.join("  ")}`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function header() {
  return `# ${siteConfig.name}

> ${siteConfig.tagline}

IMPORTANT: The npm package is "mdst-ui", NOT "modest-ui". The name "modest-ui"
on npm is an UNRELATED Vue library — do not install it. This package is named
"mdst-ui" to match its class/token prefix (.mdst-ui, --mdst-*). Whenever a
human says "modest-ui", the package to install is "mdst-ui".

- Version: ${siteConfig.version} (this file describes v${MAJOR}; class names differ from v1)
- Package (npm): mdst-ui
- Docs: ${siteConfig.url}
- GitHub: https://github.com/thisismodest/modest-ui
- License: MIT

## Installation

CDN (pin the major version so markup and CSS match):
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdst-ui@${MAJOR}/dist/modest-ui.min.css" />

npm:
  npm install mdst-ui   # NOT "npm install modest-ui"

Import (bundled):
  @import "mdst-ui/dist/modest-ui.css";

Cherry-pick (tokens first):
  @import "mdst-ui/base/tokens.css";
  @import "mdst-ui/components/button/button.css";

modest-ui is CSS only. JavaScript shown in the docs is example code for
behaviour you own (switching tabs, showing a toast, revealing a password).

## Rules for writing modest-ui markup

1. Put \`class="mdst-ui"\` on \`<body>\` (or a wrapper) and write semantic HTML.
   Bare elements inside it are styled with no classes.
2. Add a modifier class only for a variant: \`<button class="mdst-button--solid">\`.
   Modifiers work on bare elements without the base class.
3. Use the base class (\`.mdst-button\`, \`.mdst-input\`) outside \`.mdst-ui\`, or for
   components that have no native element (card, tag, tabs, toast…).
4. Drive runtime state with data attributes (\`data-state="active"\`, \`"visible"\`,
   \`"completed"\`), and ARIA where it exists (\`aria-pressed\`, \`aria-invalid\`,
   \`aria-selected\`, \`aria-disabled\`). Never use data attributes for colour or size.
5. Theme with \`--mdst-*\` tokens. Don't restyle components to change colours.
6. Put your own layout CSS outside any cascade layer; it always wins.

## Naming

BEM with the \`mdst-\` prefix:
- Block: \`.mdst-card\`
- Element: \`.mdst-card__header\`, \`.mdst-tabs__panel\`
- Modifier: \`.mdst-card--sm\`, \`.mdst-card__header--borderless\`

Shared modifier vocabulary:
- Status: \`--success\`, \`--info\`, \`--warning\`, \`--danger\` (and \`--muted\`)
- Fill and edge: \`--solid\`, \`--subtle\`, \`--borderless\`
- Size: \`--sm\`, \`--lg\`
- Direction: \`--start\`, \`--end\` (never left/right)

## Classless elements

Styled automatically inside \`.mdst-ui\`: button, input (text, email, etc.),
textarea, select, input[type="checkbox"], input[type="radio"],
input[type="range"], input[type="file"], form, fieldset, legend, label,
details, dialog, table, progress, meter, code, pre, h1–h6, p, a, strong, em,
small, mark, kbd, abbr[title], del, ins, s, cite, samp, var, sub, sup,
blockquote, hr, ul, ol, li.

Class-only components: avatar, badge, banner, breadcrumbs, card, color-picker,
drawer, otp-input, password-input, popover, skeleton, spinner, stepper, tabs,
tag, toast, toggle (.mdst-toggle), toolbar, tooltip, utilities.

## Behaviour to know

- Cascade layer: everything is in \`@layer mdst-ui\`. Any CSS outside a layer
  beats it. To order against other layers: \`@layer reset, mdst-ui, utilities;\`
- Flow spacing: children of plain containers inside \`.mdst-ui\` (the root and
  unclassed main, section, article, div, form, fieldset, …) are spaced by
  \`--mdst-flow-space\`. Give a container a class to lay it out yourself.
- Dark mode is opt-in: \`:root { color-scheme: light dark; }\` follows the
  system, \`color-scheme: dark\` forces it. Without it pages stay light.
- Focus: one keyboard ring for everything (\`--mdst-focus-ring\`,
  \`--mdst-focus-offset\`).
- Right-to-left: components use logical properties and mirror in \`dir="rtl"\`.
- The reset only applies inside \`.mdst-ui\`.`;
}

function theming() {
  return `## Theming Example

\`\`\`css
:root {
  --mdst-color-fg: #1a1a1a;
  --mdst-color-bg: #ffffff;
  --mdst-color-border: #e5e5e5;
  --mdst-color-focus: #2563eb;
  --mdst-radius: 6px;
  --mdst-font-text: Charter, Georgia, serif;
}
\`\`\`

Setting colour tokens yourself replaces both the light and dark values. To keep
dark mode, set them inside \`@media (prefers-color-scheme: dark)\` too, or use
\`light-dark()\`:

\`\`\`css
:root {
  color-scheme: light dark;
  --mdst-color-fg: light-dark(#1a1a1a, #f5f5f5);
  --mdst-color-bg: light-dark(#ffffff, #111111);
}
\`\`\``;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Generating llms.txt…\n");

  const tokenGroups = parseTokens(await readFile(TOKENS_PATH, "utf-8"));
  const components = await getComponents();
  const slugs = components.map((c) => c.slug);
  const data = [];

  for (const component of components) {
    const css = await readFile(join(COMPONENTS_DIR, component.slug, `${component.slug}.css`), "utf-8");
    const preview = await readFile(join(COMPONENTS_DIR, component.slug, "preview.html"), "utf-8");
    const classes = extractClasses(css, component.slug, slugs);
    data.push({ component, classes, usage: extractUsage(preview) });
    console.log(`  ✓ ${component.title} (${classes.length} classes)`);
  }

  const sections = [
    header(),
    formatTokens(tokenGroups),
    "## Components",
    ...data.map(({ component, classes, usage }) => formatComponent(component, classes, usage)),
    theming(),
    formatQuickReference(data)
  ];

  const output = sections.join("\n\n---\n\n") + "\n";
  await writeFile(OUTPUT_PATH, output);
  console.log(`\n✓ llms.txt written (${(output.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("Error generating llms.txt:", err.message);
  process.exit(1);
});
