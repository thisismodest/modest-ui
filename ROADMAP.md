# Roadmap

Future components, enhancements, and project goals for modest-ui.

---

## New Components

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

### Icon Button

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

---

## Enhancements to Existing Components

### Button

- **Icon-with-text layout**: Ensure `.mdst-button svg` or `.mdst-button img` get sensible default sizing (e.g. `1em`).
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

| Utility     | Class          | Purpose                                                       |
| ----------- | -------------- | ------------------------------------------------------------- |
| Flex center | `.mdst-center` | `display: flex; align-items: center; justify-content: center` |

---

## Community & Project

- [ ] **GitHub Discussions** — Enable Discussions for questions, ideas, and "show & tell" from the community
- [ ] **GitHub Sponsors** — Set up sponsorship for anyone who wants to support ongoing development
- [ ] **dev.to / Hacker News article** — Write an introduction post explaining the philosophy and announce the project
