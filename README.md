# modest-components

A minimal, themeable CSS component library. Black and white by default, easy to customize.

## Installation

```bash
npm install modest-components
```

## Usage

### Import everything

```html
<link rel="stylesheet" href="modest-components/index.css" />
```

Or in your CSS/JS:

```css
@import "modest-components/index.css";
```

```js
import "modest-components/index.css";
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
├── index.css                          # All styles bundled
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
<p>Use <code class="mdst-code">npm install</code> to install dependencies.</p>
```

### Pre (code blocks)

```html
<pre class="mdst-pre">{ "json": "content" }</pre>
<pre class="mdst-pre mdst-pre--compact">single line</pre>
<pre class="mdst-pre mdst-pre--borderless">no border</pre>
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

## License

MIT
