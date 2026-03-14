# Conventions

Guidelines for contributing to modest-ui.

## Philosophy

- **Native HTML first** - Use semantic HTML elements (`<dialog>`, `<details>`, `popover`, etc.) wherever possible
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
