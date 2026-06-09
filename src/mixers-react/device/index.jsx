// Requirements
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useHasGet } from '../helpers/hasGet';
import { setCurrentFeatures } from './featuresBridge';


// Exported
export const DeviceContextRoot = createContext({});


export const DeviceContext = ({ device, children }) => {
    const state = useMemo(() => ({ ...device }), [device]);

    useEffect(() => {
        setCurrentFeatures(device?.features);
        return () => { setCurrentFeatures(null); };
    }, [device]);

    return (
        <DeviceContextRoot.Provider value={state}>
            {children}
        </DeviceContextRoot.Provider>
    );
};


export const useDevice = () => {
    const {
        deviceId, ip, port, name, model, brand, firmware,
        online, halted, connect, halt, resume, disconnect, dispose,
    } = useContext(DeviceContextRoot);

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
