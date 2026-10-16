import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"));

const version = pkg.version;

export default {
  url: "https://modest-ui.com",
  version,
  // Pinned to the major version, so copied markup gets 2.x fixes but never a
  // breaking change
  cdnUrl: `https://cdn.jsdelivr.net/npm/mdst-ui@${version.split(".")[0]}/dist/modest-ui.min.css`,
  name: "modest-ui",
  tagline: "A minimal, themeable CSS component library.",

  pages: {
    intro: {
      title: "Introduction",
      description:
        "A minimal, themeable CSS component library. Plain HTML gets styled, accessible components, with opt-in dark mode and no JavaScript. Theme it with CSS variables."
    },
    examples: {
      title: "Examples",
      description: "Standalone pages built entirely with modest-ui components: landing pages, dashboards, blogs, and more."
    },
    theme: {
      title: "Theme Playground",
      description: "Interactive theme playground to customise design tokens and generate CSS variables."
    }
  }
};
