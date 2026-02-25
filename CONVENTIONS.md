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

### Component CSS Pattern

```css
/* Component Name */

.mdst-component {
  /* Base styles */
}

.mdst-component:hover {
  /* Hover state */
}

.mdst-component:focus-visible {
  /* Focus state - use outline */
}

.mdst-component:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */

.mdst-component--variant {
  /* Variant styles */
}

/* Sizes */

.mdst-component--sm {
  /* Small size */
}

.mdst-component--lg {
  /* Large size */
}
```

## Preview HTML Format

Each component's `preview.html` should follow this structure:

### Required Imports

```html
<link rel="stylesheet" href="../../base/tokens.css" />
<link rel="stylesheet" href="../../base/reset.css" />
<link rel="stylesheet" href="my-component.css" />
<link rel="stylesheet" href="../table/table.css" />
<link rel="stylesheet" href="../pre/pre.css" />
<link rel="stylesheet" href="../code/code.css" />
```

### Page Styles

Include these standard styles in your preview:

```html
<style>
  body {
    font-family: var(--mdst-font-sans);
    padding: var(--mdst-space-md);
  }

  .section {
    margin-bottom: var(--mdst-space-lg);
  }

  .section-header {
    font-size: var(--mdst-text-sm);
    font-weight: 600;
    color: var(--mdst-color-fg);
    margin-bottom: var(--mdst-space-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .class-name {
    font-family: var(--mdst-font-mono);
    font-size: var(--mdst-text-sm);
    color: var(--mdst-color-fg);
    background: var(--mdst-color-subtle);
    padding: 0.125em 0.375em;
    border-radius: 2px;
    white-space: nowrap;
  }

  .class-name .dim {
    opacity: 0.4;
  }

  .mdst-table th:first-child,
  .mdst-table td:first-child {
    width: 50%;
  }

  .code-section {
    margin-top: var(--mdst-space-lg);
  }

  .code-section-header {
    font-size: var(--mdst-text-sm);
    font-weight: 600;
    color: var(--mdst-color-fg);
    margin-bottom: var(--mdst-space-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
- `npm run generate` - Scan components and update sidebar in index.html
- `npm run build` - Bundle all CSS into dist/modest-ui.css

## Adding to index.html

When adding a new component, also add its class name to the `classNames` object in `index.html`:

```javascript
const classNames = {
  // ...existing components
  "my-component": ".mdst-my-component",
};
```

This displays the main class in the header when viewing the component.
