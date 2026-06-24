// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useInputGain, useInputPhantom, useOutputOptions } from '@magical-mixing/mixers-react';
import { useScreen } from '../../../components/base/screen';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import { useLanguage } from '../../../components/language';
import { useEntityViewLayout } from '../../../components/theme';
import {
    EntityTabsShell, useEntityTabs,
} from '../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
import { useInputEdit } from './edit';
import GeneralTop from './generalTop';
import GeneralRight from './generalRight';
import Buses from './buses';
import Outputs from './outputs';


// Exported
export default ({ inputId }) => {
    const { t } = useLanguage();
    const { isXSLandscape } = useScreen();
    const { isVertical: isVerticalLayout } = useEntityViewLayout();
    const { options: outputOptions } = useOutputOptions();
    const { has: gainHas } = useInputGain(inputId);
    const { has: phantomHas } = useInputPhantom(inputId);
    const { has: editHas } = useInputEdit(inputId);

    const tabs = useMemo(() => {
        const res = [{ id: 'buses', label: t('Buses') }];
        if (outputOptions.length > 0) {
            res.push({ id: 'outputs', label: t('Outputs') });
        }
        return res;
    }, [t, outputOptions.length]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'input-view-tab',
        defaultTab: 'buses',
    });

    const generalTab = useMemo(() => gainHas || phantomHas || editHas,
        [gainHas, phantomHas, editHas]);

    const sideFaderLayout = useMemo(() => gainHas && (
        isVerticalLayout || isXSLandscape
    ), [gainHas, isVerticalLayout, isXSLandscape]);

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
        generalTab && !sideFaderLayout
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
                    <GeneralTop inputId={inputId} />
                </Flex>
            )
            : undefined
    ), [generalTab, sideFaderLayout, inputId]);

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
                    <Buses inputId={inputId} />
                </ConditionalScrollY>
            )}
            {tabActive === 'outputs' && (
                <ConditionalScrollY>
                    <Outputs inputId={inputId} />
                </ConditionalScrollY>
            )}
        </EntityTabsShell>
    );

    return sideFaderLayout ? (
        <Flex flexGrow="1" minHeight="0" minWidth="0" width="100%" overflow="hidden">
            <Flex direction="column" flexGrow="1" minWidth="0" minHeight="0">
                {tabsShell}
            </Flex>
            <GeneralRight inputId={inputId} />
        </Flex>
    ) : (
        tabsShell
    );
};
