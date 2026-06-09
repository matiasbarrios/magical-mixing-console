// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, TabPanelScrollable, useEntityTabs } from '../../../components/layout/entity/tabs';
import Strip from './strip';
import General from './general';


// Exported
export default ({ outputId }) => {
    const { t } = useLanguage();

    const tabs = useMemo(() => [
        { id: 'general', label: t('General') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'output-view-tab',
        defaultTab: 'general',
    });

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            header={(
                <Flex flexShrink="0" width="100%" minWidth="0" mb="2">
                    <Strip outputId={outputId} />
                </Flex>
            )}
        >
            {tabActive === 'general' && (
                <TabPanelScrollable>
                    <General outputId={outputId} />
                </TabPanelScrollable>
            )}
        </EntityTabsShell>
    );
};
