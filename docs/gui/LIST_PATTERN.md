# Console GUI — List pattern

Inventory and **target pattern** for entity list screens and embedded list views in `src/console/gui/`.

For subscription and performance rules when building lists, see [GUI.md](./GUI.md). For app shell, header, and entity view shells, see [LAYOUT.md](./LAYOUT.md). For routes and entities, see [CONCEPTS.md](../reference/CONCEPTS.md).

---

## Scope

### In scope

- Top-level list routes (menu navigation).
- Embedded lists inside entity detail views (assignments, sends, scope, etc.).
- Shared row components (`*Row.jsx`, `listRow.jsx`).

### Out of scope

Parameter/settings rows (`LabelControlTable.Row` for a single control): bus input/monitor/fx/insert tabs, FX parameters, device settings, vault detail key/value view.

### Exceptions

| Screen | Reason |
|--------|--------|
| `/device/connect` | Full-screen device discovery; not an entity list |
| `/automix/list` | Control surface: global group strip + per-bus matrix; no name filter |
| Pagination | Not used on list rows; Evaluator pattern limits mounts (see [GUI.md](./GUI.md)) |

### Control surface (`/automix/list`)

Not a filterable entity list. Uses the same list **shell** as route-level pages (`ListPageShell`, `ListFooter`) but replaces `ListFilterBar` with a centered **group strip** (`strip.jsx`: On/Lock per automix group). Rows (`busRow.jsx` in `buses.jsx` / `ListStack`) are a bus × group assignment matrix with optional weight sliders — not navigation list rows.

---

## Shared components

| Component | Purpose |
|-----------|---------|
| `ListPageShell` | List route column shell (`components/layout/list/shell.jsx`, `gapY="4"`) |
| `ListStack` | Single-column flex stack for all entity lists (`components/layout/list/stack.jsx`, `gap="3"`) |

Also used: `ICON_SIZE`, `QUICK_BUTTON_STYLE` for action buttons (S/M letters same 22×22 footprint as icon buttons).

---

## Target pattern

### Reference implementations

| Role | Files |
|------|-------|
| Strip row + slider + bus link | `pages/bus/view/fromTo/fromRow.jsx`, `from.jsx` |
| List page + filter + bulk header + footer | `pages/bus/list.jsx`, `pages/dca/list.jsx` |
| Assignment tab (assigned only + footer) | `pages/dca/view/buses.jsx` |
| Entity link button | `pages/bus/view/fromTo/openFrom.jsx` (`SourceViewBus`), `pages/dca/view/openDca.jsx`, `pages/input/view/openInput.jsx`, etc. |

### Layout rules

1. **No `Card`** wrapping the list or rows.
2. **Separation:** gap only (`ListStack`). No `Separator` between rows.
3. **All entity lists** use `ListStack` — single column, flex stack.
4. **No card wrapper** around list content. `ListFilterBar` is OK for filter row only (see `components/layout/list/filterBar.jsx`). Footer actions use `ListFooter` (see `components/layout/list/footer.jsx`).

### Header (when filter exists)

```
[ TextFieldErasable filter — flexGrow ]  [ bulk ops on filtered ]
```

- Bulk ops (e.g. Apply to filtered, Edit filtered) stay **top-right**, same row as filter.
- Filter uses `TextFieldErasable`, `debounceTime={250}`.

### Footer (when Reset / Add apply)

Use shared `ListFooter` with `reset` and/or `add` slots:

```
                                    [ Reset ] [ Add ]
```

- Always `justify="end"` (handled by `ListFooter`).
- Order: **Reset left of Add**.
- Reset: `IconButton size="1" variant="soft" color="gray" radius="full"` + `ResetIcon`, wrapped in `Alert` when destructive.
- Add: same button style + `PlusIcon`, or `DropdownMenuTrigger` + menu of items to add (from/to pattern).
- Reset menu with sub-options (bus list): footer dropdown, same icon style.

### Row anatomy (strip)

```
[ entity link — flexShrink ] [ controls — flexGrow ] [ actions — flexShrink ]
```

- Container: horizontal `Flex`, `nowrap`, `minWidth: 0`, `width: 100%`.
- **Navigation:** only the entity link/button opens detail (`SourceViewBus`, `ViewInput`, `DcaViewDca`, `ViewMg`, `ViewFx`, `ViewScene`, `ViewOutput`, vault `Link`). Row itself is not clickable.
- **Edit pencil** on list row is allowed where it exists (e.g. bus list).
- **Controls:** `stopPropagation` on `onPointerDown` + `onClick` wrappers around sliders/toggles.
- **Slider + bus:** link left; slider uses `trackStart` with icon + `Text size="1" color="gray"` label (e.g. Level, Weight, Gain).
- **S/M solo/mute:** letter buttons with `QUICK_BUTTON_STYLE` (same size as icon buttons).
- **Assignment toggle:** `IconButton` blue + `CheckIcon` when on, gray empty when off.
- **Remove/unassign:** `MinusIcon` in `IconButton` on the right.

### Embedded assignment lists

- Show **only assigned / in-mix** rows (Evaluator pattern, like from/to).
- Footer with Reset + Add (dropdown of items not yet assigned).

### Drag and drop

- Reorder handle **only** on `/bus/list` (`DragHandleDots2Icon` left of row).

---

## Route-level list pages

| Route | Page | Row | Status |
|-------|------|-----|--------|
| `/bus/list` | `bus/list.jsx` | `listRow.jsx` | Done |
| `/input/list` | `input/list.jsx` | `listRow.jsx` | Done |
| `/output/list` | `output/list.jsx` | `listRow.jsx` | Done |
| `/output/:outputId` | `output/view/index.jsx` | — | Done |
| `/fx/list` | `fx/list.jsx` | `listRow.jsx` | Done |
| `/dca/list` | `dca/list.jsx` | `listRow.jsx` | Done |
| `/mg/list` | `mg/list.jsx` | `listRow.jsx` | Done |
| `/automix/list` | `automix/list/index.jsx` | `busRow.jsx` | Control surface |
| `/scene/list/device` | `scene/listDevice.jsx` | `listDeviceRow.jsx` | Done |
| `/scene/list/app` | `scene/listApp.jsx` | `listAppRow.jsx` | Done |
| `/vault/list/:vaultType` | `vault/list.jsx` | inline strip | Done |
| `/device/connect` | `device/connect.jsx` | — | Exception |

---

## Embedded list views

| Location | Container | Row | Status |
|----------|-----------|-----|--------|
| Bus → From | `fromTo/from.jsx` | `fromRow.jsx` | Done |
| Bus → To | `fromTo/to.jsx` | `toRow.jsx` | Done |
| Bus → Outputs | `bus/view/outputs.jsx` | inline | Done |
| Bus → DCA | `bus/view/dca.jsx` | inline | Done |
| Bus → MG | `bus/view/mg.jsx` | inline | Done |
| DCA → Buses | `dca/view/buses.jsx` | `busRow.jsx` | Done |
| MG → Buses | `mg/view/buses.jsx` | `busRow.jsx` | Done |
| Input → Buses | `input/view/buses.jsx` | `busRow.jsx` | Done |
| Input → Outputs | `input/view/outputs.jsx` | `outputRow.jsx` | Done |
| Automix buses | `automix/list/buses.jsx` | `busRow.jsx` | Done |
| Scene scope | `scene/view/scope.jsx` | `scopeRow.jsx` | Done |

---

## File map

```
components/layout/list/   filterBar.jsx, footer.jsx, filterEmpty.jsx, stack.jsx, shell.jsx
pages/bus/list.jsx         listRow.jsx
pages/bus/view/fromTo/     from.jsx, fromRow.jsx, to.jsx, toRow.jsx
pages/input/               list.jsx, listRow.jsx, view/openInput.jsx, view/buses.jsx, busRow.jsx, view/outputs.jsx, outputRow.jsx
pages/output/              list.jsx, listRow.jsx, view/index.jsx, view/tabs.jsx, view/strip.jsx, view/general.jsx, view/openOutput.jsx
pages/fx/                  list.jsx, listRow.jsx, view/openFx.jsx
pages/dca/                 list.jsx, listRow.jsx, view/openDca.jsx, view/buses.jsx, busRow.jsx
pages/mg/                  list.jsx, listRow.jsx, view/openMg.jsx, view/buses.jsx, busRow.jsx
pages/automix/list/        index.jsx, buses.jsx, busRow.jsx
pages/scene/               listDevice.jsx, listApp.jsx, view/openScene.jsx, view/tabs.jsx, view/scope.jsx, scopeRow.jsx
pages/vault/list.jsx
```

Entity link helpers: `openFrom.jsx` (bus), `openDca.jsx`, `openInput.jsx`, `openFx.jsx`, `openMg.jsx`, `openOutput.jsx`, `openScene.jsx`.

Header instance pickers (detail routes): `pages/<entity>/view/sectionInstance.jsx` — see [LAYOUT.md](./LAYOUT.md).

---

## Migration checklist

| Screen | Status |
|--------|--------|
| `/bus/list` | Done |
| `/input/list` | Done |
| `/output/list` | Done |
| `/output/:outputId` | Done |
| `/fx/list` | Done |
| `/dca/list` | Done |
| `/mg/list` | Done |
| `/automix/list` | Done |
| `/scene/list/device` | Done |
| `/scene/list/app` | Done |
| `/vault/list/:vaultType` | Done |
| `/device/connect` | Exception |
| Bus From / To | Done |
| DCA / MG / Input bus tabs | Done |
| Input outputs tab | Done |
| Bus outputs / DCA / MG tabs | Done |
| Scene scope | Done |
