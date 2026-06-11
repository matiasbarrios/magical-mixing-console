# Contributing

Thanks for your interest in Magical Mixing Console. This project is aimed at **developers** who want to explore, fork, or extend open-source digital mixers control.

The software is provided **as-is**, without warranty or support. Maintainers may not respond quickly — peer help in [Discussions](https://github.com/matiasbarrios/magical-mixing-console/discussions) is welcome.

## Where to talk

| Channel | Use for |
|---------|---------|
| [Discussions → Q&A](https://github.com/matiasbarrios/magical-mixing-console/discussions/categories/q-a) | Build setup, architecture, OSC/UDP, drivers |
| [Discussions → Ideas](https://github.com/matiasbarrios/magical-mixing-console/discussions/categories/ideas) | New mixers, drivers, features — before coding |
| [Discussions → Show and tell](https://github.com/matiasbarrios/magical-mixing-console/discussions/categories/show-and-tell) | Forks, experiments, integrations |
| [Issues](https://github.com/matiasbarrios/magical-mixing-console/issues) | Confirmed bugs and scoped feature work |
| [Pull requests](https://github.com/matiasbarrios/magical-mixing-console/pulls) | Code changes |

**General questions do not belong in Issues** — use Q&A instead.

## Before you code

1. Read [docs/development/DEVELOPMENT.md](docs/development/DEVELOPMENT.md) — clone, plugins, npm scripts.
2. Skim [docs/reference/ARCHITECTURE.md](docs/reference/ARCHITECTURE.md) — layers and where to change code.
3. For mixer domain terms: [docs/reference/CONCEPTS.md](docs/reference/CONCEPTS.md).
4. For network/OSC debugging: [docs/development/DEBUGGING_NETWORK.md](docs/development/DEBUGGING_NETWORK.md).

### Layer rule of thumb

| Change | Start in |
|--------|----------|
| New OSC parameter for a supported desk | `src/mixers/drivers/` |
| React hook for an existing driver feature | `src/mixers-react/` |
| UI screen or layout | `src/console/gui/` |
| Desktop sockets / Electron | `src/console/electron/` |
| Mobile sockets / Capacitor | `src/console/capacitor/` |
| New mixer family (large effort) | New driver under `src/mixers/drivers/` |

Upper layers import lower layers, never the reverse. `mixers` has no React dependency.

### Standalone Node.js library

If you only need X Air control from Node.js (no UI), see the sibling project [magical-mixers](https://github.com/matiasbarrios/magical-mixers).

## Development setup

```bash
git clone https://github.com/matiasbarrios/magical-mixing-console.git
cd magical-mixing-console
npm install
# Clone and build Capacitor plugins — see DEVELOPMENT.md
npm run electron-dev   # desktop
```

Virtual mixer (no hardware):

```bash
cd src/virtual-devices && npm run x18
```

## Tests

Run before opening a PR when your change touches tested code:

```bash
npm run lint
npm test
npm run test:integration   # mixers + virtual X18
```

Details: [docs/TESTING.md](docs/TESTING.md). Tests are manual today (no CI gate).

## Pull requests

- Keep PRs focused — one concern per PR when possible.
- Describe **what** changed and **why**.
- Note platform tested (Electron, Capacitor, or mixers-only).
- If you change OSC paths or driver behavior, mention desk/model tested (real or virtual X18).
- Forks that ship their own app builds should use their own name/logo and `appId` in `capacitor.config.json` (see README).

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
