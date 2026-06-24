// Requirements
import {
    createContext, useContext, useCallback, useState, useMemo,
} from 'react';


// Constants
const DISCONNECT_DELAY = 300;


// Variables
const Context = createContext({});


// Exported
export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([]);
    const [focused, setFocused] = useState(null);

    const status = useMemo(() => ({
        devices, setDevices, focused, setFocused,
    }), [devices, setDevices, focused, setFocused]);

    return (
        <Context.Provider value={status}>
            {children}
        </Context.Provider>
    );
};


export const useDevices = () => {
    const {
        devices, setDevices, focused, setFocused,
    } = useContext(Context);

    const focus = useCallback((d) => {
        setFocused(devices.find(d2 => d2.deviceId === d.deviceId) || null);
    }, [devices, setFocused]);

    const deviceAdd = useCallback((d) => {
        setDevices([...devices, d]);
        setFocused(d);
    }, [devices, setFocused, setDevices]);

    const deviceRemove = useCallback((d) => {
        const i = devices.findIndex(d2 => d2.deviceId === d.deviceId);
        const newDevices = [...devices.filter(d2 => d2.deviceId !== d.deviceId)];
        setDevices(newDevices);

        let newIndex = i || null;
        if (newDevices.length === 0) {
            newIndex = null;
        } else if (i >= newDevices.length) {
            newIndex = newDevices.length - 1;
        }
        setFocused(newIndex !== null ? newDevices[newIndex] : null);

        setTimeout(async () => {
            await d.dispose();
        }, DISCONNECT_DELAY);
    }, [devices, setFocused, setDevices]);

    const devicesHas = useCallback((ip, port) => devices
        .find(d2 => d2.ip === ip && d2.port === parseInt(port, 10)) !== undefined, [devices]);

    return {
        devices,
        deviceAdd,
        deviceRemove,
        devicesHas,
        focused,
        focus,
    };
};
