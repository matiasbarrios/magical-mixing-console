// Requirements
import { lanRefresh } from './lan';


// Exported
export const getOSLanguage = async () => {
    let locale = '';
    try {
        // tiny.system.locale() is macOS only; elsewhere it resolves null or rejects
        locale = (await window.tiny.system.locale())?.language || '';
    } catch {
        // Ignore
    }
    if (!locale) locale = navigator.language || '';
    return locale.split('-')[0] || '';
};


// Desktop stays "active" while unfocused or minimized; only OS sleep suspends the session
export const onAppActive = async (callback) => {
    callback(true);
    const offSleep = window.tiny.api.on('sleep', () => callback(false));
    const offWake = window.tiny.api.on('wake', () => {
        lanRefresh();
        callback(true);
    });
    return {
        remove: () => {
            offSleep();
            offWake();
        },
    };
};


export const openExternal = async (url) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
    await window.tiny.app.shell.open(url);
};
