// Requirements
import { useMemo } from 'react';
import { Flex, IconButton } from '@radix-ui/themes';
import { useDevice, useFxReset } from '@magical-mixing/mixers-react';
import ResetIcon from '../../../components/base/resetIcon';
import { useLanguage } from '../../../components/language';
import { LabelControlTable, LABEL_CONTROL_CLASS } from '../../../components/base/labelControlTable';
import { EntityTabsShell, TabPanelScrollable, useEntityTabs } from '../../../components/layout/entity/tabs';
import { useUiSize } from '../../../components/theme';
import { Alert } from '../../../components/base/alert';
import ModePanel from './modePanel';
import Parameters from './parameters';


// Internal
const ResetFx = ({ fxId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useFxReset(fxId);

    return (
        <Alert onAccept={reset} accept={t('Reset')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Reset')}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


// Exported
export default ({ fxId }) => {
    const { t } = useLanguage();
    const { textSize: controlSize } = useUiSize();

    const tabs = useMemo(() => [
        { id: 'general', label: t('General') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'fx-view-tab',
        defaultTab: 'general',
    });

    return (
        <EntityTabsShell
            tabs={tabs}
            tabActive={tabActive}
            onTabChange={onTabChange}
        >
            {tabActive === 'general' && (
                <TabPanelScrollable>
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <ModePanel fxId={fxId} controlSize={controlSize} />
                        <Parameters fxId={fxId} controlSize={controlSize} />
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gap="1">
                        <ResetFx fxId={fxId} />
                    </Flex>
                </TabPanelScrollable>
            )}
        </EntityTabsShell>
    );
};
