// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, TabPanelFill, useEntityTabs } from '../../../components/layout/entity/tabs';
import Strip from './strip';
import Buses from './buses';


// Exported
export default ({ dcaId }) => {
    const { t } = useLanguage();

    const tabs = useMemo(() => [
        { id: 'buses', label: t('Buses') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'dca-view-tab',
        defaultTab: 'buses',
    });

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            header={(
                <Flex flexShrink="0" width="100%" minWidth="0" mb="2">
                    <Strip dcaId={dcaId} />
                </Flex>
            )}
        >
            {tabActive === 'buses' && (
                <TabPanelFill>
                    <Buses dcaId={dcaId} />
                </TabPanelFill>
            )}
        </EntityTabsShell>
    );
};
