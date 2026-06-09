// Requirements
import { useBusColor, useBusColorResetAll } from '@magical-mixing/mixers-react';
import { useCallback } from 'react';
import {
    useFallbackColors, useFallbackColor, useFallbackColorValueSet, colorOptions,
} from '../shared/color';


// Exported
export const useFallbackBusColors = () => {
    const { colorsReset } = useFallbackColors('bus');
    const { resetAll } = useBusColorResetAll();

    const colorsResetFinal = useCallback(async () => {
        colorsReset();
        await resetAll();
    }, [colorsReset, resetAll]);

    return { colorsReset: colorsResetFinal };
};


export const useFallbackBusColor = (busId, defaultValue) => {
    const deviceColor = useBusColor(busId);
    const fallbackColor = useFallbackColor('bus', busId);
    const { value, set } = useFallbackColorValueSet(deviceColor, fallbackColor, defaultValue);
    return {
        has: true, value, set, options: colorOptions,
    };
};

