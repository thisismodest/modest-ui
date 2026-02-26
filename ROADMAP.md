# Roadmap

Components and patterns identified as gaps when integrating modest-ui into a real application.

The goal is to cover enough of the common UI surface that a consuming app can delete the majority of its bespoke CSS and rely on the library instead. Every addition should stay true to the project philosophy: native HTML first, CSS-only, no opinions on layout, and fully themeable via tokens.

---

## New Components

### Toast / Notification

Small, dismissible messages that appear temporarily (success, error, warning, info).

- Native HTML: `<output>` element for accessibility
- Variants: `--success`, `--error`, `--warning`, `--info` (left-border accent color)
- Position utility classes or leave to consumer
- Close button styling
- CSS animations for enter/exit (`slideIn`, `slideOut`)

```html
<output class="mdst-toast mdst-toast--success">
  <span>File saved successfully.</span>
  <button class="mdst-toast-close">✕</button>
</output>
```

### Badge / Tag

Small inline labels for status, categories, or counts.

- Variants: `--solid`, `--outline`
- Semantic colors: `--success`, `--warning`, `--error`, `--info`
- Sizes: `--sm`, default

```html
<span class="mdst-badge">Default</span>
<span class="mdst-badge mdst-badge--success">Active</span>
<span class="mdst-badge mdst-badge--outline">Draft</span>
```

### Kbd (Keyboard Shortcut)

Styled `<kbd>` element for displaying keyboard shortcuts and hotkeys.

- Consistent padding, border, background
- Composes well inline with text

```html
<p>Press <kbd class="mdst-kbd">Ctrl</kbd> + <kbd class="mdst-kbd">K</kbd> to search</p>
```

### Status Dot / Indicator

A small colored dot that indicates connection state, availability, or health.

- Semantic colors: `--success`, `--warning`, `--error`
- Optional pulse animation: `--pulse`
- Inline with text via flexbox label wrapper

```html
<span class="mdst-status mdst-status--success">Connected</span>
<span class="mdst-status mdst-status--warning mdst-status--pulse">Connecting</span>
```

### Textarea

Dedicated textarea styling (currently `textarea.mdst-input` exists but is minimal).

- Auto-resize hint via `field-sizing: content` (progressive enhancement)
- Min/max height variants
- Borderless variant for embedded use (`--ghost`)

```html
<textarea class="mdst-textarea" rows="3" placeholder="Type a message..."></textarea>
<textarea class="mdst-textarea mdst-textarea--ghost" rows="1"></textarea>
```

### Card

A generic bordered container for grouping content — headers, bodies, footers.

- Structural children: `-header`, `-body`, `-footer`
- Variants: `--borderless`, `--interactive` (hover state)

```html
<div class="mdst-card">
  <div class="mdst-card-header">Title</div>
  <div class="mdst-card-body">Content goes here.</div>
  <div class="mdst-card-footer">
    <button class="mdst-button mdst-button--sm">Action</button>
  </div>
</div>
```

### Avatar / Icon Button

A square or circular button designed for icon-only use (no text label).

- Fixed dimensions (e.g. `--sm` 32px, default 40px, `--lg` 48px)
- Variants: `--ghost`, `--solid`, `--circle`
- Works with inline SVG or emoji content

```html
<button class="mdst-icon-button">
  <svg>...</svg>
</button>
<button class="mdst-icon-button mdst-icon-button--circle mdst-icon-button--sm">🎤</button>
```

### Progress Bar

A simple horizontal bar showing progress or capacity.

- Styles the native `<progress>` element via cross-browser pseudo-elements
- Semantic color thresholds via classes: `--low`, `--medium`, `--high`, `--critical`

```html
<progress class="mdst-progress" value="65" max="100">65%</progress>
<progress class="mdst-progress mdst-progress--critical" value="92" max="100">92%</progress>
```

### Divider

A styled horizontal rule, optionally with centered text.

- Uses native `<hr>` for plain dividers
- Text variant uses a wrapper with `::before`/`::after` line pseudo-elements

```html
<hr class="mdst-divider" />

<div class="mdst-divider mdst-divider--text">
  <span>or</span>
</div>
```

---

## Enhancements to Existing Components

### Button

- **Icon-with-text layout**: The current button handles text and `gap` but doesn't account for common icon + label patterns. Ensure `.mdst-button svg` or `.mdst-button img` get sensible default sizing (e.g. `1em`).
- **Danger variant**: `--danger` for destructive actions (red on hover).

### Details

- **Flush / no-padding variant**: `--flush` for embedding inside other containers (cards, sidebars) where the parent already provides padding.
- **Animated open/close**: Progressive enhancement via `::details-content` transition where supported.

### Dialog

- **Slide-in animation**: Optional `--animated` class for `slideIn` on open.
- **Danger variant**: `--danger` for destructive confirmation dialogs (red accent on header/footer).

### Pre

- **Header bar**: Optional `.mdst-pre-header` for a label/language bar above the code block (common in documentation and chat UIs).
- **Copy button area**: A positioned area for a copy-to-clipboard button (`.mdst-pre-actions`), CSS-only layout with the button itself left to the consumer.

### Input

- **Input group**: A `.mdst-input-group` wrapper for combining an input with adjacent buttons or icons (search bars, send inputs).

```html
<div class="mdst-input-group">
  <input class="mdst-input" placeholder="Search..." />
  <button class="mdst-button">Go</button>
</div>
```

### Table

- **Scrollable wrapper utility**: Ensure `.mdst-table-wrap` is documented prominently — it is needed for responsive tables but easy to forget.
- **Muted row variant**: `--muted` for de-emphasized rows.

---

## Utilities (Optional)

Small utility classes that reduce the need for bespoke CSS in consuming apps. These should be opt-in (separate import or included in the bundle with low specificity).

| Utility         | Class            | Purpose                                                       |
| --------------- | ---------------- | ------------------------------------------------------------- |
| Visually hidden | `.mdst-sr-only`  | Screen-reader-only content                                    |
| Truncate        | `.mdst-truncate` | Single-line text overflow ellipsis                            |
| Muted text      | `.mdst-muted`    | `color: var(--mdst-color-muted)`                              |
| Small text      | `.mdst-small`    | `font-size: var(--mdst-text-sm)`                              |
| Mono text       | `.mdst-mono`     | `font-family: var(--mdst-font-mono)`                          |
| Flex center     | `.mdst-center`   | `display: flex; align-items: center; justify-content: center` |
