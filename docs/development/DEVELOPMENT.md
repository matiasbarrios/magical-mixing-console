# Development — setup and day-to-day

Guide to clone the repo, install dependencies, and run the app on each platform.

---

## Requirements

- **Node.js 24**
- **git**
- **npm** (bundled with Node)

Additional tools depending on what you build:

| Target | Tools |
|--------|-------|
| Desktop (Electron) | macOS, Windows, or Linux |
| iOS | macOS, Xcode, [CocoaPods](#ios--cocoapods) |
| Android | Android Studio |

---

## First clone

```bash
git clone https://github.com/matiasbarrios/magical-mixing-console.git
cd magical-mixing-console
npm install
```

Capacitor plugins are **not versioned in this repo** but referenced as local dependencies (`file:plugins/...`). Clone and build them on any machine where you run `npm install` or `electron-make-*`. Electron does not use them at runtime; they are for the mobile bundle, but the bundler still resolves them.

Install once per machine:

### capacitor-udp-socket

```bash
git clone https://github.com/matiasbarrios/capacitor-udp-socket.git plugins/capacitor-udp-socket
cd plugins/capacitor-udp-socket
npm install
npm run build
cd ../..
```

### capacitor-navigation-bar

```bash
git clone https://github.com/matiasbarrios/capacitor-navigation-bar.git plugins/capacitor-navigation-bar
cd plugins/capacitor-navigation-bar
npm install
npm run build
cd ../..
```

If `plugins/` exists but is broken, delete the plugin folder and clone again.

After updating a plugin, run `npm run build` inside it and, for mobile, `npm run cap-dev` or `cap-make` as needed.

---

## npm scripts

From the repo root:

| Command | Use |
|---------|-----|
| `npm run electron-dev` | Desktop app in development (Electron Forge) |
| `npm run cap-dev` | Web bundle + `cap sync` for mobile (development) |
| `npm run cap-make` | Production web bundle + `cap sync` |
| `npm run cap-android` | Open Android Studio (after `cap add android`) |
| `npm run cap-ios` | Open Xcode (after `cap add ios`) |
| `npm run cap-assets` | Regenerate Capacitor icons/splash |
| `npm run electron-make-arm64` | Package desktop app (macOS arm64) |
| `npm run electron-make-x64` | Package desktop app (macOS/Windows/Linux x64) |
| `npm run lint` | ESLint on `./src` and `./tests` |
| `npm test` | Unit tests (Vitest) — see [TESTING.md](../TESTING.md) |
| `npm run test:integration` | Mixers + virtual X18 integration — see [TESTING.md](../TESTING.md) |

---

## Mobile — native projects not versioned

The `android/` and `ios/` folders are **not** in the repo on purpose. Each fork should use its own app id and signing credentials so published apps do not collide.

Before building for mobile:

1. Set `appId` and `appName` in [`capacitor.config.json`](../../capacitor.config.json) if you fork and publish your own build (defaults use `com.opensource.magicalmixing.console` / `Open-Sourced Magical Mixing Console` so they do not collide with the commercial app).
2. Run `npm run cap-make`.
3. Add native projects: `npx cap add android` and/or `npx cap add ios`.
4. Configure signing in Android Studio / Xcode for your own store accounts.

---

## Code layers

Do not import GUI from `mixers`. Summary:

| Layer | Path |
|-------|------|
| UI | `src/console/gui/` |
| Electron / Capacitor (platform) | `src/console/electron/`, `src/console/capacitor/` |
| React hooks | `src/mixers-react/` |
| OSC drivers | `src/mixers/` |
| Virtual mixer (dev) | `src/virtual-devices/` |

Details: [ARCHITECTURE.md](../reference/ARCHITECTURE.md), domain terms: [CONCEPTS.md](../reference/CONCEPTS.md).

### npm workspaces

The root declares `"workspaces": ["src/*"]`:

| Folder | npm name | Role |
|--------|----------|------|
| `src/mixers/` | `@magical-mixing/mixers` | OSC drivers, device search, protocol |
| `src/mixers-react/` | `@magical-mixing/mixers-react` | React hooks over mixers |
| `src/console/` | `@magical-mixing/console` | App (GUI + electron/capacitor) |
| `src/virtual-devices/` | `@magical-mixing/virtual-devices` | Simulated X18 for dev |

After `npm install`, `node_modules/@magical-mixing/mixers` is a **symlink** to `src/mixers`. Edits under `src/mixers/` are picked up immediately without `npm update`.

The app imports `@magical-mixing/mixers` / `mixers-react` in code; do not import `src/mixers/...` paths directly.

The version in `src/mixers/package.json` is the **npm package** version, separate from the app version in the root `package.json`.

The public library repo is [magical-mixers](https://github.com/matiasbarrios/magical-mixers). It uses a different layout and git history from this monorepo; changes here are not published there automatically.

---

## iOS — CocoaPods

Before iOS work (or if `pod install` fails in `ios/`):

```bash
brew install cocoapods
```

Then, after `npm run cap-dev` or `cap-make`, open Xcode with `npm run cap-ios`.

If Archive → App Store upload fails oddly, try removing Homebrew's `rsync` (it can shadow Xcode's):

```bash
brew uninstall rsync
```

---

## Android — Logcat filter

Useful filter in Android Studio:

```
package:mine level:info
```

---

## Network debugging (OSC / UDP)

Wireshark filters for lab and X Air traffic: [DEBUGGING_NETWORK.md](./DEBUGGING_NETWORK.md). Socket architecture: [CONNECTIVITY.md](../reference/CONNECTIVITY.md).

---

## Related docs

| Doc | Content |
|-----|---------|
| [DEBUGGING_NETWORK.md](./DEBUGGING_NETWORK.md) | Wireshark |
| [HOTKEYS.md](./HOTKEYS.md) | Configurable keyboard shortcuts |
| [GUI.md](../gui/GUI.md) | UI conventions |
| [LAYOUT.md](../gui/LAYOUT.md) | Page shells, header trail, entity view layout |
| [LIST_PATTERN.md](../gui/LIST_PATTERN.md) | List patterns |
| [TESTING.md](../TESTING.md) | Test layout and scripts |
