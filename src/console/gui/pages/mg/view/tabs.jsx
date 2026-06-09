// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, useEntityTabs } from '../../../components/layout/entity/tabs';
import Strip from './strip';
import Buses from './buses';


// Exported
export default ({ mgId }) => {
    const { t } = useLanguage();

    const tabs = useMemo(() => [
        { id: 'buses', label: t('Buses') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'mg-view-tab',
        defaultTab: 'buses',
    });

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            header={(
                <Flex flexShrink="0" width="100%" minWidth="0" mb="2">
                    <Strip mgId={mgId} />
                </Flex>
            )}
        >
            {tabActive === 'buses' && (
                <Flex direction="column" flexGrow="1" minHeight="0">
                    <Buses mgId={mgId} />
                </Flex>
            )}
        </EntityTabsShell>
    );
};
