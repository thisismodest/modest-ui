# modest-ui

A minimal, themeable CSS component library. Black and white by default. Write plain HTML, get styled and interactive components.

modest-ui built on the idea that the web can now do more than we give it credit for. Heavy UI libraries solved real problems, but we forget how much browsers had quietly caught up.
HTML and CSS natively gives us a lot (accessibility, device-native interactions, better performance). Build with the grain of the web and a lot comes for free.

Use it when you don’t need the overhead. Reach for something else when you do.
modest-ui styles native HTML elements automatically. Add one class to `<body>`, and buttons, inputs, tables, and details elements are styled instantly (no classes needed). When you need variants, add a modifier class. When you want a theme, override a few CSS custom properties.

---

## Who this is for

- **Developers who want styled HTML** without learning a new class vocabulary
- **Teams building internal tools, admin panels, or prototypes** who need "good enough" defaults fast
- **Anyone who wants a CSS baseline** that doesn't fight their own styles
- **Developers who value semantic HTML and accessibility** — modest-ui uses native elements like `<dialog>`, `<details>`, and `<progress>`
- **Projects that don't want or need JavaScript** for UI components

## Who this is NOT for

- **If you need a full design system** with comprehensive layout utilities, you'll want Tailwind or similar
- **If you need complex interactive components** with built-in JavaScript (carousels, rich data tables, etc.), consider a framework-specific library
- **If you need pixel-perfect design specification adherence** — modest-ui's minimalism may feel too sparse
- **If you need IE11 support** — modest-ui uses modern CSS features (nesting, `:where()`, `color-mix()`)

---

## Quick Start

Add the stylesheet and put `.mdst-ui` on the body. That's it.

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v0.2.0/dist/modest-ui.min.css" />
  </head>
  <body class="mdst-ui">
    <h1>Hello world</h1>
    <p>This paragraph is styled automatically.</p>
    <button>Click me</button>
    <input type="text" placeholder="Type here" />
  </body>
</html>
```

Every native element — buttons, inputs, tables, details, typography — is styled out of the box. No classes needed.

## Add classes when you need variants

The classless defaults cover the base appearance. When you need a variant, add a modifier class. It overrides the default automatically.

```html
<!-- Classless — just works -->
<button>Save</button>
<table>
  ...
</table>
<details>...</details>

<!-- With variants — opt-in -->
<button class="mdst-button--ghost">Cancel</button>
<button class="mdst-button--inverted">Delete</button>
<table class="mdst-table--striped">
  ...
</table>
<details class="mdst-details--compact">...</details>
```

You can also use the full class-based API directly — `.mdst-button`, `.mdst-input`, `.mdst-table` — all the explicit classes still work exactly as before. Classes always win over the classless defaults, so there's never a specificity conflict.

## How it works

**Classless layer** — Bare elements inside `.mdst-ui` are styled using `:where()`, which keeps specificity at zero. Every native `<button>`, `<input>`, `<table>`, etc. gets a styled baseline for free.

**Class layer** — Component classes like `.mdst-button` and `.mdst-input` have normal specificity, so they always override the classless defaults when applied.

**Variant classes** — Modifiers like `.mdst-button--ghost` work directly on bare elements inside `.mdst-ui`. No need to pair them with the base class.

### Scoped and safe

Unlike classless frameworks that style every element on the page globally, modest-ui is scoped to `.mdst-ui`. Third-party widgets, embedded content, and anything outside the scope are unaffected.

---

## Installation

### CDN (recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v0.2.0/dist/modest-ui.min.css" />
```

### npm

```bash
npm install github:thisismodest/modest-ui
```

Then import in CSS:

```css
@import "modest-ui/dist/modest-ui.css";
```

### Cherry-pick components

```css
/* Always include tokens first */
@import "modest-ui/base/tokens.css";

/* Then pick what you need */
@import "modest-ui/components/button/button.css";
@import "modest-ui/components/input/input.css";
```

---

## Documentation

View the component documentation and examples at [modest-ui.com](https://modest-ui.com/)

---

## Theming

Override CSS custom properties to create your own theme:

```css
:root {
  --mdst-color-fg: #000;
  --mdst-color-bg: #fff;
  --mdst-color-border: #000;
  --mdst-color-muted: #666;
  --mdst-color-subtle: #f5f5f5;
  --mdst-color-focus: #000;
  --mdst-color-error: #dc2626;
  --mdst-color-success: #16a34a;
  --mdst-radius: 0;
  --mdst-border-width: 0.0625em;
}
```

Use the [Theme Playground](https://modest-ui.com/theme/) to experiment with different themes.

---

## Data Attribute Components

Some components need state changes — tabs that switch, steps that advance, toasts that appear. Instead of shipping JavaScript, modest-ui styles every possible state via data attributes. You bring whatever JS you want — a framework, vanilla event listeners, or Alpine.js — and toggle `data-state`, `data-variant`, etc. We handle the CSS, you handle the behavior.

```html
<!-- Toggle a tab -->
<button class="mdst-tab" data-state="active">Tab 1</button>
<div class="mdst-tabs-panel" data-state="active">...</div>

<!-- Show a toast -->
<output class="mdst-toast" data-state="visible" data-variant="success">Saved.</output>

<!-- Advance a stepper -->
<div class="mdst-stepper-step" data-state="completed">...</div>
```

This keeps modest-ui dependency-free while letting you use whatever interaction model fits your project.

---

## Development

Start a local server to preview components:

```bash
npm run dev
```

Then open [http://localhost:8000](http://localhost:8000)

### Adding a new component

1. Create a folder in `components/` with your component CSS and a `preview.html`:

```
components/
└── my-component/
    ├── my-component.css
    └── preview.html
```

2. Add the import to `index.css`:

```css
@import "./components/my-component/my-component.css";
```

3. Generate and build:

```bash
npm run generate  # Updates sidebar in index.html
npm run build     # Bundles CSS to dist/
```

See [CONVENTIONS.md](CONVENTIONS.md) for component and preview formatting guidelines.

### Releasing a new version

The version in `package.json` is the single source of truth. Running `npm run build` propagates it everywhere — the site, this README, CDN links, and `llms.txt`.

1. Bump the version in `package.json`:

```bash
npm version patch  # or minor / major
```

2. Rebuild everything:

```bash
npm run build
```

3. Commit and push:

```bash
git add -A
git commit -m "release vX.Y.Z"
git push origin main
```

4. Tag the release:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

The tag is what jsDelivr resolves against, so this step is required for the CDN to serve the new version.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on getting started, adding components, and submitting pull requests.

## License

MIT
