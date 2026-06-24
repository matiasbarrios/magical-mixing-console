// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDcaLevel } from '@magical-mixing/mixers-react';
import { useScreen } from '../../../components/base/screen';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import { useLanguage } from '../../../components/language';
import { useEntityViewLayout } from '../../../components/theme';
import {
    EntityTabsShell, TabPanelFill, useEntityTabs,
} from '../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
import GeneralTop from './generalTop';
import GeneralRight from './generalRight';
import Buses from './buses';


// Exported
export default ({ dcaId }) => {
    const { t } = useLanguage();
    const { isXSLandscape } = useScreen();
    const { isVertical: isVerticalLayout } = useEntityViewLayout();
    const { has: levelHas } = useDcaLevel(dcaId);

    const tabs = useMemo(() => [
        { id: 'buses', label: t('Buses') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'dca-view-tab',
        defaultTab: 'buses',
    });

    const sideFaderLayout = useMemo(() => levelHas && (
        isVerticalLayout || isXSLandscape
    ), [levelHas, isVerticalLayout, isXSLandscape]);

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
        !sideFaderLayout
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
                    <GeneralTop dcaId={dcaId} />
                </Flex>
            )
            : undefined
    ), [sideFaderLayout, dcaId]);

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
                isVerticalLayout ? (
                    <TabPanelFill>
                        <Buses dcaId={dcaId} />
                    </TabPanelFill>
                ) : (
                    <ConditionalScrollY>
                        <Buses dcaId={dcaId} />
                    </ConditionalScrollY>
                )
            )}
        </EntityTabsShell>
    );

    return sideFaderLayout ? (
        <Flex flexGrow="1" minHeight="0" minWidth="0" width="100%" overflow="hidden">
            <Flex direction="column" flexGrow="1" minWidth="0" minHeight="0">
                {tabsShell}
            </Flex>
            <GeneralRight dcaId={dcaId} />
        </Flex>
    ) : (
        tabsShell
    );
};
