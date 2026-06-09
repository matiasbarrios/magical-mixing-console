// Requirements
import { useEffect, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { platformGet } from '../../platform';


// Constants
// Debounce resume after returning from inactive (mobile background, desktop OS sleep).
// Desktop does not go inactive on window blur — only on powerMonitor suspend.
const APP_ACTIVE_RESUME_DELAY = 250;


// Exported
export const useAppActive = () => {
    const [active, setActive] = useState(null);

    useEffect(() => {
        let activeHandler = null;
        const add = async () => {
            activeHandler = await platformGet().onAppActive(setActive);
        };
        add();
        return async () => {
            if (activeHandler) await activeHandler.remove();
        };
    }, []);

    return {
        active,
    };
};


export const AppActive = ({ children }) => {
    const { halt, resume } = useDevice();
    const { active } = useAppActive();

    useEffect(() => {
        if (active === null) return () => {};

        if (!active) {
            halt();
            platformGet().virtualDevicePause();
            return () => {};
        }

        const timeout = setTimeout(() => {
            resume();
            platformGet().virtualDeviceResume();
        }, APP_ACTIVE_RESUME_DELAY);

        return () => clearTimeout(timeout);
    }, [halt, resume, active]);

    return children;
};
