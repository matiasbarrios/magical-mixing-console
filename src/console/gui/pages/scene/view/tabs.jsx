// Requirements
import { useMemo } from 'react';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, useEntityTabs } from '../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
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

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            tabPanelMt="3"
            hideTabBar
        >
            {tabActive === 'scope' && (
                <ConditionalScrollY>
                    <Scope sceneId={sceneId} />
                </ConditionalScrollY>
            )}
        </EntityTabsShell>
    );
};
