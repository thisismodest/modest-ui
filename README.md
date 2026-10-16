# modest-ui

A minimal, themeable CSS component library. Black and white by default.

> **The npm package is [`mdst-ui`](https://www.npmjs.com/package/mdst-ui), not `modest-ui`.**
> The name `modest-ui` on npm is an **unrelated Vue library** — do not install it.
> This package is named `mdst-ui` to match its class/token prefix (`.mdst-ui`, `--mdst-*`),
> so the package name and the CSS you write line up. The project, docs, and repo are named **modest-ui**.
>
> ```sh
> npm install mdst-ui
> ```

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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdst-ui@2/dist/modest-ui.min.css" />
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
<button class="mdst-button--borderless">Cancel</button>
<button class="mdst-button--solid">Delete</button>
<table class="mdst-table--striped">
  ...
</table>
<details class="mdst-details--sm">...</details>
```

You can also use the full class-based API directly — `.mdst-button`, `.mdst-input`, `.mdst-table` — all the explicit classes still work exactly as before. Classes always win over the classless defaults, so there's never a specificity conflict.

## How it works

**Classless layer** — Bare elements inside `.mdst-ui` are styled using `:where()`, which keeps specificity at zero. Every native `<button>`, `<input>`, `<table>`, etc. gets a styled baseline for free.

**Class layer** — Component classes like `.mdst-button` and `.mdst-input` have normal specificity, so they always override the classless defaults when applied.

**Variant classes** — Modifiers like `.mdst-button--borderless` work directly on bare elements inside `.mdst-ui`. No need to pair them with the base class.

### Scoped and safe

Unlike classless frameworks that style every element on the page globally, modest-ui is scoped to `.mdst-ui`. Third-party widgets, embedded content, and anything outside the scope are unaffected.

### Your CSS always wins

All of modest-ui lives in a [cascade layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) called `mdst-ui`. Any CSS you write outside a layer beats it, whatever the selector or load order, so a single class is enough to restyle anything:

```css
.my-button { border-radius: 999px; } /* wins over .mdst-button and its variants */
```

If you use layers yourself (Tailwind v4 does), set where modest-ui sits with one line:

```css
@layer reset, mdst-ui, utilities;
```

Every file layers itself, so this works the same for the bundle, `index.css`, or individual component files.

One thing to know: blanket element resets in your own CSS also win. A rule like `button { color: inherit; background: transparent }` (Tailwind's preflight has one) will override modest-ui's button colours. Put resets like that in a layer before `mdst-ui`:

```html
<!-- Declare the order before modest-ui loads: the first declaration wins -->
<style>
  @layer reset, mdst-ui;
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdst-ui@2/dist/modest-ui.min.css" />
<style>
  @layer reset {
    /* your reset */
  }
</style>
```

The modest-ui docs site and examples do exactly this.

---

## Installation

### CDN (recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mdst-ui@2/dist/modest-ui.min.css" />
```

`@2` gets the latest 2.x release. v2 renamed classes, so projects on v1 should stay on `@1` until they migrate (see [CHANGELOG.md](CHANGELOG.md)).

### npm

```bash
npm install mdst-ui
```

Then import in CSS:

```css
@import "mdst-ui/dist/modest-ui.css";
```

### Cherry-pick components

Each file puts itself in the `mdst-ui` layer, so no `layer()` syntax is needed.

```css
/* Always include tokens first */
@import "mdst-ui/base/tokens.css";

/* Then pick what you need */
@import "mdst-ui/components/button/button.css";
@import "mdst-ui/components/input/input.css";
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
  --mdst-color-danger: #dc2626;
  --mdst-color-success: #15803d;
  --mdst-radius: 0;
  --mdst-border-width: 0.0625em;
}
```

Use the [Theme Playground](https://modest-ui.com/theme/) to experiment with different themes.

### Dark mode

Dark mode is opt-in, so a site never changes colour on a visitor's machine
unless you ask it to. It uses the standard `color-scheme` property:

```css
:root { color-scheme: light dark; } /* follow the visitor's system */
:root { color-scheme: dark; }       /* always dark */
```

Leave it out and pages stay light everywhere. If you set the colour tokens
yourself, your values are used in both modes.

### Spacing

Inside `.mdst-ui`, the children of plain containers (the root, and unclassed
`main`, `section`, `article`, `div`, `form`, and so on) are spaced by one token.
It's in `em`, so headings get more room than paragraphs. Give a container a
class (for example to lay it out with grid) and its spacing is yours. Any
margin you set wins.

```css
:root {
  --mdst-flow-space: 1em; /* default; 0 turns it off */
}
```

### Font roles

Typography flows through three semantic tokens: `--mdst-font-text` (the
reading face — prose, tables, lists inherit it from the `.mdst-ui`
container), `--mdst-font-ui` (the interface face — buttons, inputs, badges),
and `--mdst-font-mono` (code). Both text and ui default to the
`--mdst-font-sans` stack.

Retheme prose without touching components — serif blog, sans buttons,
one token:

```css
:root {
  --mdst-font-text: Charter, Georgia, serif;
}
```

---

## Data Attribute Components

Some components need state changes — tabs that switch, steps that advance, toasts that appear. Instead of shipping JavaScript, modest-ui styles every possible state via data attributes. You bring whatever JS you want — a framework, vanilla event listeners, or Alpine.js — and toggle `data-state`. We handle the CSS, you handle the behavior.

```html
<!-- Toggle a tab -->
<button class="mdst-tabs__tab" data-state="active">Tab 1</button>
<div class="mdst-tabs__panel" data-state="active">...</div>

<!-- Show a toast -->
<output class="mdst-toast mdst-toast--success" data-state="visible">Saved.</output>

<!-- Advance a stepper -->
<div class="mdst-stepper__step" data-state="completed">...</div>
```

This keeps modest-ui dependency-free while letting you use whatever interaction model fits your project.

---

## Development

Build everything and start a local server:

```bash
npm run dev
```

Then open [http://localhost:8000](http://localhost:8000). `npm run build` alone regenerates `dist/`, `llms.txt`, and the site.

### Adding a new component

1. Create a folder in `components/` with the CSS, a `config.js`, and a `preview.html`:

```
components/
└── my-component/
    ├── my-component.css   # wrapped in @layer mdst-ui.components { … }
    ├── config.js          # title, className, description (required)
    └── preview.html       # the docs page body
```

2. Add the import to `index.css`:

```css
@import "./components/my-component/my-component.css";
```

3. Build:

```bash
npm run build
```

The sidebar, docs page, and `llms.txt` entry are generated from the folder. See [CONVENTIONS.md](CONVENTIONS.md) for the rules components follow.

### Releasing a new version

The version in `package.json` is the single source of truth. `npm run build` carries it into the site and `llms.txt`. `dist/` and `llms.txt` are committed, and CI fails a PR if they're out of date.

1. Move the `[Unreleased]` notes in `CHANGELOG.md` under the new version, then bump the version in `package.json`:

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

Pushing a `v*` tag does two things automatically:

- **jsDelivr** resolves the tag for the `/gh/` CDN path.
- The **Publish to npm** workflow (`.github/workflows/publish.yml`) builds the
  bundle and runs `npm publish`, releasing the new version as `mdst-ui`. It
  authenticates via npm **Trusted Publishing** (OIDC), so no token is stored in
  the repo, and provenance is generated automatically. The GitHub repo/workflow
  must be registered as a Trusted Publisher on the npm package settings page.

The `/npm/` CDN path (`cdn.jsdelivr.net/npm/mdst-ui@X.Y.Z/...`) becomes
available a few moments after the publish job finishes.

## Browser Support

modest-ui targets current evergreen browsers. The minimums come from CSS nesting, `:has()`, and cascade layers:

| Browser | Minimum |
| --- | --- |
| Chrome, Edge | 120 |
| Firefox | 121 |
| Safari (macOS and iOS) | 17.2 |

Some features degrade gracefully on browsers older than their own support:

- **Dark mode** uses `light-dark()`. Without it, pages stay light.
- **`tooltip`** and **`popover --anchored`** use CSS anchor positioning (Chrome 129, Firefox 147, Safari 26). Without it they fall back to a centred popover.
- **`details`** content padding uses `::details-content` (Chrome 131, Firefox 143, Safari 18.4). Without it the disclosure still works, without the padding and divider.
- **`drawer`**, **`banner`**, and **`toast`** enter and leave with `@starting-style`. Without it they appear without animating.
- **Invalid fields** use `:user-invalid` alongside `aria-invalid`. Without it, only `aria-invalid` shows the error state.

There is no IE11 support.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on getting started, adding components, and submitting pull requests.

## License

MIT
