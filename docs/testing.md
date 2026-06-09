# Testing

Guide to running and writing automated tests in Magical Mixing Console. Tests are triggered **manually**; they do not run in pre-commit or CI.

---

## Why

We refactor often and sometimes touch low layers (OSC, drivers, hooks). Tests give quick feedback on whether we broke something without launching the app or a real desk.

---

## Stack

| Tool | Use |
|------|-----|
| [Vitest](https://vitest.dev/) | Test runner (unit + mixers integration) |
| [Playwright](https://playwright.dev/) | Electron E2E (CDP over `electron-forge start`) |
| [happy-dom](https://github.com/capricorn86/happy-dom) | Lightweight DOM for React hooks and components |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | `renderHook`, `render`, queries |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | DOM matchers (`toBeInTheDocument`, etc.) |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | Parse JSX in tests |

Vitest shares infrastructure with Vite, but **does not replace Webpack**: the Electron/Capacitor build stays the same. Vitest only transforms modules when running tests.

---

## Test pyramid

```
        /   E2E (Playwright)   \     Electron dev + GUI (few smoke tests)
       /------------------------\
      /  Mixers+VD integration   \   virtual X18, real OSC session (localhost)
     /----------------------------\
    /   Unit: mixers, gui, hooks   \   Fast, no network — highest volume
   /________________________________\
```

| Level | What it validates | Command |
|-------|-------------------|---------|
| **Unit** | Helpers, OSC, driver schemas, React hooks | `npm test` |
| **Integration** | `mixers` search/connect against virtual device | `npm run test:integration` |
| **E2E** | Electron + React: virtual X18 visible on connect | `npm run test:e2e` |
| **Manual** | Real or virtual desk outside Vitest | `npm run connectivity-test` in `src/mixers` |

---

## `tests/` convention

Tests live in **`tests/`** at the repo root and **mirror the `src/` structure** (without the `src/` prefix):

| Source code | Unit test | Integration test |
|-------------|-----------|------------------|
| `src/mixers/helpers/values.js` | `tests/mixers/helpers/values.js` | — |
| `src/mixers/helpers/osc.js` | `tests/mixers/helpers/osc.js` | — |
| `src/mixers/drivers/xair/device/bus/color.js` | `tests/mixers/drivers/xair/device/bus/color.js` | — |
| `src/mixers/` (full session) | — | `tests/mixers/integration/connect.js` |
| `src/mixers/drivers/xair/device/bus/` | — | `tests/mixers/integration/bus/channel.js` |
| `src/mixers-react/helpers/stableIds.jsx` | `tests/mixers-react/helpers/stableIds.jsx` | — |
| `src/console/gui/helpers/foundDevices.js` | `tests/console/gui/helpers/foundDevices.js` | — |

**File names:**

- Unit: same name as the module under `tests/` (no `.test` suffix)
- Integration: under `tests/**/integration/` (excluded from `npm test` by folder, not by name)
- Test helpers (not specs): `tests/helpers/`, `tests/**/integration/**/setup.js`

**Imports** — same workspace aliases as production (`vitest.config.mjs`):

```js
import { isInt } from '@magical-mixing/mixers/helpers/values.js';
import { x18Run } from '@magical-mixing/virtual-devices/x18/run/index.js';
```

**Shared test helpers** (do not mirror `src/`): `tests/helpers/` — e.g. `nodePlatform.js` (Node UDP + LAN limited to `127.0.0.1` for deterministic integration).

Respect layers: GUI tests do not implement OSC; `mixers` tests do not import React unless unavoidable.

---

## Commands

From the repo root:

| Command | Use |
|---------|-----|
| `npm test` | Unit — fast, no UDP |
| `npm run test:integration` | Mixers integration + virtual device |
| `npm run test:e2e` | Electron E2E (starts `electron-forge start` in E2E mode) |

**When to run what:**

- Refactor in helpers/drivers → `npm test`
- Changes in search, connect, session, UDP in `mixers` → `npm run test:integration` in addition to unit tests
- GUI / Electron / connect screen flows → `npm run test:e2e`
- Before a release or large merge → all three

Config: [`vitest.config.mjs`](../vitest.config.mjs) (unit) · [`vitest.config.integration.mjs`](../vitest.config.integration.mjs) (integration) · [`playwright.config.mjs`](../playwright.config.mjs) (E2E) · setup: [`tests/setup.js`](../tests/setup.js).

### Targeted commands (no script in `package.json`)

Useful when iterating on an area or debugging:

| Goal | Command |
|------|---------|
| Unit watch mode | `npx vitest` |
| Only `tests/mixers/` | `npx vitest run tests/mixers` |
| Only `tests/mixers-react/` | `npx vitest run tests/mixers-react` |
| Only `tests/console/` | `npx vitest run tests/console` |
| Only `tests/virtual-devices/` | `npx vitest run tests/virtual-devices` |
| Integration watch mode | `npx vitest --config vitest.config.integration.mjs` |
| E2E with app already open | `MMC_E2E_ATTACH=1 npx playwright test` |
| See the app in E2E mode (manual) | `MMC_E2E=1 MMC_E2E_CDP_PORT=9222 npx electron-forge start` |
| Single E2E spec | `npx playwright test tests/e2e/electron/connect.spec.js` |

`npm run test:e2e` starts Electron in dev (no production bundle or obfuscation). The first run may take a while while Webpack compiles; subsequent runs are much faster.

Local Playwright artifacts (`test-results/`, `playwright-report/`) are generated automatically and are in `.gitignore`.

---

## Adding a test

### Pure helper (Node environment, default)

```js
// tests/mixers/helpers/values.js
import { describe, it, expect } from 'vitest';
import { isInt } from '@magical-mixing/mixers/helpers/values.js';

describe('isInt', () => {
    it('accepts integers', () => {
        expect(isInt(3)).toBe(true);
    });
});
```

### React hook or component

First line of the file:

```js
// @vitest-environment happy-dom
```

### Integration with virtual device

Shared helpers: [`tests/helpers/integration.js`](../tests/helpers/integration.js) (`connectToVirtualX18`, `featureGet`).

Base pattern (`tests/mixers/integration/connect.js`):

1. `beforeAll`: `createNodePlatform()` → `mixersInitialize(platform)` → `x18Run({ ip: '127.0.0.1', port, platform })`
2. `connectToVirtualX18()` → assert session / keepalive
3. `afterAll`: `x18Stop()` + `device.dispose()` in each test

In bus suites, use `useVirtualX18()` from `tests/mixers/integration/bus/setup.js` instead of repeating bootstrap.

OSC read/set pattern (`tests/mixers/integration/bus/channel.js`):

1. Connect with `connectToVirtualX18()`
2. For each bus parameter (name, color, mute, polarity, pan, level, gate, EQ, compressor, low cut…): `featureGet` → assert initial value from virtual desk
3. `setAndReadBack(device, feature, ids, value)` — SET over UDP, wait `OSC_SETTLE_MS` (avoids simulator flood warnings), `cacheClear()`, GET over UDP for confirmation

Helper: `setAndReadBack` in [`tests/helpers/integration.js`](../tests/helpers/integration.js).

Use **localhost** and a dedicated port (e.g. `50124`) to avoid clashing with a virtual desk on `10024` or with hardware.

### Electron E2E

Specs in `tests/e2e/electron/`. `globalSetup` launches `electron-forge start` with `MMC_E2E=1`; Playwright connects via CDP (port `9222`). The test virtual X18 runs in the Vitest/Playwright process (port `10024`, the one used by the connect page broadcast).

First smoke test: [`tests/e2e/electron/connect.spec.js`](../tests/e2e/electron/connect.spec.js) — heading “Devices found”, row `Behringer X18` / `127.0.0.1 | X18-DEMO`, Connect button.

---

## What not to test yet

- Capacitor and native plugins (real UDP socket on mobile)
- Packaged E2E (DMG/installer) — today only dev via Forge
- Physical desk in CI (manual `connectivity-test` probe remains available)

---

## Roadmap

### Short term (next iterations)

- More unit tests in `mixers`: more X Air driver factories, `scale.js`, OSC edge cases
- Unit tests in `console/gui`: `busTypeOrder`, `biquad`, `values` (dB)
- `mixers-react` hooks with mocked `feature` (`vi.mock`)
- More suites under `tests/mixers/integration/` (e.g. scene, configuration)

### Medium term

- GUI components with `render()` and minimal providers (mocked mixers-react)
- XR12 virtual integration (same pattern as X18)
- Optional coverage: `vitest run --coverage` without strict thresholds
- Team rule: **every refactor bug → one test** that covers it

### Long term

- Manual CI (`workflow_dispatch`): `npm test` + `npm run test:integration` + `npm run test:e2e`
- More E2E smoke tests (connect → edit bus name, etc.)
- Separate integration/E2E job in CI (slower, localhost port)

### Out of scope for now

- Pre-commit / pre-push with tests
- Coverage gates that block merge
- Electron/Capacitor adapter tests without heavy mocks
