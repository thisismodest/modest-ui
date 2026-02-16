# modest-ui

A minimal, themeable CSS component library. Black and white by default, easy to customise.

## Installation

### From local path

```bash
npm install ../path/to/modest-ui
```

### From GitHub

```bash
npm install github:thisismodest/modest-ui
```

## Usage

### Use the bundled CSS (recommended)

For the simplest setup, use the pre-bundled CSS file that contains all styles in a single file:

Via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thisismodest/modest-ui@0.1.0/dist/modest-ui.css" />
```

Or with a package manager:

```css
@import "modest-ui/dist/modest-ui.css";
```

Or in JS (with a bundler):

```js
import "modest-ui/dist/modest-ui.css";
```

### Import everything (with build tool)

If you're using a build tool that supports CSS imports:

```css
@import "modest-ui/index.css";
```

Or in JS (with a bundler):

```js
import "modest-ui/index.css";
```

### Cherry-pick components

```css
/* Always include tokens first */
@import "modest-ui/base/tokens.css";

/* Then pick what you need */
@import "modest-ui/components/button/button.css";
@import "modest-ui/components/otp-input/otp-input.css";
```

## Structure

```
modest-ui/
├── index.css                          # All styles with @import statements
├── dist/
│   └── modest-ui.css          # Bundled single-file CSS (no imports)
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
    ├── pre/
    │   └── pre.css
    ├── dialog/
    │   └── dialog.css
    ├── details/
    │   └── details.css
    └── popover/
        └── popover.css
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
import { createOTPInput } from "modest-ui/components/otp-input/otp-input.js";

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

### Dialog

Native HTML `<dialog>` element with styling:

```html
<!-- Modal Dialog -->
<dialog id="my-dialog" class="mdst-dialog">
  <div class="mdst-dialog-header">
    <h2 class="mdst-dialog-title">Dialog Title</h2>
    <button class="mdst-dialog-close" commandfor="my-dialog" command="close">✕</button>
  </div>
  <div class="mdst-dialog-body">
    <p>Dialog content goes here.</p>
  </div>
  <div class="mdst-dialog-footer">
    <button class="mdst-button mdst-button--ghost" commandfor="my-dialog" command="close">Cancel</button>
    <button class="mdst-button mdst-button--solid" commandfor="my-dialog" command="close">Confirm</button>
  </div>
</dialog>

<button class="mdst-button" commandfor="my-dialog" command="show-modal">Open Dialog</button>
```

Size variants:

```html
<dialog class="mdst-dialog mdst-dialog--sm">...</dialog>
<dialog class="mdst-dialog mdst-dialog--lg">...</dialog>
<dialog class="mdst-dialog mdst-dialog--full">...</dialog>
```

### Details (Toggle/Accordion)

Native HTML `<details>` element for collapsible content:

```html
<details class="mdst-details">
  <summary>Click to expand</summary>
  <div class="mdst-details-content">
    <p>Hidden content that appears when expanded.</p>
  </div>
</details>
```

Variants:

```html
<details class="mdst-details mdst-details--borderless">...</details>
<details class="mdst-details mdst-details--compact">...</details>
```

### Popover

Native HTML popover API with styling:

```html
<button popovertarget="my-popover">Toggle Popover</button>

<div id="my-popover" class="mdst-popover" popover>
  <p>This is a popover!</p>
</div>
```

Size variants:

```html
<div class="mdst-popover mdst-popover--sm" popover>Small popover</div>
<div class="mdst-popover mdst-popover--lg" popover>Large popover</div>
```

Tooltip variant:

```html
<button popovertarget="tooltip" popovertargetaction="hover">Hover me</button>
<div id="tooltip" class="mdst-tooltip" popover>Helpful tooltip text</div>
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

This creates/updates `dist/modest-ui.css` with all styles bundled into a single file.

## Preview

View the live preview at [thisismodest.github.io/modest-ui](https://thisismodest.github.io/modest-ui/)

Or open `index.html` locally in your browser.

## License

MIT
