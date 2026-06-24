// Requirements
import { useCallback, useMemo } from 'react';
import {
    useBusInput,
    useBusInputId,
    useBusInputTrim,
    useBusInputVolume,
    useDevice,
    useInputGain,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { formatLevelDb } from '../../../../../helpers/format';
import { INPUT_PREVIEW_ROAM_ID } from '../../../../../helpers/hotkeys/focusRoam';
import { MiniPreviewContainer, MiniPreviewPlaceholder } from './miniPreviewContainer';
import { useProcessingPreview } from './previewDialog';


// Internal
const InputPreviewButton = ({ busIdFrom, displayValue }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { openPreview } = useProcessingPreview();

    const onOpen = useCallback(() => {
        openPreview({ busId: busIdFrom, section: 'input' });
    }, [busIdFrom, openPreview]);

    return (
        <MiniPreviewContainer
            aria-label={t('Input')}
            onClick={onOpen}
            disabled={disabled}
            label={displayValue ?? 'In'}
            focusRoam={INPUT_PREVIEW_ROAM_ID}
        />
    );
};


const InputPreviewWithInput = ({ busIdFrom, inputId }) => {
    const { has: gainHas, value: gainValue } = useInputGain(inputId);
    const { has: trimHas, value: trimValue } = useBusInputTrim(busIdFrom, inputId);

    const displayValue = useMemo(() => {
        if (gainHas && gainValue !== undefined) return formatLevelDb(gainValue);
        if (trimHas && trimValue !== undefined) return formatLevelDb(trimValue);
        return null;
    }, [gainHas, gainValue, trimHas, trimValue]);

    return <InputPreviewButton busIdFrom={busIdFrom} displayValue={displayValue} />;
};


const InputPreviewVolume = ({ busIdFrom }) => {
    const { has: volumeHas, value: volumeValue } = useBusInputVolume(busIdFrom);

    const displayValue = useMemo(() => {
        if (volumeHas && volumeValue !== undefined) return formatLevelDb(volumeValue);
        return null;
    }, [volumeHas, volumeValue]);

    return <InputPreviewButton busIdFrom={busIdFrom} displayValue={displayValue} />;
};


const Preview = ({ busIdFrom }) => {
    const { has: idHas, value: inputId } = useBusInputId(busIdFrom);

    if (!idHas) return <MiniPreviewPlaceholder />;

    if (inputId !== null && inputId !== undefined) {
        return <InputPreviewWithInput busIdFrom={busIdFrom} inputId={inputId} />;
    }

    if (inputId === null) {
        return <InputPreviewVolume busIdFrom={busIdFrom} />;
    }

    return <InputPreviewButton busIdFrom={busIdFrom} />;
};


// Exported
export default ({ busIdFrom }) => {
    const { has } = useBusInput(busIdFrom);
    if (!has) return <MiniPreviewPlaceholder />;
    return <Preview busIdFrom={busIdFrom} />;
};
