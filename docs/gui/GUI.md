# Console GUI — Guidelines

Guidelines for working in `src/console/gui/`. For layer boundaries see [ARCHITECTURE.md](../reference/ARCHITECTURE.md). For mixer vocabulary see [CONCEPTS.md](../reference/CONCEPTS.md). For page shells, header, and tabs see [LAYOUT.md](./LAYOUT.md).

---

## Golden rule: subscriptions cost money

Every `useBus*`, `useInput*`, etc. hook from `@magical-mixing/mixers-react` may register **live subscriptions** to mixer state (OSC/UDP under the hood). Subscriptions are created on mount and **must** be removed on unmount.

The stack:

```
GUI hook (useBusLevel)
  → mixers-react (useHasGetSet / useGet)
    → driver feature.get(id, callback)  → returns unlisten()
    → driver feature.has(id, callback)  → returns unlisten()
```

Implementation reference:

- `src/mixers-react/helpers/hasGetSet.jsx` — subscribe in `useEffect`, cleanup in return
- `src/mixers-react/helpers/get.jsx` — same pattern
- `src/mixers-react/helpers/feature.js` — `readGet` = initial read + ongoing `get` listener

**Treat every hook call as a potential UDP listener.** The codebase was optimized so that mounting/unmounting these hooks is minimized. New GUI code must preserve that.

---

## Do

### Use hooks inside stable child components

Each row, cell, or control that needs live data should be its **own component** so subscriptions are tied to that instance lifecycle.

```jsx
// ✅ Each visible row owns its subscriptions
const BusRow = ({ busIdFrom, busIdTo }) => {
    const { has, value, set } = useBusToLevel(busIdFrom, busIdTo);
    if (!has) return null;
    return <MeterSlider value={value} set={set} />;
};
```

### Limit mounted rows in large lists

Lists of buses, sends, assignments, etc. must not mount a subscribed row per item unconditionally. Use the **Evaluator pattern**:

1. A lightweight **Evaluator** child runs cheap hooks to decide visibility (e.g. `inMix`, stereo-link right channel).
2. The heavy **Row** component mounts only when the evaluator passes — unmount when filtered out.

```
ListStack
  → Evaluator (cheap hooks: useBusToInMix, useBusStereoLink, …)
  → Row (meter, pan, level hooks) only when visible
```

Reference: `ToEvaluator` / `FromEvaluator` in `pages/bus/view/fromTo/to.jsx` and `from.jsx`; assignment tabs in `pages/dca/view/buses.jsx`, `pages/input/view/buses.jsx`.

Bus Gate/Compressor use **local in-tab pagination** (`pages/bus/view/gate/pagination.jsx`) for parameter panels — separate from list rows.

### Memoize stably

Patterns used throughout the GUI:

- `useMemo` for `context` objects passed to list renderers (`{ busIdFrom: busId }`)
- `useMemo` for filtered/sorted `elements` arrays
- `useCallback` for handlers passed to children
- Module-level child components (not defined inside render)

Unstable object/array props cause remounts → subscription churn.

### Guard with `has`

Always `if (!has) return null` (or render nothing) so components do not keep subscriptions for unsupported features.

### Batch writes

Multi-parameter edits use `ChangesProvider` / `useChanges()` so OSC writes are queued, not fired ad hoc from random UI code.

---

## Don't

### Call mixer hooks in a loop at the parent level

```jsx
// ❌ N subscriptions whenever parent re-renders
buses.map(bus => {
    const { value } = useBusLevel(bus.id);  // Rules of Hooks violation + churn
    ...
});
```

### Inline component definitions in render

```jsx
// ❌ New component type every render → unmount/remount → resubscribe
return items.map(item => {
    const Row = () => { const { value } = useBusLevel(item.id); ... };
    return <Row key={item.id} />;
});
```

Define row components at module scope (see `fromTo/to.jsx`: `Bus`, `Evaluator`).

### Render unbounded lists of subscribed rows

A From/To matrix could be dozens of buses × several hooks each. Without pagination, that is hundreds of simultaneous UDP subscriptions.

### Toggle visibility with CSS only while keeping hooks mounted

Prefer unmounting (conditional render) or pagination over `display: none` on a tree full of subscribed components — unless the component is intentionally always mounted.

### Add new hooks in mixers-react from GUI work

If a control needs data, use an **existing** hook. Missing hook = lower-layer work (`mixers` driver first). See [ARCHITECTURE.md](../reference/ARCHITECTURE.md).

---

## File placement (recap)

| What | Where |
|------|--------|
| Screen / route page | `pages/<entity>/list.jsx`, `pages/<entity>/view/index.jsx` |
| Single parameter control | `pages/<entity>/view/<param>.jsx` |
| Reusable widget (no mixer hook) | `components/base/` |
| Offline DCA/MG UI state | `components/fallback/` |
| Route definition | `routes/<entity>.jsx` |

Copy an existing similar file before inventing structure.

---

## Bus send matrix (From / To)

See **[CONCEPTS.md](../reference/CONCEPTS.md)** → *Signal routing: From and To* → *Active sends (“in mix”)* for domain rules (on vs level-only routes, off threshold, +/− behavior).

| File | Role |
|------|------|
| `pages/bus/view/fromTo/busToLevelMix.js` | Thresholds: off/on boundary, assignable slider minimum, default level on enable |
| `pages/bus/view/fromTo/useBusToInMix.jsx` | `inMix`, `addToMix`, `removeFromMix` from live `useBusToOn` / `useBusToLevel` |
| `pages/bus/view/fromTo/level.jsx` | Sends level slider: linear range from assignable minimum when route has no `on` |
| `pages/bus/view/fromTo/to.jsx`, `from.jsx` | Sends / Reception lists; Evaluator mounts rows only when `inMix === true` |
| `pages/wizard/setupNew/sendApply.jsx` | Wizard applies the same enable/disable levels as the bus screen |

**Evaluator pattern:** `ToEvaluator` / `FromEvaluator` call `useBusToInMix` (cheap) before mounting `ToRow` / `FromRow` (meter, pan, tap hooks).

---

## Fallback vs live hooks

`components/fallback/` holds **local UI state** for DCA and mute groups when editing offline or without full device features. Use fallback hooks/components only for that domain. Live mixer parameters always go through `mixers-react`.

---

## i18n

- User-visible strings: `useLanguage()` / `t('…')`
- Add keys to `components/language/translations/es.js` (and index)
- Domain terms (bus, DCA, FX, phantom, compressor, threshold, etc.) stay **English** in `es.js` — only general UI chrome is translated

---

## Navigation work

When redesigning navigation, read [CONCEPTS.md](../reference/CONCEPTS.md) first. Full layout map: [LAYOUT.md](./LAYOUT.md). Quick pointers:

- Routes: `routes/index.jsx`
- App shell: `components/layout/index.jsx`
- Header menu: `components/layout/header/menu/`
- Header trail + prev/next: `components/layout/headerTrail/`; registration: `useListHeaderTrail` / `useEntityHeaderTrail`
- Entity view tabs in header center: `HeaderTabBar` + `useHeaderTrailCenter` (see [LAYOUT.md](./LAYOUT.md))
- Entity view layout mode (vertical/horizontal): `useEntityViewLayout` in `components/theme.jsx`; setting in Appearance
- List screens: [LIST_PATTERN.md](./LIST_PATTERN.md)

Preserve subscription patterns when restructuring lists or moving controls between screens.

---

## Checklist before merging GUI changes

- [ ] No new hook calls inside `.map()` at parent level
- [ ] Large lists use Evaluator pattern or equivalent mount limiting
- [ ] New row components defined at module scope
- [ ] Context/elements memoized where passed to lists
- [ ] `has` guards on conditional features
- [ ] No changes to `mixers` / `mixers-react` unless explicitly scoped
