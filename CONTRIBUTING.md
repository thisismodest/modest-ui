# Contributing to modest-ui

modest-ui is open to contributions. Whether it's a bug fix, new component, documentation improvement, or design suggestion — all help is appreciated.

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/thisismodest/modest-ui.git
cd modest-ui
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the dev server**

```bash
npm run dev
```

Then open [http://localhost:8000](http://localhost:8000) to browse components locally.

## How to Add a Component

The full specification lives in [CONVENTIONS.md](CONVENTIONS.md) — read that for the complete picture. Here's the quick version:

1. **Create a folder** in `components/` with your component name:

```
components/
└── my-component/
    ├── my-component.css
    ├── preview.html
    └── config.js        (optional — for generate script overrides)
```

2. **Write the CSS** — use design tokens, native CSS nesting, and BEM naming with the `mdst-` prefix. If the component maps to a native HTML element, include classless defaults using `:where(.mdst-ui)`.

3. **Write the preview** — follow the preview.html format documented in CONVENTIONS.md. Include examples for every variant, state, and size.

4. **Add the import** to `index.css`:

```css
@import "./components/my-component/my-component.css";
```

5. **Generate and build**:

```bash
npm run generate  # Updates sidebar and class names in index.html
npm run build     # Bundles CSS to dist/
```

6. **Test it** — check your component in the local preview, try it across themes, and make sure it doesn't break existing components.

## Code Style

See [CONVENTIONS.md](CONVENTIONS.md) for the full specification. The essentials:

- **Design tokens** — always use CSS custom properties from `base/tokens.css` for colors, spacing, radii, and typography. Never hardcode values.
- **Native CSS nesting** — each component should have a single top-level selector with everything nested inside it.
- **BEM naming with `mdst-` prefix** — blocks are `.mdst-component`, elements are `.mdst-component-child`, modifiers are `.mdst-component--variant`.
- **Classless defaults** — if your component maps 1:1 to a native HTML element, add `:where(.mdst-ui) element` selectors alongside the class-based selectors.
- **No JavaScript required** — components should be CSS-only. For stateful components, use data attributes (`data-state`, `data-variant`) and let the consumer provide their own JS.

## Pull Request Guidelines

- **Keep PRs focused.** One component or one fix per PR. Small PRs are easier to review and merge.
- **Include `preview.html` updates.** Every component needs a working preview. If you're modifying an existing component, update the preview to reflect your changes.
- **Test across themes.** Make sure your component looks correct with the default theme and with custom token overrides (light, dark, colored).
- **Follow existing patterns.** Look at how existing components are structured and match that convention.
- **Write a clear description.** Explain what the PR does, why it's needed, and include screenshots if it's a visual change.
- **Don't bundle unrelated changes.** If you notice something else to fix while working, open a separate PR for it.

## Filing Issues

Good bug reports and feature requests make a huge difference.

### Bug reports

- **Describe what you expected** vs. what actually happened
- **Include a minimal reproduction** — a code snippet, a link, or steps to reproduce
- **Note your browser and OS** — CSS rendering can vary
- **Include screenshots** if it's a visual bug

### Feature requests

- **Describe the use case** — what are you building and what's missing?
- **Show an example** of the HTML you'd want to write
- **Check the [ROADMAP.md](ROADMAP.md)** first — it might already be planned

## Community

- **GitHub Discussions** — use Discussions for questions, ideas, and general conversation about modest-ui. Issues are for bugs and specific feature requests.
- **Be patient** — this is a small project maintained in spare time. PRs and issues will be reviewed, but it might take a few days.

## Code of Conduct

Be respectful. Be constructive. Be kind.

We're all here to build something useful. Assume good intent, give helpful feedback, and treat every contributor — regardless of experience level — with respect. Harassment, personal attacks, and exclusionary behavior are not tolerated.
