// Requirements
import { useDcaColor, useDcaColorResetAll } from '@magical-mixing/mixers-react';
import { useCallback, useContext } from 'react';
import {
    colorOptions, useFallbackColor, useFallbackColors, useFallbackColorValueSet,
} from '../shared/color';
import { FallbackContext } from '../context';


// Exported
const FallbackColor = ({ dcaId, defaultValue, children }) => {
    const deviceColor = { has: false };
    const fallbackColor = useFallbackColor('dca', dcaId);
    const { value, set } = useFallbackColorValueSet(deviceColor, fallbackColor, defaultValue);
    return children({
        has: true,
        value,
        set,
        options: colorOptions,
    });
};


const DeviceColor = ({ dcaId, defaultValue, children }) => {
    const deviceColor = useDcaColor(dcaId);
    const fallbackColor = useFallbackColor('dca', dcaId);
    const { value, set } = useFallbackColorValueSet(deviceColor, fallbackColor, defaultValue);
    return children({
        has: deviceColor.has, value, set, options: colorOptions,
    });
};


export const useFallbackDcaColor = (dcaId, defaultValue = 'gray') => {
    const { dcaOptions } = useContext(FallbackContext);
    const deviceColor = useDcaColor(dcaId);
    const fallbackColor = useFallbackColor('dca', dcaId);
    const { value, set } = useFallbackColorValueSet(deviceColor, fallbackColor, defaultValue);

    const isVirtual = dcaOptions?.find(o => o.id === dcaId);
    return {
        has: isVirtual ? true : deviceColor.has,
        value,
        set,
        options: colorOptions,
    };
};


// Exported
export const useFallbackDcaColors = () => {
    const { colorsReset } = useFallbackColors('dca');
    const { resetAll } = useDcaColorResetAll();

    const colorsResetFinal = useCallback(async () => {
        colorsReset();
        await resetAll();
    }, [colorsReset, resetAll]);

    return { colorsReset: colorsResetFinal };
};


export const FallbackDcaColor = ({ dcaId, defaultValue, children }) => {
    const { dcaOptions } = useContext(FallbackContext);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceColor dcaId={dcaId} defaultValue={defaultValue}>{children}</DeviceColor>;
    }
    return <FallbackColor dcaId={dcaId} defaultValue={defaultValue}>{children}</FallbackColor>;
};

