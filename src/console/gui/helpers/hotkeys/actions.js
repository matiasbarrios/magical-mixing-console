// Requirements
import { hotkeyBinding } from './binding';
import { busViewTabActions } from './busViewTabs';
import { focusRoamActions } from './focusRoam';
import { tabCycleActions } from './tabCycle';


// Constants
const HOTKEY_ACTIONS = {
    'navigate.home': {
        id: 'navigate.home',
        labelKey: 'Go to Home',
        groupKey: 'General',
        defaultBinding: hotkeyBinding('KeyH'),
    },
    ...focusRoamActions,
    ...tabCycleActions,
    ...busViewTabActions,
};


// Internal
const getDefaultBindings = () => {
    const bindings = {};
    Object.entries(HOTKEY_ACTIONS).forEach(([id, action]) => {
        bindings[id] = { ...action.defaultBinding };
    });
    return bindings;
};


// Exported
export {
    HOTKEY_ACTIONS,
    getDefaultBindings,
};

export const HOTKEY_ACTION_IDS = Object.keys(HOTKEY_ACTIONS);

export const HOTKEY_GROUP_ORDER = ['General', 'Focus', 'Bus tabs'];
