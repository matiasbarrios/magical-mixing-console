// Requirements
import { useCallback, useEffect, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';


// Constants
const FLUSH_INTERVAL = 500;


// Variables
let settings = {};
let provider = null;
let providerTimer = null;


// Internal
const settingsFlush = () => {
    if (providerTimer) {
        clearTimeout(providerTimer);
    }
    providerTimer = setTimeout(() => {
        provider.settingsSet(settings);
    }, FLUSH_INTERVAL);
};


const settingsGet = (key, defaultValue) => {
    if (!provider) return defaultValue;
    return (settings[key] !== undefined) ? settings[key] : defaultValue;
};


const settingsSet = (key, value) => {
    if (!provider || !key || value === undefined) return;
    settings[key] = value;
    settingsFlush();
};


const settingsGetForDevice = (deviceId, settingId, defaultValue) => {
    if (!provider) return defaultValue;
    if (!settings.devices) settings.devices = {};
    if (settings.devices[deviceId] === undefined) return defaultValue;
    if (settings.devices[deviceId][settingId] === undefined) return defaultValue;
    return settings.devices[deviceId][settingId];
};


const settingsSetForDevice = (deviceId, settingId, value) => {
    if (!provider || [deviceId, settingId, value].some(v => v === undefined)) return;
    settings.devices ||= {};
    settings.devices[deviceId] ||= {};
    settings.devices[deviceId][settingId] = value;
    settingsFlush();
};


// Exported
export const readSetting = (key, defaultValue) => settingsGet(key, defaultValue);

export const writeSetting = (key, value) => settingsSet(key, value);

export const settingsSetProvider = async (p) => {
    provider = p;
    settings = await provider.settingsLoad();
};


export const useSettings = (settingId, defaultValue, undefinedIfUnloaded) => {
    const [value, valueSet] = useState(undefinedIfUnloaded ? undefined : defaultValue);

    const setValue = useCallback((v) => {
        valueSet(v);
        settingsSet(settingId, v);
    }, [settingId]);

    useEffect(() => {
        valueSet(settingsGet(settingId, defaultValue));
    }, [settingId, defaultValue]);

    return [value, setValue];
};


export const useDeviceSettings = (settingId, defaultValue, undefinedIfUnloaded) => {
    const { deviceId } = useDevice();

    const [value, valueSet] = useState(undefinedIfUnloaded ? undefined : defaultValue);

    const setValue = useCallback((v) => {
        valueSet(v);
        settingsSetForDevice(deviceId, settingId, v);
    }, [deviceId, settingId]);

    useEffect(() => {
        valueSet(settingsGetForDevice(deviceId, settingId, defaultValue));
    }, [deviceId, settingId, defaultValue]);

    return [value, setValue];
};
