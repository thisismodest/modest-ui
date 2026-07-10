# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The public API is the set of CSS custom properties (`--mdst-*`) and class names
(`.mdst-*`) documented on [modest-ui.com](https://modest-ui.com) and in
`llms.txt`. Renaming or removing a documented token or class is a breaking
change; adding new ones is a minor change.

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
