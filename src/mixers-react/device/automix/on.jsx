// Requirements
import { useContext } from 'react';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { DeviceContextRoot } from '..';


// Exported
export const useAutomixOn = (automixId) => {
    const { features: { automix: { on } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, automixId);

    return {
        has, value, set, toggle,
    };
};
