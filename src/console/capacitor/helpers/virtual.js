// Requirements
import { deviceRun, deviceStop } from '@magical-mixing/virtual-devices';
import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} from './udp';


// Constants
const platform = {
    udpSocketOpen,
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


// Exported
export const virtualDeviceRun = async (device, ip, port) => {
    if (isRunning) return;
    if (device) whichDevice = device;
    if (!whichDevice) return;
    isRunning = true;
    ipRunning = ip;
    portRunning = port;
    await deviceRun(whichDevice, { ip, port, platform });
};


export const virtualDeviceStop = async () => {
    if (!isRunning) return;
    if (!whichDevice) return;
    isRunning = false;
    await deviceStop(whichDevice);
};


export const virtualDeviceIsRunning = () => isRunning;


export const virtualDevicePause = async () => {
    if (!isRunning || isPaused) return;
    isPaused = true;
    await deviceStop(whichDevice);
};


export const virtualDeviceResume = async () => {
    if (!isRunning || !isPaused) return;
    isPaused = false;
    await deviceRun(whichDevice, { ip: ipRunning, port: portRunning, platform });
};
