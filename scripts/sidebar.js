/**
 * Shared sidebar utilities for grouping and rendering component links.
 *
 * Used by build-site.js.
 */

const escapeHtml = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The words the sidebar search matches a link on: its title, slug, class name,
 * group, and keywords (other names people use, such as "modal" for Dialog). Not
 * the description, which names other components too often to narrow anything.
 */
export function searchText(item) {
  const words = [item.title, item.slug?.replace(/-/g, " "), item.className, item.group, ...(item.keywords ?? [])];
  const text = words.filter(Boolean).join(" ").toLowerCase();
  return ` data-search="${escapeHtml(text).replace(/"/g, "&quot;")}"`;
}

/**
 * Group and sort components into a mixed list of ungrouped links and grouped submenus.
 * Components with a `group` property are collected under that group name.
 * Groups and ungrouped items are sorted alphabetically together.
 */
export function buildSidebarItems(components) {
  const ungrouped = components.filter((c) => !c.group);
  const grouped = new Map();

  for (const c of components) {
    if (!c.group) continue;
    if (!grouped.has(c.group)) grouped.set(c.group, []);
    grouped.get(c.group).push(c);
  }

  const items = [];

  for (const c of ungrouped) {
    items.push({ type: "link", component: c, sortKey: c.title.toLowerCase() });
  }

  for (const [groupName, children] of grouped) {
    children.sort((a, b) => a.title.localeCompare(b.title));
    items.push({ type: "group", groupName, children, sortKey: groupName.toLowerCase() });
  }

  items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return items;
}

/**
 * Render sidebar component links as HTML.
 *
 * @param {Array} components - Components with slug, title, className, and optional group.
 * @param {Object} options
 * @param {Function} options.href - Returns the href for a component: (component) => string
 * @param {Function} [options.linkAttrs] - Returns extra attributes for a link: (component) => string
 * @param {string} [options.activeSlug] - Slug of the currently active component.
 * @param {string} [options.indent] - Base indentation string.
 */
export function renderComponentLinks(components, options = {}) {
  const { href, linkAttrs = () => "", activeSlug = null, indent = "            " } = options;

  const items = buildSidebarItems(components);
  const lines = [];

  for (const item of items) {
    if (item.type === "link") {
      const c = item.component;
      const active = c.slug === activeSlug ? " active" : "";
      const extra = linkAttrs(c) + searchText(c);
      lines.push(`${indent}<a href="${href(c)}" class="sidebar-link${active}"${extra}>${escapeHtml(c.title)}</a>`);
    } else {
      // Open by default so the grouped pages are as easy to find as the rest
      lines.push(`${indent}<details class="sidebar-group" open>`);
      lines.push(`${indent}  <summary class="sidebar-group-title">${escapeHtml(item.groupName)}</summary>`);
      for (const c of item.children) {
        const active = c.slug === activeSlug ? " active" : "";
        const extra = linkAttrs(c) + searchText(c);
        lines.push(`${indent}  <a href="${href(c)}" class="sidebar-link sidebar-link--grouped${active}"${extra}>${escapeHtml(c.title)}</a>`);
      }
      lines.push(`${indent}</details>`);
    }
  }

  return lines.join("\n");
}
