// Requirements
import { useContext } from 'react';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { DeviceContextRoot } from '..';


// Exported
export const useAutomixLock = (automixId) => {
    const { features: { automix: { lock } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(lock, automixId);

    return {
        has, value, set, toggle,
    };
};
