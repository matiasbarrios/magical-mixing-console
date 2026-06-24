// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useScreen } from '../../../components/base/screen';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import { useLanguage } from '../../../components/language';
import { useEntityViewLayout } from '../../../components/theme';
import {
    EntityTabsShell, useEntityTabs,
} from '../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
import GeneralTop from './generalTop';
import GeneralRight from './generalRight';
import Buses from './buses';


// Exported
export default ({ mgId }) => {
    const { t } = useLanguage();
    const { isXSLandscape } = useScreen();
    const { isVertical: isVerticalLayout } = useEntityViewLayout();

    const tabs = useMemo(() => [
        { id: 'buses', label: t('Buses') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'mg-view-tab',
        defaultTab: 'buses',
    });

    const sideStripLayout = useMemo(() => (
        isVerticalLayout || isXSLandscape
    ), [isVerticalLayout, isXSLandscape]);

    const headerTabPicker = useMemo(() => (
        tabs.length > 0
            ? (
                <HeaderTabBar
                    tabs={tabs}
                    active={tabActive}
                    onChange={onTabChange}
                />
            )
            : null
    ), [tabs, tabActive, onTabChange]);

    useHeaderTrailCenter(headerTabPicker);

    const generalHeader = useMemo(() => (
        !sideStripLayout
            ? (
                <Flex
                    flexShrink="0"
                    width="100%"
                    minWidth="0"
                    mt="0"
                    pb="4"
                    mb="4"
                    style={{ borderBottom: '1px solid var(--gray-a4)' }}
                >
                    <GeneralTop mgId={mgId} />
                </Flex>
            )
            : undefined
    ), [sideStripLayout, mgId]);

    const tabsShell = (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            header={generalHeader}
            tabPanelMt="3"
            hideTabBar
        >
            {tabActive === 'buses' && (
                <ConditionalScrollY>
                    <Buses mgId={mgId} />
                </ConditionalScrollY>
            )}
        </EntityTabsShell>
    );

    return sideStripLayout ? (
        <Flex flexGrow="1" minHeight="0" minWidth="0" width="100%" overflow="hidden">
            <Flex direction="column" flexGrow="1" minWidth="0" minHeight="0">
                {tabsShell}
            </Flex>
            <GeneralRight mgId={mgId} />
        </Flex>
    ) : (
        tabsShell
    );
};
