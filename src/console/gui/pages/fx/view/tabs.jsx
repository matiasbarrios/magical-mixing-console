// Requirements
import { useMemo } from 'react';
import { Flex, IconButton } from '@radix-ui/themes';
import { useDevice, useFxReset } from '@magical-mixing/mixers-react';
import { RESET_ROAM_ID, focusRoamAttrs } from '../../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../../components/base/resetIcon';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import { useLanguage } from '../../../components/language';
import { LabelControlTable, LABEL_CONTROL_CLASS } from '../../../components/base/labelControlTable';
import { EntityTabsShell, useEntityTabs } from '../../../components/layout/entity/tabs';
import HeaderTabBar from '../../../components/layout/entity/headerTabBar';
import { useHeaderTrailCenter } from '../../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
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
                    {...focusRoamAttrs(RESET_ROAM_ID)}
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
        { id: 'parameters', label: t('Parameters') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'fx-view-tab',
        defaultTab: 'parameters',
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
            {tabActive === 'parameters' && (
                <ConditionalScrollY>
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <ModePanel fxId={fxId} controlSize={controlSize} />
                        <Parameters fxId={fxId} controlSize={controlSize} />
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gap="1">
                        <ResetFx fxId={fxId} />
                    </Flex>
                </ConditionalScrollY>
            )}
        </EntityTabsShell>
    );
};
