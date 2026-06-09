// Requirements
import { useMemo } from 'react';
import { useOutputOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { EntityTabsShell, TabPanelFill, useEntityTabs } from '../../../components/layout/entity/tabs';
import Strip from './strip';
import Buses from './buses';
import Outputs from './outputs';


// Exported
export default ({ inputId }) => {
    const { t } = useLanguage();
    const { options: outputOptions } = useOutputOptions();

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

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
            header={<Strip inputId={inputId} />}
        >
            {tabActive === 'buses' && (
                <TabPanelFill>
                    <Buses inputId={inputId} />
                </TabPanelFill>
            )}
            {tabActive === 'outputs' && (
                <TabPanelFill>
                    <Outputs inputId={inputId} />
                </TabPanelFill>
            )}
        </EntityTabsShell>
    );
};
