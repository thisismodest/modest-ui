# modest-components

A minimal, themeable CSS component library. Black and white by default, easy to customise.

## Installation

### From local path

```bash
npm install ../path/to/modest-components
```

### From GitHub

```bash
npm install github:thisismodest/modest-components
```

## Usage

### Use the bundled CSS (recommended)

For the simplest setup, use the pre-bundled CSS file that contains all styles in a single file:

```html
<link rel="stylesheet" href="node_modules/modest-components/dist/modest-components.css" />
```

Or via CDN (if published):

```html
<link rel="stylesheet" href="https://unpkg.com/modest-components/dist/modest-components.css" />
```

### Import everything (with build tool)

If you're using a build tool that supports CSS imports:

```css
@import "modest-components/index.css";
```

Or in JS (with a bundler):

```js
import "modest-components/index.css";
```

Or via HTML:

```html
<link rel="stylesheet" href="node_modules/modest-components/index.css" />
```

### Cherry-pick components

```css
/* Always include tokens first */
@import "modest-components/base/tokens.css";

/* Then pick what you need */
@import "modest-components/components/button/button.css";
@import "modest-components/components/otp-input/otp-input.css";
```

## Structure

```
modest-components/
├── index.css                          # All styles with @import statements
├── dist/
│   └── modest-components.css          # Bundled single-file CSS (no imports)
├── base/
│   ├── tokens.css                     # CSS custom properties (--mdst-*)
│   └── reset.css                      # Minimal reset
└── components/
    ├── button/
    │   └── button.css
    ├── input/
    │   └── input.css
    ├── otp-input/
    │   ├── otp-input.css
    │   └── otp-input.js               # Optional interactivity
    ├── code/
    │   └── code.css
    └── pre/
        └── pre.css
```

## Components

### Button

```html
<button class="mdst-button">Default</button>
<button class="mdst-button mdst-button--solid">Solid</button>
<button class="mdst-button mdst-button--ghost">Ghost</button>
<button class="mdst-button mdst-button--sm">Small</button>
<button class="mdst-button mdst-button--lg">Large</button>
```

### Input

```html
<input type="text" class="mdst-input" placeholder="Enter text" /> <textarea class="mdst-input" placeholder="Write something..."></textarea>
```

### OTP Input

```html
<div class="mdst-otp">
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
</div>
```

With separator:

```html
<div class="mdst-otp">
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <span class="mdst-otp-separator"></span>
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
  <input type="text" maxlength="1" class="mdst-otp-digit" inputmode="numeric" />
</div>
```

Optional JS for auto-advance, paste support, and keyboard navigation:

```js
import { createOTPInput } from "modest-components/components/otp-input/otp-input.js";

const otp = createOTPInput(document.querySelector(".mdst-otp"), {
  onComplete: (code) => console.log("Code entered:", code),
  onChange: (code) => console.log("Current value:", code),
});

// Methods
otp.getValue(); // Get current value
otp.setValue("1234"); // Set value programmatically
otp.clear(); // Clear all inputs
otp.focus(); // Focus first input
otp.destroy(); // Remove event listeners
```

### Code (inline)

```html
<p>Use <code class="mdst-code">const x = 1</code> to declare a variable.</p>
```

### Pre (code blocks)

```html
<pre class="mdst-pre">{ "json": "content" }</pre>
<pre class="mdst-pre mdst-pre--compact">single line</pre>
<pre class="mdst-pre mdst-pre--borderless">no border</pre>
<pre class="mdst-pre mdst-pre--scroll">horizontal scroll for long lines</pre>
```

## Theming

Override CSS custom properties to theme:

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
}
```

## Extending styles

Components use minimal, functional styles. Add your own on top:

```css
.mdst-button {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Adding New Components

1. Create a new folder in `components/`:

```
components/
└── my-component/
    ├── my-component.css    # Component styles
    └── preview.html        # Preview for the docs
```

2. Add the CSS import to `index.css`:

```css
@import "./components/my-component/my-component.css";
```

3. Run the generate script to update the preview:

```bash
npm run generate
```

This scans `components/` for folders with `preview.html` and updates the sidebar in `index.html`.

4. Build the bundled CSS file:

```bash
npm run build
```

This creates/updates `dist/modest-components.css` with all styles bundled into a single file.

## Development

### Building

To generate the bundled CSS file:

```bash
npm run build
```

This processes `index.css` and all its imports to create a single `dist/modest-components.css` file with all styles included.

## Preview

View the live preview at [thisismodest.github.io/modest-components](https://thisismodest.github.io/modest-components/)

Or open `index.html` locally in your browser.

## License

MIT
