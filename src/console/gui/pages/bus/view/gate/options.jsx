// Requirements
import { useCallback, useState } from 'react';
import { Flex, IconButton } from '@radix-ui/themes';
import { useBusGateOn, useBusGateReset, useDevice } from '@magical-mixing/mixers-react';
import ResetIcon from '../../../../components/base/resetIcon';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { ActiveToggleButton } from '../../../../components/base/activeToggleButton';
import { PresetContext, PresetSave, PresetsMenu } from './presets';


// Internal
const On = ({ busId }) => {
    const { has, value, toggle } = useBusGateOn(busId);

    if (!has || value === undefined) return null;

    return <ActiveToggleButton active={value} onClick={toggle} inactiveColor="red" />;
};


const Reset = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useBusGateReset(busId);

    return (
        <IconButton
            size={textSize}
            variant="soft"
            color="gray"
            onClick={reset}
            disabled={disabled}
            aria-label={t('Reset')}
        >
            <ResetIcon />
        </IconButton>
    );
};


// Exported
export default ({ busId }) => {
    const [presetSaveOpen, setPresetSaveOpen] = useState(false);
    const doPresetSaveOpen = useCallback(() => {
        setPresetSaveOpen(true);
    }, []);

    return (
        <PresetContext>
            <Flex align="start" gapX="2" gapY="2" wrap="wrap" width="100%">
                <On busId={busId} />
                <PresetsMenu busId={busId} doPresetSaveOpen={doPresetSaveOpen} />
                <Reset busId={busId} />
            </Flex>
            <PresetSave busId={busId} open={presetSaveOpen} onOpenChange={setPresetSaveOpen} />
        </PresetContext>
    );
};
