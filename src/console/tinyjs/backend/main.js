// Requirements
import { Buffer } from 'buffer';
import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
    onUDPSocketError,
} from './helpers/udp.js';
import { dataDirSet } from './helpers/files.js';
import { electronDataMigrate } from './helpers/migration.js';
import { settingsLoad, settingsSet } from './helpers/settings.js';
import {
    vaultsLoad, vaultLoad, vaultSave, vaultErase, vaultEdit, vaultReplace,
} from './helpers/vault.js';
import {
    virtualDeviceRun, virtualDeviceStop, virtualDeviceIsRunning,
    virtualDevicePause, virtualDeviceResume,
} from './helpers/virtual.js';

// Variables
let appHandle = null;

let dataReady = null;


// Internal
const appSet = (app) => {
    if (appHandle) return;
    appHandle = app;
    dataDirSet(app.paths.data);
    dataReady = electronDataMigrate(app.paths.data);
};


// Page calls are tiny.api.call(name, { args: [...] }), spread into the helper
const handler = fn => ({ args = [] } = {}, app) => {
    appSet(app);
    return fn(...args);
};


// Settings and vaults wait for the Electron migration, or they'd create defaults first
const dataHandler = fn => async ({ args = [] } = {}, app) => {
    appSet(app);
    await dataReady;
    return fn(...args);
};


const onUDPError = (error, socketId) => {
    appHandle?.push('mmc.udpError', { error: String(error?.message ?? error), socketId });
};


const udpMessageReceived = socketId => (buffer, address, port) => {
    appHandle?.push('mmc.udp', {
        socketId,
        data: buffer.toString('base64'),
        address,
        port,
    });
};


// Exported
export const api = {
    'mmc.networkInterfaces': handler(() => tjs.system.networkInterfaces),

    'mmc.udpSocketOpen': handler(async (bindAddress, port, enableBroadcast) => {
        const socketId = await udpSocketOpen(bindAddress, port, enableBroadcast);
        onUDPMessageReceived(udpMessageReceived(socketId), socketId);
        onUDPSocketError(onUDPError, socketId);
        return socketId;
    }),
    'mmc.udpMessageSend': handler((socketId, address, port, base64) => {
        udpMessageSend(
            socketId, address, port, Buffer.from(base64, 'base64'), onUDPError
        );
    }),
    'mmc.udpSocketClose': handler(udpSocketClose),

    'mmc.settingsLoad': dataHandler(settingsLoad),
    'mmc.settingsSet': dataHandler(settingsSet),

    'mmc.vaultsLoad': dataHandler(vaultsLoad),
    'mmc.vaultLoad': dataHandler(vaultLoad),
    'mmc.vaultSave': dataHandler(vaultSave),
    'mmc.vaultErase': dataHandler(vaultErase),
    'mmc.vaultEdit': dataHandler(vaultEdit),
    'mmc.vaultReplace': dataHandler(vaultReplace),

    'mmc.virtualDeviceRun': handler(virtualDeviceRun),
    'mmc.virtualDeviceStop': handler(virtualDeviceStop),
    'mmc.virtualDeviceIsRunning': handler(virtualDeviceIsRunning),
    'mmc.virtualDevicePause': handler(virtualDevicePause),
    'mmc.virtualDeviceResume': handler(virtualDeviceResume),
};


export const init = (app) => {
    appSet(app);
};
