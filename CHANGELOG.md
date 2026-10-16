# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The public API is the set of CSS custom properties (`--mdst-*`) and class names
(`.mdst-*`) documented on [modest-ui.com](https://modest-ui.com) and in
`llms.txt`. Renaming or removing a documented token or class is a breaking
change; adding new ones is a minor change.

## [Unreleased]

2.0 is a clean break: v1 names are not kept as aliases. Pin `mdst-ui@1` to stay
on v1. To upgrade, apply the renames below, then check the removed tokens.

### Renamed

Class names now follow BEM (`block__element--modifier`), and the same idea has
the same modifier name in every component.

| v1 | v2 |
| --- | --- |
| `.mdst-card-header`, `-body`, `-footer` | `.mdst-card__header`, `__body`, `__footer` |
| `.mdst-card-header--borderless`, `.mdst-card-footer--borderless` | `.mdst-card__header--borderless`, `.mdst-card__footer--borderless` |
| `.mdst-dialog-header`, `-title`, `-body`, `-footer`, `-close` | `.mdst-dialog__header`, `__title`, `__body`, `__footer`, `__close` |
| `.mdst-drawer-header`, `-body`, `-footer`, `-close` | `.mdst-drawer__header`, `__body`, `__footer`, `__close` |
| `.mdst-banner-content`, `-actions`, `-close` | `.mdst-banner__content`, `__actions`, `__close` |
| `.mdst-toast-close` | `.mdst-toast__close` |
| `.mdst-tag-dismiss` | `.mdst-tag__dismiss` |
| `.mdst-tab`, `.mdst-tabs-list`, `.mdst-tabs-panel` | `.mdst-tabs__tab`, `.mdst-tabs__list`, `.mdst-tabs__panel` |
| `.mdst-stepper-step`, `-indicator`, `-label` | `.mdst-stepper__step`, `__indicator`, `__label` |
| `.mdst-toolbar-group`, `-separator`, `-spacer` | `.mdst-toolbar__group`, `__separator`, `__spacer` |
| `.mdst-toolbar-group--attached` | `.mdst-toolbar__group--attached` |
| `.mdst-otp-input-digit`, `-separator` | `.mdst-otp-input__digit`, `__separator` |
| `--ghost` (button, dropdown, tag) | `--borderless` |
| `--inverted` (button, file input) | `--solid` |
| `--compact` (card, details, pre, table, tabs, stepper, breadcrumbs) | `--sm` |
| `--error` (badge, tag, progress, OTP input) | `--danger` |
| `data-variant="success\|error\|warning\|info"` (banner, toast) | `.mdst-banner--success`, `--danger`, `--warning`, `--info` (same for toast) |
| `.mdst-checkbox--toggle`, `.mdst-checkbox--toggle-rounded` | `.mdst-toggle`, `.mdst-toggle--pill` |
| `--mdst-color-error` | `--mdst-color-danger` |

Data attributes are now only for runtime state (`data-state`). Unchanged
blocks with hyphenated names (`.mdst-toast-group`, `.mdst-avatar-group`,
`.mdst-radio-card`, `.mdst-table-wrap`, and so on) are separate blocks, not
elements, so they keep their names.

### Removed

- **Breaking:** `--mdst-button-hover-bg`, `--mdst-button-hover-color`, and
  `--mdst-button-hover-border`, replaced by a single
  `--mdst-button-hover-shadow` (see below). They are also gone from the theme
  presets and the Theme Playground.

### Changed

- **Cascade layer:** everything is now in the `mdst-ui` layer
  (`mdst-ui.base` for tokens and reset, `mdst-ui.components` for the rest).
  Any CSS outside a layer, including all of your own, now beats modest-ui
  whatever its specificity or load order. Each file layers itself, so this
  applies to the bundle, `index.css`, and cherry-picked files alike. Blanket
  resets in your CSS also win; put them in a layer before `mdst-ui` if needed.
- **Reset is scoped to `.mdst-ui`.** It used to restyle the whole page
  (`* { margin: 0 }`, block images, `body` line-height). Now it only applies
  inside `.mdst-ui`, and the `.mdst-ui` element itself keeps its own margin.
  Elements with an `mdst-` class get `border-box` sizing wherever they are,
  so class-only components still size correctly outside `.mdst-ui`. If your
  page relied on the old global reset, add your own.
- **Classless selectors** now only count the element (attribute selectors and
  pseudo-classes moved into `:where()`), so any modest-ui class beats any
  classless default. This fixes radio cards inside `.mdst-ui`, a filled square
  over the password toggle, the toolbar resizing OTP digits and colour
  pickers, and table cells ignoring classes.
- `typography`: plain paragraphs, headings, and links inherit their colour
  (and paragraphs their size) instead of setting it, so text inside tooltips,
  small banners, and coloured tags keeps the component's colour and size.
- `input`, `dropdown`, `checkbox`, `radio`, `pre`: the `margin: 0` that blocked
  flow spacing moved into the base-layer reset. Text inputs now get the same
  label gap as selects and textareas.
- `checkbox`, `toggle`, `radio`: sized with `border-box` and the border
  included, so a project-wide `box-sizing: border-box` reset no longer
  shrinks them or pushes the toggle's thumb over its border.
- `card`: `--borderless` no longer forces header and footer dividers back, so
  `__header--borderless` and `__footer--borderless` work on borderless cards.
  Removed two rules that did nothing.
- `table`: `--stack` now wins over `--bordered` and `--sm` on small screens.
- `button`: hover no longer inverts the button. It used to make a hovered
  default button look exactly like a resting filled one, and vice versa, so
  side-by-side buttons (and toggle groups) became indistinguishable. Hover now
  draws a ring in the button's own text colour: outlined buttons read as a
  thicker border, filled ones get an inner ring. It adds no new colour, so it
  can't clash with any theme.
- `button`: variants only set variables, so `--solid`, `--borderless`, `--sm`,
  and `--lg` now also work on bare `<input type="submit">` and on `<a>`.
  Ghost buttons are transparent, so they sit on any background.
- `button`: classless hover no longer leaks into other components that use a
  bare `<button>` inside `.mdst-ui`. Toast, tag, banner, dialog, and drawer
  close buttons previously turned solid on hover; they and tabs now opt out.
- `file-input`: the "Choose file" button uses the same ring hover.
- `checkbox`, `radio`, `dropdown`: no hover change. The border used to fade
  to the muted colour on hover, lowering contrast; checkboxes, toggles, radios,
  and selects now keep their border. Radio cards keep their hover tint, and
  ghost selects still show their border on hover.
- `toolbar`: the `aria-pressed` style moved into `button`, so toggle buttons
  work outside a toolbar too.
- `banner`, `toast`, `tag`: close buttons are square, so their focus ring is
  a neat square.
- `table`: striped tables inset their first and last cells, so text no
  longer touches the edge of the stripe. Plain tables stay flush, aligned with
  the text around them.

### Added

- Theme Playground: fine-tuning controls for the variables outside the
  presets: warning and surface colours, reading and interface fonts, line
  height, flow space, focus ring and offset, button hover, and transition
  speed. Only values you change are added to the generated CSS, and the
  preview pins a hovered and a focused button so those settings are visible.
- Focus ring: every component now uses the same keyboard focus ring
  (`:focus-visible`), 2px solid in `--mdst-color-focus`, drawn flush against
  the component's edge (`--mdst-focus-offset: 0px`). Set `--mdst-focus-ring` to
  replace it everywhere
  (any outline value, or `none`). Text inputs, textareas, selects, the file
  input, and OTP digits draw it flush to their border; tabs and `summary` draw
  it inside. Previously focus styles varied between components, and focused
  text fields only changed border colour, which in the default theme (border
  and focus both black) was invisible. Tabs and toast/tag close buttons had
  no focus style of their own.
- Flow spacing: children of plain containers (the `.mdst-ui` root, and
  unclassed `main`, `section`, `article`, `header`, `footer`, `aside`, `div`,
  `form`, `fieldset`, `details`, `blockquote`, `dd`) are spaced by
  `--mdst-flow-space` (default `1em`, so it scales with each element). Give a
  container a class and its spacing is yours, so flex and grid layouts don't
  get doubled gaps. Dialogs, popovers, and pinned (sticky or fixed) banners
  are left alone. Zero specificity; set the token to `0` to turn it off.
- `form`: a light structure layer. Fields stack under their labels with a
  small gap, fields are spaced by `--mdst-flow-space`, `<small>` hints sit
  close to their field, and `fieldset` / `legend` get a border and weight.
  Classless inside `.mdst-ui`, or `.mdst-form`, `.mdst-fieldset`, and
  `.mdst-legend`. Zero specificity throughout.
- `input`, `dropdown`: invalid state from `aria-invalid="true"` or
  `:user-invalid` (the browser's validation, after the user interacts). Focus
  still wins while the field is focused.
- Opt-in dark mode: set `color-scheme: light dark` (follow the system) or
  `dark` (always) on `:root`. Without it, pages stay light. Uses
  `light-dark()`; older browsers stay light.
- `typography`: the `.mdst-ui` container now sets `color` and
  `background-color` from the theme tokens, so presets and dark mode apply to
  the page itself.
- `tag`: `--warning` and `--info` status variants; `badge`: `--info`. Badge,
  tag, banner, and toast now share the same status set: `--success`,
  `--info`, `--warning`, and `--danger`.
- Optional `--mdst-color-info` token. Info variants use the text colour unless
  you set it.
- `button`: `--danger` variant. It only sets the colour (text and border, or
  the fill when solid), so it combines with `--solid` and `--borderless`.
- `button`: public variables for custom variants: `--mdst-button-tone`,
  `--mdst-button-bg`, `--mdst-button-fg`, and `--mdst-button-border`.
- `button`: `--mdst-button-hover-shadow` sets the hover (any box-shadow), or
  `none` to switch hover off.
- `button`: `aria-pressed="true"` toggle state, and
  `aria-disabled="true"` for links styled as buttons. `<a class="mdst-button">`
  no longer shows an underline.

## [1.1.0] - 2026-09-23

### Added

- `banner`: full-width message strip for cookie consent, alerts, and
  announcements (`.mdst-banner`, `-content`, `-actions`, `-close`). Sits in the
  page flow by default; `--top` / `--bottom` stick it to the edge of a
  scrolling section, and `--fixed` pins it to the viewport — full width, or as
  a compact corner card with `--start` / `--end`. `--sm` gives a compact size.
  Visibility and variant use `data-state` and `data-variant`, matching Toast.
  Edge offset is configurable with `--mdst-banner-offset`, corner width with
  `--mdst-banner-width`. `--borderless` removes the border, and
  `--border-top` / `-bottom` / `-start` / `-end` keep only the listed edges
  (combinable), so pinned banners don't double up with their section's border.
- `meter`: styles the native `<meter>` element, classless and as `.mdst-meter`,
  with `--sm` / `--lg` sizes and a `--mdst-meter-height` property. The fill
  colour follows `low` / `high` / `optimum`: foreground when optimum, warning
  when sub-optimum, error when least optimum.
- `toolbar`: a wrapping row of controls (`.mdst-toolbar`, `-group`, `-spacer`,
  `-separator`) with `--bordered` and attached (segmented) groups via
  `.mdst-toolbar-group--attached`. Toggle buttons show their on state from
  `aria-pressed="true"`, and form controls inside size to their content.
- `typography`: classless and class styles for more inline tags: `abbr[title]`,
  `del`, `ins`, `s`, `cite`, `samp`, `var`, `sub` and `sup` (`.mdst-abbr`,
  `.mdst-del`, etc.). `sub` / `sup` no longer stretch the line height.

### Changed

- `typography`: inside `.mdst-ui`, bare `abbr[title]`, `del`, `ins`, `s`,
  `cite`, `samp`, `var`, `sub` and `sup` now pick up these styles by default
  (previously browser defaults). No classes or tokens were renamed or removed.

## [1.0.3] - 2026-07-17

### Changed

- Docs site: component pages use an `h1` title and a meta description; SEO
  pass with Open Graph image and JSON-LD; descriptions are HTML-escaped.
- Docs, README and `llms.txt` state explicitly that the npm package is
  `mdst-ui` (not the unrelated `modest-ui` package).

No stylesheet changes: the CSS in this release is identical to `1.0.2`.

## [1.0.2] - 2026-07-10

### Changed

- `tooltip` / `popover`: anchor positioning (`position-area`) is now guarded
  behind `@supports`, so browsers older than the Baseline (Chrome 129 /
  Firefox 147 / Safari 26) fall back to a centered popover instead of
  mispositioning.
- Examples grid: card preview media now matches the card's rounded top corners
  instead of overflowing them.
- README browser-support notes updated to match.

## [1.0.1] - 2026-07-10

### Added

- `LICENSE` file (MIT) so the licence ships in the npm tarball and renders on
  the npm and GitHub package pages.
- npm logo in the docs sidebar footer, linking to the package on npm.

### Changed

- Publish workflow now uses npm **Trusted Publishing** (OIDC) — no stored
  token; provenance is generated automatically.

No stylesheet changes: the CSS in this release is identical to `1.0.0`.

## [1.0.0] - 2026-07-10

First stable release, and the first published to npm.

### Added

- Published to npm as [`mdst-ui`](https://www.npmjs.com/package/mdst-ui)
  (the name matches the `.mdst-` class prefix; the project stays named
  modest-ui). Install with `npm install mdst-ui`.
- `exports` map so consumers can import the bundle
  (`mdst-ui/dist/modest-ui.css`), the entry (`mdst-ui`), design tokens
  (`mdst-ui/base/tokens.css`), and individual components
  (`mdst-ui/components/<name>/<name>.css`) with a stable, supported path.
- Package metadata for the registry: `repository`, `homepage`, `bugs`,
  `sideEffects`, and expanded `keywords`.
- `Publish to npm` GitHub Actions workflow that builds and publishes on every
  `v*` tag.
- Documented semantic-versioning / stability policy (this file) and a browser
  support statement in the README.

### Changed

- CDN examples now use the jsDelivr **npm** path
  (`cdn.jsdelivr.net/npm/mdst-ui@1/...`) instead of the `/gh/` path. The `/gh/`
  path still works for anyone who prefers it.

### Notes

- The class/token API is unchanged from `0.2.x` \u2014 upgrading is a drop-in
  stylesheet swap. The `1.0.0` bump reflects the stability commitment and the
  npm release, not a rewrite.

## [0.2.2] - Prior

- Pre-1.0 development releases, distributed via the jsDelivr `/gh/` CDN path
  and GitHub. See the git history for details.
