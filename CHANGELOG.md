# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The public API is the set of CSS custom properties (`--mdst-*`) and class names
(`.mdst-*`) documented on [modest-ui.com](https://modest-ui.com) and in
`llms.txt`. Renaming or removing a documented token or class is a breaking
change; adding new ones is a minor change.

## [Unreleased]

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
