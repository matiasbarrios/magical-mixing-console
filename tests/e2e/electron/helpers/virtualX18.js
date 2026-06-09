import { mixersInitialize } from '@magical-mixing/mixers';
import { x18Run, x18Stop } from '@magical-mixing/virtual-devices/x18/run/index.js';
import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} from '@magical-mixing/virtual-devices/helpers/udp.js';
import { E2E_IP, E2E_PORT } from '../constants.js';

const createNodePlatform = () => ({
    getLANBroadcastAddress: () => [{
        localAddress: '127.0.0.1',
        broadcastAddress: '127.0.0.1',
        interfaceName: 'lo0',
    }],
    getLocalAddressForIP: targetIp => (targetIp === '127.0.0.1' ? '127.0.0.1' : null),
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
});

let platform = null;
let running = false;

export const startVirtualX18 = async (ip = E2E_IP, port = E2E_PORT) => {
    if (running) return;
    platform = createNodePlatform();
    mixersInitialize(platform);
    await x18Run({ ip, port, platform });
    running = true;
};

export const stopVirtualX18 = async () => {
    if (!running) return;
    await x18Stop();
    running = false;
    platform = null;
};
