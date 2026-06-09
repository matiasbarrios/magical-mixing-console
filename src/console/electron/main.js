

// Requirements
const path = require('path');
const {
    app, BrowserWindow, ipcMain, Menu, shell,
} = require('electron');
const { getLANBroadcastAddress, getLocalAddressForIP } = require('./helpers/lan');
const {
    udpSocketOpen,
    udpSocketsClose,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} = require('./helpers/udp');
const { settingsLoad, settingsSet } = require('./helpers/settings');
const {
    vaultsLoad, vaultLoad, vaultSave, vaultErase, vaultEdit, vaultReplace,
} = require('./helpers/vault');
const { getOSLanguage } = require('./helpers/os');
const { appActiveAttach, getAppActive } = require('./helpers/app');
const {
    virtualDeviceRun, virtualDeviceStop, virtualDeviceIsRunning,
    virtualDevicePause, virtualDeviceResume,
} = require('./helpers/virtual');
const {
    captureScreenshot,
    captureScreenshotDialog,
    buildDevScreenshotMenu,
    getWebsiteAssetsDir,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    STORE_SCALE,
} = require('./helpers/screenshot');


// Initialization
// Run this as early in the main process as possible
if (require('electron-squirrel-startup')) app.quit();


const isE2E = !!process.env.MMC_E2E;

if (process.env.MMC_E2E_USER_DATA) {
    app.setPath('userData', process.env.MMC_E2E_USER_DATA);
}

if (isE2E) {
    app.commandLine.appendSwitch('remote-debugging-port',
        process.env.MMC_E2E_CDP_PORT || '9222');
}


// Constants
const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets/icon/icon.png')
    : path.join(__dirname, '../../../assets/icon/icon.png');


// Variables
let mainWindow = null;

let webContents = null;


// Internal
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1050,
        height: 680,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon: iconPath,
    });

    // Hide the menu bar
    mainWindow.setMenuBarVisibility(false);

    // Load the appropriate URL based on the environment
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open DevTools in development mode (skip during Playwright E2E)
    if (process.env.NODE_ENV !== 'production' && !isE2E) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    webContents = mainWindow.webContents;

    appActiveAttach(mainWindow);
};


const onIPCResponse = callback => (event, ...args) => {
    event.returnValue = callback(...args);
};


const udpMessageReceived = socketId => (buffer, address, port) => {
    if (mainWindow?.isDestroyed() || webContents?.isDestroyed()) return;
    try {
        if (webContents?.send) webContents.send(`onUDPMessageReceived_${socketId}`, buffer, address, port);
    } catch (error) {
        console.error(`On UDP message received error: ${error.message}`);
    }
};


const onUDPError = (error, socketId) => {
    if (mainWindow?.isDestroyed() || webContents?.isDestroyed()) return;
    try {
        if (webContents?.send) webContents.send('onUDPError', error, socketId);
    } catch (error2) {
        console.error(`On UDP error error: ${error2.message}`);
    }
};


// Main — dev menu (Screenshot submenu) is set in app.whenReady()
if (process.env.NODE_ENV === 'production') {
    Menu.setApplicationMenu(null);
}


app.on('window-all-closed', () => {
    mainWindow = null;
    webContents = null;
    if (process.platform === 'darwin') return;
    app.quit();
});


app.on('before-quit', () => {
    setTimeout(udpSocketsClose);
});


// When ready
app.whenReady().then(() => {
    createWindow();

    // Handlers
    ipcMain.on('getLANBroadcastAddress', onIPCResponse(getLANBroadcastAddress));
    ipcMain.on('getLocalAddressForIP', onIPCResponse(ip => getLocalAddressForIP(ip)));

    ipcMain.handle('udpSocketOpen', async (_, bindAddress, port, enableBroadcast) => {
        const socketId = await udpSocketOpen(bindAddress, port, enableBroadcast);
        onUDPMessageReceived(udpMessageReceived(socketId), socketId);
        return socketId;
    });
    ipcMain.on('udpMessageSend', onIPCResponse((...args) => udpMessageSend(...args, onUDPError)));
    ipcMain.handle('udpSocketClose', (_, ...args) => udpSocketClose(...args));

    ipcMain.handle('settingsLoad', (_, ...args) => settingsLoad(...args));
    ipcMain.handle('settingsSet', (_, ...args) => settingsSet(...args));

    ipcMain.handle('vaultsLoad', (_, ...args) => vaultsLoad(...args));
    ipcMain.handle('vaultLoad', (_, ...args) => vaultLoad(...args));
    ipcMain.handle('vaultSave', (_, ...args) => vaultSave(...args));
    ipcMain.handle('vaultErase', (_, ...args) => vaultErase(...args));
    ipcMain.handle('vaultEdit', (_, ...args) => vaultEdit(...args));
    ipcMain.handle('vaultReplace', (_, ...args) => vaultReplace(...args));

    ipcMain.on('getOSLanguage', onIPCResponse(getOSLanguage));
    ipcMain.on('getAppActive', onIPCResponse(getAppActive));

    ipcMain.handle('virtualDeviceRun', (_, ...args) => virtualDeviceRun(...args));
    ipcMain.handle('virtualDeviceStop', (_, ...args) => virtualDeviceStop(...args));
    ipcMain.handle('virtualDeviceIsRunning', (_, ...args) => virtualDeviceIsRunning(...args));
    ipcMain.handle('virtualDevicePause', (_, ...args) => virtualDevicePause(...args));
    ipcMain.handle('virtualDeviceResume', (_, ...args) => virtualDeviceResume(...args));

    ipcMain.handle('openExternal', (_, url) => {
        if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
            shell.openExternal(url);
        }
    });

    if (process.env.NODE_ENV !== 'production') {
        Menu.setApplicationMenu(buildDevScreenshotMenu(() => mainWindow));

        ipcMain.handle('captureScreenshot', (_, outputPath, options) => captureScreenshot(mainWindow,
            outputPath,
            options));
        ipcMain.handle('captureScreenshotDialog', (_, options) => captureScreenshotDialog(mainWindow,
            options));

        console.log('Dev screenshots: menu bar → Screenshot. '
            + `Web = display DPR; stores = ${STORE_SCALE}× (${DEFAULT_WIDTH * STORE_SCALE}×${DEFAULT_HEIGHT * STORE_SCALE}). `
            + `Website assets: ${getWebsiteAssetsDir()}`);
    }

    // iOS specific
    app.on('activate', () => {
        const active = BrowserWindow.getAllWindows();
        if (!active.length) {
            createWindow();
        } else {
            [mainWindow] = active;
            webContents = mainWindow.webContents;
            mainWindow.show();
        }
    });
});
