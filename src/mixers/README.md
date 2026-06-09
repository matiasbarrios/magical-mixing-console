# @magical-mixing/mixers

Platform-agnostic JavaScript library for discovering and controlling digital mixers over OSC/UDP.

No React, no UI, no native I/O — the host app injects UDP and LAN helpers via `mixersInitialize()`. In MMC this package sits under `mixers-react` and the console; see [Architecture](../../docs/reference/ARCHITECTURE.md) for the full stack.

## What it owns

| Area | Path | Role |
|------|------|------|
| Search & device lifecycle | `devices/` | Find desks, connect, online/halt, dispose |
| UDP OSC controller | `controllers/udpOSC/` | Cache, paced send queue, subscriptions |
| Drivers | `drivers/xair/` | X-Air family: buses, inputs, FX, scenes, … |
| Helpers | `helpers/` | OSC, scales, pan/level math, sanitization |
| API schema | `definition.json` | Shape of the `features` tree (reference) |

## Public entry point

```js
import { mixersInitialize, searchNew, oscFromBuffer, oscToBuffer } from '@magical-mixing/mixers';
```

1. Call **`mixersInitialize(platform)`** once at startup with UDP + LAN callbacks.
2. Use **`searchNew()`** to discover devices and **`device.initialize()` / `device.connect()`** to open a session.
3. Read and write parameters through **`device.features`**.

### Platform contract

`mixersInitialize` expects:

- `getLANBroadcastAddress`, `getLocalAddressForIP`
- `udpSocketOpen`, `udpSocketClose`, `udpMessageSend`, `onUDPMessageReceived`

Electron and Capacitor adapters live in `src/console/`; for Node scripts see `examples/manual-connect-test-cli.js`.

## Feature API

Each driver exposes a **`features`** object. Parameters follow the same pattern everywhere:

| Method | Purpose |
|--------|---------|
| `has(…ids, callback)` | Whether the parameter exists for this desk/model/context. Calls `callback(boolean)`. |
| `read(…ids)` | Synchronous read from cache (may be `undefined` until fetched). |
| `get(…ids, callback)` | Subscribe to updates; returns an unlisten function. |
| `set(…ids, value)` | Write to the desk (paced through the send queue). |
| `options(…ids)` | Valid choices (buses, enums, FX types, …). |

Domain values use human units (dB, Hz, 0–100, booleans). Drivers translate to/from wire format (OSC decimals, binary flags) internally.

### Stubs vs desk-backed features

Some features are **stubs** — they report `has: false` because the desk has no OSC path (e.g. `bus.icon`, `input.name`). MMC stores those in the app **fallback/vault** layer instead. Do not implement stubs unless the protocol actually supports them.

Real examples: `bus.name`, `bus.level`, `input.gain`, `scene.load`.

## Layout (driver work)

New desk parameter — **mixers → mixers-react → gui** (in that order):

1. Add OSC read/write in `drivers/xair/device/…` using `read`, `get`, `set` from the controller.
2. If the logical parameter maps to **several OSC paths** and `read` composes them, use **`setBatch`** from the controller (see [Composite reads](#composite-reads-setbatch--post-set-stale-grace)).
3. Use `helpers/scale.js` for linear/log mappings (not d3).
4. Expose `minimum` / `maximum` / `options` on the feature object when the UI needs them.
5. Add a hook in `mixers-react`, then wire the GUI.

Supported models are filtered in driver `options` (e.g. `optionsForModel(model)` on buses and inputs).

## Internal pieces worth knowing

### Send pacing (`controllers/udpOSC/sendQueue.js` + `index.js`)

Outbound OSC is paced (~5 ms between messages) so bursts do not choke the desk. There are **two lanes**:

| Path | Used for | Behaviour |
|------|----------|-----------|
| **`send()`** | `set()`, `setBatch()`, subscriptions, unsubscribe, bulk writes | Strict **FIFO queue** — one message at a time, 5 ms apart. Prevents write bursts during reset, scene apply, etc. |
| **`sendFetch()`** | Cache **reads** triggered by `get()` / `valueFetch` / `keepFresh` | **Scheduled timers** (~5 ms apart). At most **one pending GET per OSC address** — remount/keepFresh duplicates for the same path are ignored until the scheduled send runs. |
| **`sendImmediate()`** | Session keepalive (`/xremotenfb`, `/status`), etc. | Bypasses both lanes. Drivers choose when to use it. |

`set()` and `setBatch()` differ in **when listeners fire** (see [Composite reads](#composite-reads-setbatch--post-set-stale-grace) below). Both still pace outbound OSC through `send()`.

`features.sendQueueDrained()` waits only for the **`send()` queue** — used after bulk reset before `cacheRefetch()`. `features.sendQueueOutstanding()` returns queued plus in-flight paced sends (for unified bulk-apply progress). On `close()`, the controller waits for that queue to drain so unsubscribe messages are not dropped.

### Composite reads (`setBatch` + post-set stale grace)

Some desk parameters are **one logical value** spread across several OSC paths. The driver exposes a single `read`/`get`/`set` that composes them. Example: X18 bus input id — `rtnsw` decides whether `insrc` or `rtnsrc` is active (`drivers/xair/device/bus/input.js`).

#### The race

1. **`set()` called twice in a row** (e.g. `rtnsw` then `insrc`): each call updates cache and notifies listeners immediately. After the first call, a composite `read()` sees only half the new state → UI flicker or wrong value.
2. **Stale background GET after `set()`**: `get()` uses stale-while-revalidate — on remount it shows cache, then fires one background GET. If that GET returns the desk’s *previous* value (desk still applying, or request sent before the write landed), listeners overwrite the optimistic cache → assigned row disappears until tab remount.

#### `setBatch(entries)`

Controller API (same entry shape as `set`: `{ address, value, translateValue?, omitCache?, cacheKey? }`):

1. Write **all** wire values to cache (`fromSet: true` on each).
2. Queue **all** OSC messages through the paced `send()` queue.
3. Notify listeners **once per address**, after every cache entry is coherent.

Use in drivers when a composite `read` depends on multiple paths updated together. Current call sites:

| Driver | Composite value | OSC paths |
|--------|-----------------|-----------|
| `bus/input.js` `id.set` | Bus input id | `preamp/rtnsw` + `config/insrc` or `config/rtnsrc` (X18) |
| `configuration/networkLan.js`, `networkWifiClient.js` `setIP` | IP string | four octet addresses `…/0` … `…/3` |
| `fx/insert.js` `assignmentSet` | FX insert bus | unassign previous `insert/sel` + assign new (when moving) |

Single-path writes keep using `set()` only. `setBatch` is opt-in — passed from `xAirDeviceNew` into the feature factories that need it.

#### Post-set stale grace (`SET_STALE_GRACE_MS`)

After any local `set()` / `setBatch()` entry, the cache records `setAt` and `setWireValue`. For **`SET_STALE_GRACE_MS`** (300 ms, tunable in `cache.js`), inbound GET responses on that address that **disagree** with the last local wire value are ignored for `get()` listeners. Local echo (`origin: 'local'`) is never filtered.

This covers the background-fetch race without blocking multi-operator sync for seconds: another console moving the same fader can update this client once the grace window passes. **`setBatch` fixes composite coherence; stale grace fixes single-path optimistic cache vs late GET.**

Subscriptions and non-listener paths are unaffected.

### Cache (`controllers/udpOSC/cache.js`)

`get()` populates cache on first fetch; on remount with a cached value it calls back immediately then sends one background GET without clearing cache (`valueFetch` `background: true`); `set()` stores **wire** values (native OSC) and notifies subscribers optimistically via the same path as an inbound message (with post-set stale grace above). Drivers translate wire ↔ domain (dB, booleans, bit masks). For shared bitmask addresses (e.g. `/grp/dca`), cache holds the full mask; per-bit features project in `read`/`get` callbacks — do not use `get(..., translate)` on those keys or the mask is overwritten. Entries are **frozen** when no React hook listens anymore (LRU eviction only); `cacheRefetch()` can still skip frozen by default. **`keepFresh`** (`cache.js`) proactively re-fetches GET keys on a fixed budget — UDP may miss updates, so frozen entries are included. Every `CACHE_KEEP_FRESH_TICK_MS` (10s) it refetches the oldest `keepFreshQuotaPerTick` entries (~18 for 512 entries / 5 min staleness). Paused while the app is `halt()`ed. Tunables (private constants at top of `cache.js`): `CACHE_KEEP_FRESH_TICK_MS`, `CACHE_KEEP_FRESH_MAX_STALENESS_MS`, `SET_STALE_GRACE_MS`. The cache is capped (512 entries by default): when full, the oldest frozen entry is evicted and its idle OSC listener removed. `cacheRefetch({ purgeFrozen: true })` drops all historical entries at once. `cacheClear()` on disconnect.

### Scales (`helpers/scale.js`)

Small `scaleLinear` / `scaleLog` helpers (d3-compatible API: `.domain()`, `.range()`, `.clamp()`, `.invert()`). Used only for wire ↔ domain conversion in drivers.

## Testing without the full app

**Connectivity probe** (Node + virtual UDP helpers):

```bash
cd src/mixers
npm run connectivity-test
# or with target:
node ./examples/manual-connect-test-cli.js 192.168.1.21 10024
```

**Simulated desk** (from the repo root, with the app or virtual-devices):

- Run X18 or XR12 demo from the connect screen, or `npm run x18` / `npm run xr12` under `src/virtual-devices/`.

## Regenerating `definition.json`

The committed file is a **reference schema** for the `features` tree. To refresh it from a live device object:

1. In `devices/device.js`, uncomment `definitionDownload(n)` inside `initialize`.
2. Connect a desk in the app (or a test script that builds a full device).
3. Save the downloaded JSON over `definition.json`.
4. Re-comment the call.

Or import `definitionDownload` from `helpers/definition.js` in a one-off script.

## Dependencies

This package has **no runtime npm dependencies**. The MMC app root still depends on d3 for GUI charts and knobs; that stays in `console/gui`.

---

## License

Apache License 2.0 © 2025-2026 Matías Barrios — Piriápolis, Uruguay — matias@magicalmixingconsole.com
