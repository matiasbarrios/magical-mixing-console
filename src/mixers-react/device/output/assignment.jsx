// Requirements
import { useCallback, useMemo } from 'react';
import { useOutputResetAllWithSource } from './reset';
import { useOutputSource } from './source';


// Internal
const PLACEHOLDER_OUTPUT_ID = 0;


// Exported
export const useBusOutputAssignmentApply = (busId, outputId) => {
    const resolvedOutputId = outputId ?? PLACEHOLDER_OUTPUT_ID;
    const { has, set, options } = useOutputSource(resolvedOutputId);
    const { reset: resetOutputsWithBus } = useOutputResetAllWithSource('bus', busId);

    const busSourceOption = useMemo(() => options.find(o => o.type === 'bus' && o.externalId === busId),
        [busId, options]);

    const ready = busId !== null
        && outputId !== null
        && has !== undefined
        && !!busSourceOption;

    const apply = useCallback(() => {
        if (!busSourceOption || !has) return;
        resetOutputsWithBus();
        set(busSourceOption.id);
    }, [busSourceOption, has, resetOutputsWithBus, set]);

    return { apply, ready };
};
