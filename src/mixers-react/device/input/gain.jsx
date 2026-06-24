// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHasGet } from '../../helpers/hasGet';
import { useIfHasCalculate } from '../../helpers/ifHasCalculate';


// Exported
export const useInputGain = (inputId) => {
    const { features: { input: { gain } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(gain, inputId);

    const minimum = useIfHasCalculate(gain, 'minimum', inputId, 0);
    const maximum = useIfHasCalculate(gain, 'maximum', inputId, 0);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useInputGainPost = (inputId) => {
    const { features: { input: { gain: { post } } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(post, inputId);

    return { has, value };
};
