// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useIfHasCalculate } from '../../helpers/ifHasCalculate';


// Exported
export const useBusStereoLink = (busId) => {
    const { features: { bus: { stereoLink } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(stereoLink, busId);

    const side = useIfHasCalculate(stereoLink, 'side', busId);

    const pair = useIfHasCalculate(stereoLink, 'pair', busId);

    return {
        has, value, set, toggle, side, pair,
    };
};
