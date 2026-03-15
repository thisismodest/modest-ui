# modest-ui

A minimal, themeable CSS component library. Write plain HTML and get styled components automatically — or use classes when you need more control.

## Quick Start

Add the stylesheet and put `.mdst-ui` on the body. That's it.

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v0.1.5/dist/modest-ui.min.css" />
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

## Installation

### CDN (recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v0.1.5/dist/modest-ui.min.css" />
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

## Documentation

View the component documentation and examples at [modest-ui.com](https://modest-ui.com/)

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

## License

MIT
