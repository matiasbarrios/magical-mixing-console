// Requirements
import { hotkeyBinding } from './binding';


// Constants
const TAB_CYCLE_GROUP = 'General';

const tabsNextActionId = 'tabs.next';
const tabsPrevActionId = 'tabs.prev';

const tabCycleActions = {
    [tabsNextActionId]: {
        id: tabsNextActionId,
        labelKey: 'Next tab',
        groupKey: TAB_CYCLE_GROUP,
        defaultBinding: hotkeyBinding('KeyT'),
    },
    [tabsPrevActionId]: {
        id: tabsPrevActionId,
        labelKey: 'Previous tab',
        groupKey: TAB_CYCLE_GROUP,
        defaultBinding: hotkeyBinding('KeyT', { shiftKey: true }),
    },
};


// Variables
let activeTabBar = null;


// Exported
export {
    TAB_CYCLE_GROUP,
    tabsNextActionId,
    tabsPrevActionId,
    tabCycleActions,
};

export const registerTabBar = (entry) => {
    activeTabBar = entry;
    return () => {
        if (activeTabBar === entry) activeTabBar = null;
    };
};

export const getActiveTabBar = () => activeTabBar;

export const cycleTabBar = (direction) => {
    const { tabs, active, onChange } = activeTabBar ?? {};
    if (!tabs?.length || tabs.length < 2 || !onChange) return false;

    let activeIndex = tabs.findIndex(tab => tab.id === active);
    if (activeIndex < 0) activeIndex = 0;

    const nextIndex = (activeIndex + direction + tabs.length) % tabs.length;
    onChange(tabs[nextIndex].id);
    return true;
};
