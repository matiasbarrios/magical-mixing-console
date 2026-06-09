// Requirements
import { getLANInterfaces, getLocalAddressForIP } from '@magical-mixing/virtual-devices/helpers/lan.js';
import {
    udpSocketOpen as nodeUdpSocketOpen,
    udpSocketClose,
    udpMessageSend as nodeUdpMessageSend,
    onUDPMessageReceived,
} from '@magical-mixing/virtual-devices/helpers/udp.js';
import { mixersInitialize } from '../index.js';
import { isValidIP, isValidPort } from '../helpers/values.js';
import { runManualConnectTest, MANUAL_CONNECT_TEST_TARGET } from './manual-connect-test.js';


// Internal — Node dgram platform (same role as Electron main-process helpers, no IPC)
const nodePlatform = {
    getLANBroadcastAddress: getLANInterfaces,
    getLocalAddressForIP,
    udpSocketOpen: (bindAddress, port) => nodeUdpSocketOpen(bindAddress, port),
    udpSocketClose,
    udpMessageSend: (socketId, address, port, message) => {
        nodeUdpMessageSend(
            socketId,
            address,
            port,
            message,
            (error, socketIdOnError) => {
                console.error('[connectivity-test] UDP send error', error, {
                    socketId: socketIdOnError,
                });
            }
        );
    },
    onUDPMessageReceived,
};


// Main
const main = async () => {
    const ip = process.argv.length > 2 ? process.argv[2] : MANUAL_CONNECT_TEST_TARGET.ip;
    const port = process.argv.length > 3
        ? parseInt(process.argv[3], 10)
        : MANUAL_CONNECT_TEST_TARGET.port;

    if (!isValidIP(ip) || !isValidPort(port)) {
        console.error('[connectivity-test] Invalid IP or port');
        console.error('Usage: node src/mixers/examples/manual-connect-test-cli.js [ip] [port]');
        process.exit(1);
    }

    mixersInitialize(nodePlatform);

    try {
        await runManualConnectTest({
            ip,
            port,
            platform: nodePlatform,
            platformLabel: 'node-dgram (virtual-devices/helpers)',
            keepSessionOpen: false,
        });
        process.exit(0);
    } catch (error) {
        console.error('[connectivity-test] failed', error?.message || error);
        process.exit(1);
    }
};


main();
