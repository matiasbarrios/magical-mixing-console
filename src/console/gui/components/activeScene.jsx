// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useDevice } from '@magical-mixing/mixers-react';


// Variables
const Context = createContext(null);


// Exported
export const ActiveDeviceSceneProvider = ({ children }) => {
    const { deviceId } = useDevice();
    const [sceneId, setSceneId] = useState(null);

    useEffect(() => {
        setSceneId(null);
    }, [deviceId]);

    const setLoadedScene = useCallback((id) => {
        setSceneId(id);
    }, []);

    const clearLoadedScene = useCallback(() => {
        setSceneId(null);
    }, []);

    const value = useMemo(() => ({
        sceneId,
        setLoadedScene,
        clearLoadedScene,
    }), [sceneId, setLoadedScene, clearLoadedScene]);

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};


export const useActiveDeviceScene = () => {
    const value = useContext(Context);
    if (!value) {
        throw new Error('useActiveDeviceScene must be used within ActiveDeviceSceneProvider');
    }
    return value;
};
