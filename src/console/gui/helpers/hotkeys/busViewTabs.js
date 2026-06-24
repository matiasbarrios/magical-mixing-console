// Requirements
import { hotkeyBinding } from './binding';
import { eventMatchesBinding } from './match';
import { getActiveTabBar } from './tabCycle';


// Constants
const BUS_VIEW_TAB_HOTKEYS = [
    { tabId: 'input', actionId: 'busView.tab.input', labelKey: 'Input', key: 'KeyI' },
    { tabId: 'from', actionId: 'busView.tab.from', labelKey: 'Reception', key: 'KeyR' },
    { tabId: 'to', actionId: 'busView.tab.to', labelKey: 'Sends', key: 'KeyS' },
    { tabId: 'eq', actionId: 'busView.tab.eq', labelKey: 'Equalizer', key: 'KeyE' },
    { tabId: 'compressor', actionId: 'busView.tab.compressor', labelKey: 'Compressor', key: 'KeyC' },
    { tabId: 'gate', actionId: 'busView.tab.gate', labelKey: 'Gate', key: 'KeyG' },
    { tabId: 'insert', actionId: 'busView.tab.insert', labelKey: 'Fx insert', key: 'KeyF' },
    { tabId: 'fx', actionId: 'busView.tab.fx', labelKey: 'FX', key: 'KeyF' },
    { tabId: 'outputs', actionId: 'busView.tab.outputs', labelKey: 'Outputs', key: 'KeyO' },
    { tabId: 'monitor', actionId: 'busView.tab.monitor', labelKey: 'Monitor', key: 'KeyN' },
    { tabId: 'mg', actionId: 'busView.tab.mg', labelKey: 'Mute groups', key: 'KeyM' },
    { tabId: 'dca', actionId: 'busView.tab.dca', labelKey: 'DCAs', key: 'KeyD' },
];

const BUS_VIEW_TAB_GROUP = 'Bus tabs';


// Internal
const busViewTabActions = Object.fromEntries(BUS_VIEW_TAB_HOTKEYS.map(({
    actionId, labelKey, key,
}) => [
    actionId,
    {
        id: actionId,
        labelKey,
        groupKey: BUS_VIEW_TAB_GROUP,
        defaultBinding: hotkeyBinding(key),
    },
]));

const tabIdByActionId = Object.fromEntries(BUS_VIEW_TAB_HOTKEYS.map(({ actionId, tabId }) => [actionId, tabId]));


// Exported
export {
    BUS_VIEW_TAB_GROUP,
    BUS_VIEW_TAB_HOTKEYS,
    busViewTabActions,
    tabIdByActionId,
};

export const isBusViewTabAction = actionId => actionId.startsWith('busView.tab.');

export const getBusViewTabIdForAction = actionId => tabIdByActionId[actionId] ?? null;

export const findBusViewTabActionForEvent = (event, bindings, visibleTabIds) => {
    const visible = new Set(visibleTabIds);
    const match = Object.entries(bindings).find(([actionId, binding]) => {
        if (!isBusViewTabAction(actionId)) return false;
        if (!eventMatchesBinding(event, binding)) return false;
        const tabId = tabIdByActionId[actionId];
        return tabId && visible.has(tabId);
    });
    return match ? match[0] : null;
};

export const activateBusViewTabForEvent = (event, bindings) => {
    const { tabs, onChange } = getActiveTabBar() ?? {};
    if (!tabs?.length || !onChange) return false;

    const actionId = findBusViewTabActionForEvent(event, bindings, tabs.map(tab => tab.id));
    if (!actionId) return false;

    const tabId = getBusViewTabIdForAction(actionId);
    if (!tabId) return false;

    onChange(tabId);
    return true;
};
