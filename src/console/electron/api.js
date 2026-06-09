// Requirements
const { contextBridge, ipcRenderer } = require('electron');


// Internal
const registerCallback = (name, callback) => {
    const listener = (_, ...args) => callback(...args);
    ipcRenderer.on(name, listener);
    return () => {
        ipcRenderer.off(name, listener);
    };
};


// Exported
contextBridge.exposeInMainWorld('electron', {
    getLANBroadcastAddress: () => ipcRenderer.sendSync('getLANBroadcastAddress'),
    getLocalAddressForIP: ip => ipcRenderer.sendSync('getLocalAddressForIP', ip),
    udpSocketOpen: (a, p, b) => ipcRenderer.invoke('udpSocketOpen', a, p, b),
    onUDPMessageReceived: (callback, socketId) => registerCallback(`onUDPMessageReceived_${socketId}`, callback),
    udpMessageSend: (...args) => ipcRenderer.sendSync('udpMessageSend', ...args),
    udpSocketClose: (...args) => ipcRenderer.invoke('udpSocketClose', ...args),
    onUDPError: callback => registerCallback('onUDPError', callback),
    settingsLoad: () => ipcRenderer.invoke('settingsLoad'),
    settingsSet: s => ipcRenderer.invoke('settingsSet', s),
    vaultsLoad: (...args) => ipcRenderer.invoke('vaultsLoad', ...args),
    vaultLoad: (...args) => ipcRenderer.invoke('vaultLoad', ...args),
    vaultSave: (...args) => ipcRenderer.invoke('vaultSave', ...args),
    vaultErase: (...args) => ipcRenderer.invoke('vaultErase', ...args),
    vaultEdit: (...args) => ipcRenderer.invoke('vaultEdit', ...args),
    vaultReplace: (...args) => ipcRenderer.invoke('vaultReplace', ...args),
    getOSLanguage: () => ipcRenderer.sendSync('getOSLanguage'),
    onAppActive: (callback) => {
        callback(ipcRenderer.sendSync('getAppActive'));
        const listener = (_, isActive) => callback(isActive);
        ipcRenderer.on('appActiveChange', listener);
        return {
            remove: () => {
                ipcRenderer.off('appActiveChange', listener);
            },
        };
    },
    virtualDeviceRun: (...args) => ipcRenderer.invoke('virtualDeviceRun', ...args),
    virtualDeviceStop: (...args) => ipcRenderer.invoke('virtualDeviceStop', ...args),
    virtualDeviceIsRunning: (...args) => ipcRenderer.invoke('virtualDeviceIsRunning', ...args),
    virtualDevicePause: (...args) => ipcRenderer.invoke('virtualDevicePause', ...args),
    virtualDeviceResume: (...args) => ipcRenderer.invoke('virtualDeviceResume', ...args),
    openExternal: url => ipcRenderer.invoke('openExternal', url),
    captureScreenshot: (outputPath, options) => ipcRenderer.invoke('captureScreenshot',
        outputPath,
        options),
    captureScreenshotDialog: options => ipcRenderer.invoke('captureScreenshotDialog', options),
});
