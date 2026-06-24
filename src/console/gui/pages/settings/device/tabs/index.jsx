// Requirements
import { useMemo } from 'react';
import { useConfigurationOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import ConditionalScrollY from '../../../../components/base/conditionalScrollY';
import { EntityTabsShell, useEntityTabs } from '../../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
import CategoryOptions from '../options';


// Exported
export default () => {
    const { translateTry } = useLanguage();
    const { categories, options } = useConfigurationOptions();

    const visibleCategories = useMemo(() => categories
        .filter(c => options.some(o => o.categoryId === c.id)), [categories, options]);

    const tabs = useMemo(() => visibleCategories.map(c => ({
        id: c.id,
        label: translateTry(c.name),
    })), [visibleCategories, translateTry]);

    const defaultTab = useMemo(() => visibleCategories[0]?.id, [visibleCategories]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'device-settings-tab',
        defaultTab,
    });

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

    if (!defaultTab) return null;

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            tabPanelMt="3"
            hideTabBar
        >
            {visibleCategories.map(category => (
                tabActive === category.id && (
                    <ConditionalScrollY key={category.id}>
                        <CategoryOptions categoryId={category.id} />
                    </ConditionalScrollY>
                )
            ))}
        </EntityTabsShell>
    );
};
