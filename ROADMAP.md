# Roadmap

Future components, enhancements, and project goals for modest-ui.

---

## 3.0 removals

Deprecated in 2.x and still working until then. Each one is marked in its CSS
with `Deprecated: remove in 3.0` and listed in its component's `config.js`.

- **Status modifiers**, replaced by the tone classes (`.mdst-danger`,
  `.mdst-success`, `.mdst-warning`, `.mdst-info`):
  - `.mdst-button--danger`
  - `.mdst-badge--danger`, `--success`, `--warning`, `--info`
  - `.mdst-tag--danger`, `--success`, `--warning`, `--info`
  - `.mdst-banner--danger`, `--success`, `--warning`, `--info`
  - `.mdst-toast--danger`, `--success`, `--warning`, `--info`
  - `.mdst-progress--danger`, `--success`
  - `.mdst-otp-input--danger`, `--success`

---

## New Components

### Status Dot / Indicator

A small colored dot that indicates connection state, availability, or health.

- Coloured by the tone classes (`.mdst-success`, `.mdst-warning`, …)
- Inline with text via flexbox label wrapper
- No pulse or other animation (see Motion in CONVENTIONS.md); `.mdst-badge--dot` already covers the bare dot

```html
<span class="mdst-status mdst-success">Connected</span>
<span class="mdst-status mdst-warning">Connecting</span>
```

### Textarea

Textarea is already styled, classless or with `.mdst-input`, like every other field. These would build on that rather than add a separate class:

- Auto-resize with `field-sizing: content` (progressive enhancement; browsers without it keep the `rows` height)
- Min and max height, so an auto-resizing textarea stops growing at a sensible size
- Check the borderless variant (`.mdst-input--borderless`) suits embedded use, such as a chat composer

```html
<textarea rows="3" placeholder="Type a message..."></textarea>
<textarea class="mdst-input--borderless" rows="1"></textarea>
```

### Icon Button

A square or circular button designed for icon-only use (no text label).

- Fixed dimensions (e.g. `--sm` 32px, default 40px, `--lg` 48px)
- Variants: `--borderless`, `--solid`, `--circle`
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

### Details

- **Flush / no-padding variant**: `--flush` for embedding inside other containers (cards, sidebars) where the parent already provides padding.

### Dialog

- **Danger tone**: `.mdst-danger` on a dialog for destructive confirmations (red accent on header/footer), using the shared tone classes rather than a `--danger` modifier.

### Pre

- **Header bar**: Optional `.mdst-pre__header` for a label/language bar above the code block (common in documentation and chat UIs).
- **Copy button area**: A positioned area for a copy-to-clipboard button (`.mdst-pre__actions`), CSS-only layout with the button itself left to the consumer.

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

- [x] **GitHub Discussions** — Enable Discussions for questions, ideas, and "show & tell" from the community
- [x] **GitHub Sponsors** — Set up sponsorship for anyone who wants to support ongoing development
- [ ] **dev.to / Hacker News article** — Write an introduction post explaining the philosophy and announce the project
