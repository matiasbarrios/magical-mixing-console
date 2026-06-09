import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} from '@magical-mixing/virtual-devices/helpers/udp.js';

const localhostInterface = {
    localAddress: '127.0.0.1',
    broadcastAddress: '127.0.0.1',
    interfaceName: 'lo0',
};

export const createNodePlatform = () => ({
    getLANBroadcastAddress: () => [localhostInterface],
    getLocalAddressForIP: (targetIp) => (targetIp === '127.0.0.1' ? '127.0.0.1' : null),
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
});
