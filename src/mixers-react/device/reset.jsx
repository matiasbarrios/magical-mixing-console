// Requirements
import { useCallback, useContext } from 'react';
import { useChanges } from '../helpers/changes';
import { automixReset } from './automix/reset';
import { inputsReset } from './input/reset';
import { outputsReset } from './output/reset';
import { fxsReset } from './fx/reset';
import { mgsReset } from './mg/reset';
import { dcasReset } from './dca/reset';
import { configurationReset } from './configuration/reset';
import { busesReset } from './bus/reset';
import { DeviceContextRoot } from '.';


// Exported
export const useDeviceReset = () => {
    const { features } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async ({ onComplete } = {}) => {
        await runScheduled((sched) => {
            automixReset(sched, features.automix);
            busesReset(
                sched, features.bus, features.input, features.dca, features.mg
            );
            configurationReset(features.configuration);
            dcasReset(sched, features.dca);
            fxsReset(sched, features.fx);
            inputsReset(sched, features.input);
            mgsReset(sched, features.mg);
            outputsReset(sched, features.output);
        });
        if (onComplete) onComplete();
    }, [features, runScheduled]);

    return { reset };
};
