// Component discovery shared by the build scripts.
//
// A component is a folder in components/ with a config.js and a preview.html.
// A config.js that fails to load stops the build instead of silently dropping
// the component from the site and llms.txt.

import { access, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..");
export const COMPONENTS_DIR = join(ROOT, "components");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function getComponents() {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const configPath = join(COMPONENTS_DIR, slug, "config.js");
    const previewPath = join(COMPONENTS_DIR, slug, "preview.html");

    if (!(await exists(configPath)) || !(await exists(previewPath))) continue;

    let config;
    try {
      config = (await import(pathToFileURL(configPath).href)).default;
    } catch (err) {
      throw new Error(`components/${slug}/config.js failed to load: ${err.message}`);
    }
    if (!config || !config.title) {
      throw new Error(`components/${slug}/config.js must export a default object with a title`);
    }

    components.push({ slug, ...config });
  }

  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}
