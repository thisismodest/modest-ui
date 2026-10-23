# Security

modest-ui is CSS, published to npm as `mdst-ui` and served from CDNs. Its own site,
modest-ui.com, is built from this repository.

## Reporting a vulnerability

**Please don't describe it in a public issue.** Report it privately through GitHub:
the repository's **Security** tab → **Report a vulnerability**. Include what you found,
how to reproduce it, and what an attacker could do with it.

If that isn't offered, open an issue that says only that you have a security report
(no details), and the maintainer will arrange a private way to receive it.

You'll hear back within 5 working days. Once a fix is ready, it's released, an
advisory is published (crediting you, if you'd like), and the affected versions are
named.

## Supported versions

Only the latest release gets fixes.

## In scope

- Anything in the published package, or in the files a CDN serves from it, that
  isn't what this repository builds.
- CSS in the package that loads anything from elsewhere, or that could expose
  something on the page using it.
- A way to publish to npm, or change the site, without the maintainer.
- Scripts on modest-ui.com.

## How releases are made

- Published to npm only by the publish workflow, from a version tag on `main` that
  matches `package.json`, using npm's trusted publishing (no token is stored), with
  provenance linking each version to the commit and build that made it.
- Only the maintainer can create release tags, and `main` can't be force-pushed.
- GitHub Actions are pinned to exact commits, and CI installs development tools with
  their install scripts turned off.
- No runtime dependencies.
