// Requirements
import { useCallback, useMemo } from 'react';
import { useBusToLevel } from './level';
import { useBusToOn } from './on';
import {
    busToLevelDefaultOn,
    isBusToLevelAbove,
} from './levelAbove';


// Exported
export const useBusToOnAndLevelAbove = (busIdFrom, busIdTo) => {
    const { has: onHas, value: on, set: setOn } = useBusToOn(busIdFrom, busIdTo);
    const {
        has: levelHas, value: level, set: setLevel, minimum, maximum,
    } = useBusToLevel(busIdFrom, busIdTo);

    const onOrLevelAbove = useMemo(() => {
        if (onHas === undefined && levelHas === undefined) return undefined;
        if (onHas) return on === true;
        if (levelHas && level !== undefined) {
            return isBusToLevelAbove(level, minimum, maximum);
        }
        return false;
    }, [onHas, on, levelHas, level, minimum, maximum]);

    const canEnableOnOrLevelAbove = useMemo(() => {
        if (onOrLevelAbove !== false) return false;
        return !!(onHas || levelHas);
    }, [onOrLevelAbove, onHas, levelHas]);

    const enableOnOrLevelAbove = useCallback(() => {
        if (onHas) {
            setOn(true);
            return;
        }
        if (levelHas) {
            setLevel(busToLevelDefaultOn(minimum, maximum));
        }
    }, [onHas, setOn, levelHas, setLevel, minimum, maximum]);

    const disableOnOrLevelAbove = useCallback(() => {
        if (onHas) {
            setOn(false);
            return;
        }
        if (levelHas) {
            setLevel(minimum);
        }
    }, [onHas, setOn, levelHas, setLevel, minimum]);

    return {
        onOrLevelAbove,
        canEnableOnOrLevelAbove,
        enableOnOrLevelAbove,
        disableOnOrLevelAbove,
    };
};
