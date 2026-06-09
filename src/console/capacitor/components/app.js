// Requirements
import { App } from '@capacitor/app';


// Exported
export const onAppActive = async (callback) => {
    const currentState = await App.getState();
    callback(!!currentState?.isActive);
    const handler = await App.addListener('appStateChange', (v) => {
        callback(!!v?.isActive);
    });
    return handler;
};


export const onAppBackButton = async (callback) => {
    const handler = await App.addListener('backButton', callback);
    return handler;
};


export const appExit = async () => {
    await App.exitApp();
};
