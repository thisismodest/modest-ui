# Contributing to modest-ui

modest-ui is open to contributions. Whether it's a bug fix, new component, documentation improvement, or design suggestion — all help is appreciated.

All technical rules — naming, CSS patterns, classless defaults, preview format — live in [CONVENTIONS.md](CONVENTIONS.md). Read that before writing code.

## Getting Started

```bash
git clone https://github.com/thisismodest/modest-ui.git
cd modest-ui
npm install
npm run dev
```

Then open [http://localhost:8000](http://localhost:8000) to browse components locally.

## Adding a Component

1. Create a folder in `components/` with CSS, `preview.html`, and optional `config.js`
2. Add the import to `index.css`
3. Run `npm run generate` to update the sidebar and class names
4. Run `npm run build` to bundle CSS to `dist/`
5. Test it across themes

See [CONVENTIONS.md](CONVENTIONS.md) for the full specification on naming, structure, classless defaults, and preview format.

## Pull Requests

- **One component or one fix per PR.** Small PRs are easier to review and merge.
- **Include `preview.html` updates.** Every component needs a working preview.
- **Test across themes.** Default, dark, and custom token overrides.
- **Follow existing patterns.** Look at how existing components are structured.
- **Write a clear description.** Explain what, why, and include screenshots for visual changes.

## Filing Issues

### Bug reports

- Describe what you expected vs. what happened
- Include a minimal reproduction
- Note your browser and OS
- Include screenshots for visual bugs

### Feature requests

- Describe the use case
- Show the HTML you'd want to write
- Check the [ROADMAP.md](ROADMAP.md) first — it might already be planned

## Community

- **GitHub Discussions** for questions, ideas, and conversation. Issues are for bugs and feature requests.
- **Be patient** — this is a small project. PRs and issues will be reviewed, but it might take a few days.
- **Be respectful.** Assume good intent, give helpful feedback, treat everyone with respect.
