// Requirements
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, TabPanelScrollable, useEntityTabs } from '../../../components/layout/entity/tabs';
import Scope from './scope';


// Exported
export default ({ sceneId }) => {
    const { t } = useLanguage();

    const tabs = useMemo(() => [
        { id: 'scope', label: t('Configuration to load') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'scene-view-tab',
        defaultTab: 'scope',
    });

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
        >
            {tabActive === 'scope' && (
                <TabPanelScrollable>
                    <Scope sceneId={sceneId} />
                </TabPanelScrollable>
            )}
        </EntityTabsShell>
    );
};
