# Conventions

Guidelines for contributing to modest-ui.

## Philosophy

- **Native HTML first** - Use semantic HTML elements (`<dialog>`, `<details>`, `popover`, etc.) wherever possible
- **Classless by default** - Add `.mdst-ui` to the body and bare elements are styled automatically
- **Minimal CSS** - Lightweight styling that enhances without overriding browser defaults
- **No JavaScript required** - CSS-only components, with optional JS for enhanced functionality
- **Themeable** - All colors, spacing, and radii use CSS custom properties

## Naming

- **Prefix**: All classes use the `mdst-` prefix
- **BEM naming**:
  - Block: `.mdst-component` (a hyphenated block name is still one block, e.g. `.mdst-toast-group`, `.mdst-radio-card`)
  - Element (a part inside a block): `.mdst-component__element`, e.g. `.mdst-dialog__header`, `.mdst-tabs__panel`
  - Modifier: `.mdst-component--variant`, or `.mdst-component__element--variant` on an element
- **Shared modifier vocabulary**, so the same idea has the same name everywhere:
  - Status: `--success`, `--info`, `--warning`, `--danger` (plus `--muted` where it applies)
  - Fill and edge: `--solid` (filled with the colour), `--subtle` (tinted), `--borderless` (no visible border)
  - Size: `--sm`, `--lg` (and `--xl` where a component needs it)
- **Data attributes are for runtime state** that JS toggles (`data-state`), never for fixed choices like status or size.

## Classless Defaults

The classless layer styles bare HTML elements inside `.mdst-ui` automatically. Each component's CSS file contains both the classless selectors and the class-based selectors — no separate file, no duplication. It uses `:where()` so that any class-based selector always wins.

### How it works

There are three layers, in order of specificity:

1. **Classless layer** — `:where(.mdst-ui) button { ... }` — specificity `(0, 0, 1)`. Styles bare elements for free.
2. **Class layer** — `.mdst-button { ... }` — specificity `(0, 1, 0)`. Explicit opt-in, always overrides classless.
3. **Variant modifiers** — work on both bare elements and class-based elements. On bare elements they're defined as `:where(.mdst-ui) button.mdst-button--borderless`, on class-based elements as `.mdst-button.mdst-button--borderless`.

### Selector format

Always use `:where(.mdst-ui)` as the ancestor, never `.mdst-ui` directly. This keeps the specificity contribution of the scoping class at zero:

```css
/* Correct — specificity is (0, 0, 1), just the element */
:where(.mdst-ui) button { ... }

/* Wrong — specificity is (0, 1, 1), would fight with .mdst-button */
.mdst-ui button { ... }
```

Use flat selectors (no nesting) for classless rules to keep them straightforward and greppable. Classless and class-based selectors share declarations via comma-separation:

```css
/* Classless + class-based share the same rule block */
:where(.mdst-ui) button,
.mdst-button {
  padding: var(--mdst-space-sm) var(--mdst-space-md);
  /* ... */
}

:where(.mdst-ui) button:focus-visible,
.mdst-button:focus-visible {
  outline: var(--mdst-border-width) solid var(--mdst-color-focus);
}

/* Variants work on bare elements too */
:where(.mdst-ui) select.mdst-dropdown--sm,
.mdst-dropdown.mdst-dropdown--sm {
  font-size: var(--mdst-text-sm);
}
```

### Cascade layer

Every library CSS file wraps its rules in a layer: `@layer mdst-ui.base { … }` for `base/tokens.css` and `base/reset.css`, and `@layer mdst-ui.components { … }` for everything in `components/`. The order is declared once at the top of `tokens.css` and `index.css`:

```css
@layer mdst-ui.base, mdst-ui.components;
```

This means anything outside a layer, including all of a user's own CSS, beats the library, and the reset can never beat a component. When you add a component file, wrap it the same way.

### Write for both text directions

Use logical properties so components mirror in right-to-left pages: `margin-inline-start` not `margin-left`, `inset-inline-end` not `right`, `border-inline-start`, `padding-inline-end`, `text-align: start`. Name direction modifiers `--start` and `--end`, never `--left` and `--right`.

Where there's no logical form (sideways `translate`, `background-position`), use a private variable flipped with `:dir(rtl)`:

```css
.mdst-drawer {
  --_dir: 1;
  transform: translateX(calc(100% * var(--_dir)));

  &:dir(rtl) {
    --_dir: -1;
  }
}
```

### Size with border-box

Most projects have a `*, *::before, *::after { box-sizing: border-box }` reset, and because it's outside a layer it beats ours. So never rely on `content-box`: declare `box-sizing: border-box` and include the border in fixed sizes, e.g. `width: calc(0.875rem + 2 * var(--mdst-border-width))`. A component then measures the same with or without the user's reset.

### Classless selectors only count the element

Inside a classless selector, only the element type may add specificity. Attribute selectors and pseudo-classes go inside `:where()`; pseudo-elements stay outside:

```css
/* Right — (0, 0, 1), so any class beats it */
:where(.mdst-ui) input:where([type="checkbox"]:checked)::after { … }

/* Wrong — (0, 2, 1), beats single classes like .mdst-toggle */
:where(.mdst-ui) input[type="checkbox"]:checked::after { … }
```

Components that need margins removed for class-only use (outside `.mdst-ui`) list their class in `base/reset.css` rather than setting `margin: 0` themselves. The reset is in the base layer, so flow spacing still applies.

### Interactive states set variables, not properties

A classless state such as `:where(.mdst-ui) button:hover` has specificity `(0, 1, 1)`, which beats a single component class like `.mdst-toast__close`. If the state set `background` directly, it would leak into every component that reuses a bare `<button>`.

So state rules only change a private variable, and the base rule reads it. A component that reskins a bare `<button>` opts out with a plain property reset, which always beats the classless base rule:

```css
:where(.mdst-ui) button,
.mdst-button {
  box-shadow: var(--_hover, none);
}

:where(.mdst-ui) button:hover,
.mdst-button:hover {
  --_hover: var(--mdst-button-hover-shadow, inset 0 0 0 var(--mdst-border-width) currentColor);
}

/* A component's own button: */
.mdst-toast__close {
  box-shadow: none;
}
```

Variants follow the same idea: they set the component's public variables (`--mdst-button-tone`, `--mdst-button-bg`, …) instead of properties, so a single class works on any element, combines with other variants, and users can write their own variant the same way.

### What gets classless defaults

Components that map 1:1 to a native HTML element:

| Component  | Selector                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------ |
| Button     | `button`, `input[type="submit"]`, `input[type="reset"]`, `input[type="button"]`            |
| Input      | `input:not([type="checkbox"], [type="radio"], ...)`, `textarea`                            |
| Checkbox   | `input[type="checkbox"]`                                                                   |
| Radio      | `input[type="radio"]`                                                                      |
| Dropdown   | `select`                                                                                   |
| File Input | `input[type="file"]`                                                                       |
| Range      | `input[type="range"]`                                                                      |
| Details    | `details`                                                                                  |
| Dialog     | `dialog`                                                                                   |
| Table      | `table`, `th`, `td`                                                                        |
| Code       | `code`                                                                                     |
| Pre        | `pre`                                                                                      |
| Typography | `h1`–`h6`, `p`, `a`, `strong`, `em`, `small`, `mark`, `kbd`, `abbr[title]`, `del`, `ins`, `s`, `cite`, `samp`, `var`, `sub`, `sup`, `blockquote`, `hr`, `ul`, `ol`, `li` |
| Progress   | `progress` |
| Meter      | `meter` |

### What stays class-only

Components that don't map to a single native element (they use generic tags like `<div>` or `<span>`, or are composite wrappers):

- Card (`.mdst-card`)
- Tag (`.mdst-tag`)
- Toolbar (`.mdst-toolbar`)
- Tooltip (`.mdst-tooltip`)
- Popover (`.mdst-popover`)
- Password Input (`.mdst-password-input`)
- OTP Input (`.mdst-otp-input`)
- Color Picker (`.mdst-color-picker`)
- Badge (`.mdst-badge`)
- Banner (`.mdst-banner`)
- Breadcrumbs (`.mdst-breadcrumbs`)
- Avatar (`.mdst-avatar`)
- Spinner (`.mdst-spinner`)
- Skeleton (`.mdst-skeleton`)
- Utilities (`.mdst-sr-only`, `.mdst-truncate`, etc.)

### What uses data attributes for state

Some components need state changes — tabs that switch, steps that advance, toasts that appear. Instead of shipping JavaScript, modest-ui styles every possible state via data attributes. You bring whatever JS you want (a framework, vanilla event listeners, Alpine.js) and toggle `data-state` and friends. We handle the CSS, you handle the behavior.

Data attributes are for runtime state only. Fixed choices such as colour or size are modifier classes (`.mdst-toast--success`), the same as every other component.

| Component | Data Attributes                                 |
| --------- | ----------------------------------------------- |
| Tabs      | `data-state="active/inactive"`, `data-disabled` |
| Banner    | `data-state="visible/hidden"`                   |
| Toast     | `data-state="visible/hidden"`                   |
| Stepper   | `data-state="completed/active/upcoming/error"`  |

Data attribute components are still class-only (they use `.mdst-*` classes for structure). The data attributes control **runtime state**, not base styling.

### Adding classless defaults for a new component

When you add a new component that maps to a native element:

1. In the component's own CSS file, add `:where(.mdst-ui) element` as a comma-separated selector alongside the existing class selector
2. Do the same for states (`:hover`, `:focus-visible`, `:disabled`, etc.) and variant modifiers
3. Never create a separate defaults file — everything lives in the component's CSS file to avoid duplication

### Label wrappers for checkbox and radio

The classless layer also styles `<label>` elements that directly wrap a checkbox or radio using `:has()`:

```css
:where(.mdst-ui) label:has(> input[type="checkbox"]) { ... }
```

This means `<label><input type="checkbox"> Remember me</label>` gets flexbox alignment automatically.

## Component Structure

Each component lives in its own folder:

```
components/
└── my-component/
    ├── my-component.css    # Component styles (required)
    ├── config.js           # Title, class name, and description (required)
    └── preview.html        # Documentation preview (required)
```

modest-ui is CSS only. If a docs page needs JavaScript to demonstrate behaviour (switching tabs, revealing a password), keep it in `preview.html` and label it as example code.

## CSS Guidelines

### Tokens

Always use design tokens from `base/tokens.css` rather than raw values. The full list, with defaults, is in that file and in `llms.txt`. The groups:

- **Colour:** `--mdst-color-fg`, `-bg`, `-border`, `-muted`, `-subtle`, `-focus`, `-danger`, `-warning`, `-success` (and optional `--mdst-color-info`)
- **Type:** `--mdst-font-text`, `--mdst-font-ui`, `--mdst-font-mono`, `--mdst-text-xs` to `--mdst-text-xl`, `--mdst-line-height`
- **Space:** `--mdst-space-xs` to `--mdst-space-xl` (and the numeric scale they alias), `--mdst-flow-space`
- **Shape:** `--mdst-radius`, `--mdst-border-width`
- **Focus:** `--mdst-focus-offset` (and optional `--mdst-focus-ring`)
- **Motion:** `--mdst-transition-fast`, `--mdst-transition`, `--mdst-transition-slow`
- **Depth:** `--mdst-shadow-sm`, `--mdst-shadow`, `--mdst-backdrop`, `--mdst-z-overlay`
- **State:** `--mdst-disabled-opacity`

### Native CSS Nesting

Two shapes, depending on whether the component has a classless form:

- **Classless and class share rules** (button, input, checkbox, table…): flat, comma-separated selector lists, so every classless selector stays visible and greppable. `button.css` is the model.
- **Class-only components** (card, tabs, toast…): native CSS nesting under a **single top-level selector**, the block class, with everything else nested inside it:

- **Pseudo-classes** (`:hover`, `:focus-visible`, `:disabled`, `:checked`) nest with `&:pseudo`
- **Pseudo-elements** (`::before`, `::after`, `::backdrop`) nest with `&::pseudo`
- **Sub-states** (e.g. `:disabled:hover`, `:checked::before`) nest further inside their parent state block
- **Elements** (`__header`, `__body`, `__field`) nest with `& .mdst-component__element`
- **Modifier classes** (`--variant`, `--sm`) nest with `&.mdst-component--variant`
- **Contextual selectors** (`:has()`) nest with `&:has()`

Exceptions for separate top-level blocks:

- **Wrapper/sibling elements** that are not DOM children of the root (e.g. `.mdst-checkbox-label` wraps the checkbox, `.mdst-radio-label` wraps the radio)
- **Replacement elements** that go on a different element entirely (e.g. `.mdst-toggle` replaces `.mdst-checkbox` on the input)
- **Unrelated element collections** (e.g. typography classes like `.mdst-h1`, `.mdst-p`, `.mdst-a`)
- **`@media` blocks** remain at the top level with their component selector nested inside

**Pseudo-element hover note:** Never nest `:hover` inside a pseudo-element like `&::file-selector-button`. Instead, put `:hover` on the element and target the pseudo-element: `&:hover::file-selector-button`.

### Component CSS Pattern

```css
/* Component Name */

.mdst-component {
  /* Base styles */

  &:hover {
    /* Hover state */
  }

  &:focus-visible {
    /* Focus state - use outline */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      /* Reset hover when disabled */
    }
  }

  /* Elements */

  & .mdst-component__element {
    /* Element styles */
  }

  /* Variants */

  &.mdst-component--variant {
    /* Variant styles */

    &:hover {
      /* Variant hover state */
    }
  }

  /* Sizes */

  &.mdst-component--sm {
    /* Small size */
  }

  &.mdst-component--lg {
    /* Large size */
  }
}
```

## Preview HTML Format

Each component's `preview.html` should follow this structure:

### Required Imports

```html
<link rel="stylesheet" href="../../base/tokens.css" />
<link rel="stylesheet" href="../../base/reset.css" />
<link rel="stylesheet" href="../../base/preview.css" />
<link rel="stylesheet" href="../table/table.css" />
<link rel="stylesheet" href="../pre/pre.css" />
<link rel="stylesheet" href="../code/code.css" />
<link rel="stylesheet" href="my-component.css" />
```

The `preview.css` file provides all the standard preview page styles (body, `.section`, `.section-header`, `.class-name`, `.examples`, `.footnote`, `.code-section`, etc.). Import the component's own CSS file last.

### Component-Specific Styles

If your component preview needs additional styles (e.g., constraining input widths in tables), add a minimal `<style>` block:

```html
<style>
  .mdst-table input {
    max-width: 16rem;
  }
</style>
```

### Table Format

Use `.mdst-table--stack` for mobile-friendly tables:

```html
<div class="section">
  <div class="section-header">Variants</div>
  <table class="mdst-table mdst-table--stack">
    <thead>
      <tr>
        <th>Class</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <span class="class-name">.mdst-component</span>
        </td>
        <td>
          <!-- Example component -->
        </td>
      </tr>
      <tr>
        <td>
          <span class="class-name"><span class="dim">.mdst-component</span>--variant</span>
        </td>
        <td>
          <!-- Example with variant -->
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Class Name Display

- **Base class**: `<span class="class-name">.mdst-component</span>`
- **Modifier**: `<span class="class-name"><span class="dim">.mdst-component</span>--variant</span>`
- **Child element**: `<span class="class-name"><span class="dim">.mdst-component</span>-child</span>`
- **Multiple classes**: Use `<br />` between them
- **Attributes**: `<span class="class-name">disabled</span>`

The dimmed prefix shows the full class name while keeping the unique part prominent.

### Usage Code Section

End each preview with a usage section:

```html
<div class="code-section">
  <div class="code-section-header">Usage</div>
  <pre class="mdst-pre"><code>&lt;!-- Basic usage --&gt;
&lt;div class="mdst-component"&gt;...&lt;/div&gt;

&lt;!-- With variant --&gt;
&lt;div class="mdst-component mdst-component--variant"&gt;...&lt;/div&gt;</code></pre>
</div>
```

## Scripts

- `npm run dev` - Build everything and serve the site at http://localhost:8000
- `npm run build` - Build the bundle (`dist/`), `llms.txt`, and the docs site

## Adding a New Component

1. Create the component folder with `<slug>.css`, `config.js`, and `preview.html` (see Component Structure above)
2. Wrap the CSS in `@layer mdst-ui.components { … }` and add the import to `index.css`
3. Run `npm run build`. The sidebar, the docs page header, and `llms.txt` all come from `config.js`:

```javascript
export default {
  title: "Toggle",
  className: ".mdst-toggle", // shown in the docs header
  description: "One sentence on what it is and its main variants.",
  group: "Input" // optional: nests it under a sidebar group
};
```
