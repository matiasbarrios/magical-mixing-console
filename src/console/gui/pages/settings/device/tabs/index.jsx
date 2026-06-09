// Requirements
import { useMemo } from 'react';
import { useConfigurationOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import {
    EntityTabsShell, TabPanelScrollable, useEntityTabs,
} from '../../../../components/layout/entity/tabs';
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

    if (!defaultTab) return null;

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
        >
            {visibleCategories.map(category => (
                tabActive === category.id && (
                    <TabPanelScrollable key={category.id}>
                        <CategoryOptions categoryId={category.id} />
                    </TabPanelScrollable>
                )
            ))}
        </EntityTabsShell>
    );
};
