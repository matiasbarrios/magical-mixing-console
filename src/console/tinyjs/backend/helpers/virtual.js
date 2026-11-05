// Requirements
import { deviceRun, deviceStop } from '@magical-mixing/virtual-devices';
import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} from './udp.js';


// Constants
const listenIp = '127.0.0.1';

const platform = {
    udpSocketOpen: (bindAddress, port, enableBroadcast) => (
        udpSocketOpen(listenIp, port, enableBroadcast)
    ),
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
};


// Variables
let ipRunning = null;
let portRunning = null;
let isRunning = false;
let isPaused = false;
let whichDevice = null;
let operation = Promise.resolve();


// Internal
const enqueue = (fn) => {
    const next = operation.then(() => fn());
    operation = next.catch(() => {});
    return next;
};


// Exported
export const virtualDeviceRun = (device, ip, port) => enqueue(async () => {
    if (isRunning) return;
    if (device) whichDevice = device;
    if (!whichDevice) return;
    isRunning = true;
    isPaused = false;
    ipRunning = listenIp;
    portRunning = port;
    await deviceRun(whichDevice, { ip: listenIp, port, platform });
});


export const virtualDeviceStop = () => enqueue(async () => {
    if (!isRunning) return;
    if (!whichDevice) return;
    isRunning = false;
    isPaused = false;
    await deviceStop(whichDevice);
});


export const virtualDeviceIsRunning = () => isRunning;


export const virtualDevicePause = () => enqueue(async () => {
    if (!isRunning || isPaused) return;
    isPaused = true;
    await deviceStop(whichDevice);
});


export const virtualDeviceResume = () => enqueue(async () => {
    if (!isRunning || !isPaused) return;
    isPaused = false;
    await deviceRun(whichDevice, { ip: ipRunning, port: portRunning, platform });
});
