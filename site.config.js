import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"));

const version = pkg.version;

export default {
  url: "https://modest-ui.com",
  version,
  cdnUrl: `https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v${version}/dist/modest-ui.min.css`,
  name: "modest-ui",
  tagline: "A minimal, themeable CSS component library.",

  pages: {
    intro: {
      title: "Introduction",
      description: "A minimal, themeable CSS component library. Black and white by default, easy to customise.",
    },
    examples: {
      title: "Examples",
      description: "Standalone pages built entirely with modest-ui components — landing pages, dashboards, blogs, and more.",
    },
    theme: {
      title: "Theme Playground",
      description: "Interactive theme playground to customise design tokens and generate CSS variables.",
    },
  },
};
