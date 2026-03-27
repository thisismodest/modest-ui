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
- **BEM-style naming**:
  - Block: `.mdst-component`
  - Element: `.mdst-component-element` (single dash, not double underscore)
  - Modifier: `.mdst-component--variant`
- **Child elements**: Use single dash for children (`.mdst-dialog-header`, `.mdst-dialog-body`)
- **BEM `__` syntax**: Reserved for tightly coupled sub-elements (`.mdst-color-picker__input`)

## Classless Defaults

The classless layer styles bare HTML elements inside `.mdst-ui` automatically. Each component's CSS file contains both the classless selectors and the class-based selectors — no separate file, no duplication. It uses `:where()` so that any class-based selector always wins.

### How it works

There are three layers, in order of specificity:

1. **Classless layer** — `:where(.mdst-ui) button { ... }` — specificity `(0, 0, 1)`. Styles bare elements for free.
2. **Class layer** — `.mdst-button { ... }` — specificity `(0, 1, 0)`. Explicit opt-in, always overrides classless.
3. **Variant modifiers** — work on both bare elements and class-based elements. On bare elements they're defined as `:where(.mdst-ui) button.mdst-button--ghost`, on class-based elements as `.mdst-button.mdst-button--ghost`.

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

:where(.mdst-ui) button:hover,
.mdst-button:hover {
  background: var(--mdst-button-hover-bg);
}

/* Variants work on bare elements too */
:where(.mdst-ui) button.mdst-button--ghost,
.mdst-button.mdst-button--ghost {
  border-color: transparent;
}
```

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
| Typography | `h1`–`h6`, `p`, `a`, `strong`, `em`, `small`, `mark`, `blockquote`, `hr`, `ul`, `ol`, `li` |

### What stays class-only

Components that don't map to a single native element (they use generic tags like `<div>` or `<span>`, or are composite wrappers):

- Card (`.mdst-card`)
- Tag (`.mdst-tag`)
- Tooltip (`.mdst-tooltip`)
- Popover (`.mdst-popover`)
- Password Input (`.mdst-password-input`)
- OTP Input (`.mdst-otp-input`)
- Color Picker (`.mdst-color-picker`)
- Badge (`.mdst-badge`)
- Breadcrumbs (`.mdst-breadcrumbs`)
- Avatar (`.mdst-avatar`)
- Spinner (`.mdst-spinner`)
- Skeleton (`.mdst-skeleton`)
- Utilities (`.mdst-sr-only`, `.mdst-truncate`, etc.)

### What uses data attributes for state

Some components need state changes — tabs that switch, steps that advance, toasts that appear. Instead of shipping JavaScript, modest-ui styles every possible state via data attributes. You bring whatever JS you want (a framework, vanilla event listeners, Alpine.js) and toggle `data-state`, `data-variant`, etc. We handle the CSS, you handle the behavior.

| Component | Data Attributes                                                            |
| --------- | -------------------------------------------------------------------------- |
| Tabs      | `data-state="active/inactive"`, `data-disabled`                            |
| Toast     | `data-state="visible/hidden"`, `data-variant="success/error/warning/info"` |
| Stepper   | `data-state="completed/active/upcoming/error"`                             |

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
    ├── preview.html        # Documentation preview (required)
    └── my-component.js     # Optional JavaScript
```

## CSS Guidelines

### Tokens

Always use design tokens from `base/tokens.css`:

```css
/* Colors */
--mdst-color-fg
--mdst-color-bg
--mdst-color-border
--mdst-color-muted
--mdst-color-subtle
--mdst-color-focus
--mdst-color-error
--mdst-color-success

/* Spacing */
--mdst-space-xs  /* 0.25rem */
--mdst-space-sm  /* 0.5rem */
--mdst-space-md  /* 1rem */
--mdst-space-lg  /* 1.5rem */
--mdst-space-xl  /* 2rem */

/* Typography */
--mdst-font-sans
--mdst-font-mono
--mdst-text-xs
--mdst-text-sm
--mdst-text-base
--mdst-text-lg

/* Other */
--mdst-radius
--mdst-border-width
--mdst-transition
```

### Native CSS Nesting

All component CSS must use native CSS nesting. Each component should have a **single top-level selector** (the root block class), with everything else nested inside it:

- **Pseudo-classes** (`:hover`, `:focus-visible`, `:disabled`, `:checked`) nest with `&:pseudo`
- **Pseudo-elements** (`::before`, `::after`, `::backdrop`) nest with `&::pseudo`
- **Sub-states** (e.g. `:disabled:hover`, `:checked::before`) nest further inside their parent state block
- **Child elements** (`-header`, `-body`, `__field`, `__input`) nest with `& .mdst-component-child`
- **Modifier classes** (`--variant`, `--sm`) nest with `&.mdst-component--variant`
- **Contextual selectors** (`:has()`) nest with `&:has()`

Exceptions for separate top-level blocks:

- **Wrapper/sibling elements** that are not DOM children of the root (e.g. `.mdst-checkbox-label` wraps the checkbox, `.mdst-radio-label` wraps the radio)
- **Replacement elements** that go on a different element entirely (e.g. `.mdst-checkbox--toggle` replaces `.mdst-checkbox` on the input)
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

  /* Child elements */

  & .mdst-component-child {
    /* Child styles */
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

- `npm run dev` - Start local server at http://localhost:8000
- `npm run generate` - Scan components and update sidebar + classNames in index.html
- `npm run build` - Bundle all CSS into dist/modest-ui.css

## Adding a New Component

1. Create the component folder with CSS and preview.html (see Component Structure above)
2. Add the import to `index.css`
3. Run `npm run generate` — this automatically updates:
   - The sidebar links in `index.html`
   - The `classNames` object used for displaying the class in the header

### Class Name Convention

By default, the generate script derives class names using `.mdst-{slug}` (e.g., `button` → `.mdst-button`).

For components that don't follow this convention, add an override in `scripts/generate-preview.js`:

```javascript
const classOverrides = {
  typography: ".mdst-*",
};
```
