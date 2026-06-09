// Requirements
import { useCallback, useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDeviceSettings } from '../../global/settings';
import OverflowTabs from '../../base/overflowTabs';


export const tabPanelMt = '2';


// Tab panel with vertical scroll — lists and stacked content (From/To, scope, outputs).
// Exported
export const TabPanelScrollable = ({ children, scrollAlways = false }) => (
    <Flex
        direction="column"
        gapY="4"
        flexGrow="1"
        minHeight="0"
        pb="2"
        className={scrollAlways ? 'mmc-scroll-y mmc-scroll-y-always' : 'mmc-scroll-y'}
    >
        { children }
    </Flex>
);


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
}) => (
    <Flex direction="column" height="100%" minHeight="0" width="100%" mt={mt}>
        { header }
        <Flex
            direction="column"
            flexShrink="0"
            width="100%"
            minWidth="0"
        >
            <OverflowTabs tabs={tabs} active={tabActive} onChange={onTabChange} />
        </Flex>
        <Flex direction="column" mt={tabPanelMtProp} flexGrow="1" minHeight="0" overflow="hidden">
            { children }
        </Flex>
    </Flex>
);
