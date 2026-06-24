// Requirements
import { useCallback, useEffect, useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDeviceSettings } from '../../global/settings';
import { registerTabBar } from '../../../helpers/hotkeys/tabCycle';
import OverflowTabs from '../../base/overflowTabs';


export const tabPanelMt = '2';


// Tab panel that fills remaining height — chart/EQ/compressor layouts without outer scroll.
// Exported
export const TabPanelFill = ({ children }) => (
    <Flex direction="column" flexGrow="1" minHeight="0" minWidth="0" width="100%">
        { children }
    </Flex>
);


// Exported
export const useEntityTabs = ({ tabs, settingsKey, defaultTab }) => {
    const [activeTab, setActiveTab] = useDeviceSettings(settingsKey, defaultTab);

    const tabActive = useMemo(() => (tabs.some(o => o.id === activeTab) ? activeTab : defaultTab),
        [tabs, activeTab, defaultTab]);

    const onTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
    }, [setActiveTab]);

    return { tabActive, onTabChange };
};


export const EntityTabsShell = ({
    tabs,
    tabActive,
    onTabChange,
    header,
    children,
    mt,
    tabPanelMt: tabPanelMtProp = tabPanelMt,
    hideTabBar = false,
}) => {
    useEffect(() => registerTabBar({ tabs, active: tabActive, onChange: onTabChange }),
        [tabs, tabActive, onTabChange]);

    return (
        <Flex direction="column" height="100%" minHeight="0" minWidth="0" width="100%" mt={mt}>
            { header }
            { !hideTabBar && (
                <Flex
                    direction="column"
                    flexShrink="0"
                    width="100%"
                    minWidth="0"
                >
                    <OverflowTabs tabs={tabs} active={tabActive} onChange={onTabChange} />
                </Flex>
            ) }
            <Flex
                direction="column"
                mt={hideTabBar ? undefined : tabPanelMtProp}
                flexGrow="1"
                minHeight="0"
                overflow="hidden"
            >
                { children }
            </Flex>
        </Flex>
    );
};
