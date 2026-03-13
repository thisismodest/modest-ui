# modest-ui

A minimal, themeable CSS component library. Black and white by default, easy to customise.

## Installation

```bash
npm install github:thisismodest/modest-ui
```

## Usage

### Bundled CSS (recommended)

Use the pre-bundled CSS file that contains all styles:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@v0.1.3/dist/modest-ui.min.css" />
```

Or with a bundler:

```js
import "modest-ui/dist/modest-ui.css";
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

View the component documentation and examples at [thisismodest.github.io/modest-ui](https://thisismodest.github.io/modest-ui/)

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

Use the [Theme Playground](https://thisismodest.github.io/modest-ui/#theme) to experiment with different themes.

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
