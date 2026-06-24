// Requirements
import { createContext, useContext, useMemo } from 'react';
import { useHasGet } from '../helpers/hasGet';
import { ChangesProvider } from '../helpers/changes';


// Exported
export const DeviceContext = createContext({});


export const DeviceProvider = ({ device, children }) => {
    const state = useMemo(() => ({ ...device }), [device]);

    return (
        <DeviceContext.Provider value={state}>
            <ChangesProvider features={device?.features}>
                {children}
            </ChangesProvider>
        </DeviceContext.Provider>
    );
};


export const useDevice = () => {
    const {
        deviceId, ip, port, name, model, brand, firmware,
        online, halted, connect, halt, resume, disconnect, dispose,
    } = useContext(DeviceContext);

    const [, isOnline] = useHasGet(online);
    const [, isHalted] = useHasGet(halted);

    return {
        // Values
        deviceId,
        ip,
        port,
        name,
        model,
        brand,
        firmware,
        isOnline,
        isHalted,
        disabled: !isOnline || isHalted, // For ease of use

        // Functions
        connect,
        halt,
        resume,
        disconnect,
        dispose,
    };
};
