// Requirements
const { powerMonitor } = require('electron');


// Variables
let webContents = null;
let systemActive = true;


// Internal
// Desktop stays "active" while the window is unfocused or minimized so the mixer session
// keeps receiving OSC (multi-screen / phone + laptop). Only OS sleep suspends the session.
// Mobile uses Capacitor App state instead (background → inactive).
const isAppActive = () => systemActive;


const notifyActive = () => {
    if (webContents?.isDestroyed()) return;
    try {
        if (webContents?.send) webContents.send('appActiveChange', isAppActive());
    } catch (error) {
        console.error(`App active notify error: ${error.message}`);
    }
};


// Exported
const appActiveAttach = (win) => {
    webContents = win.webContents;

    powerMonitor.on('suspend', () => {
        systemActive = false;
        notifyActive();
    });
    powerMonitor.on('resume', () => {
        systemActive = true;
        notifyActive();
    });
};


const getAppActive = () => isAppActive();


module.exports = {
    appActiveAttach,
    getAppActive,
};
