// Requirements
import {
    udpMessageSend,
    udpSocketClose,
    udpSocketOpen,
    onUDPMessageReceived,
} from '../../helpers/udp.js';
import { xr12Run, xr12Stop } from './index.js';


// Main
const main = async () => {
    const platform = {
        udpSocketOpen,
        udpSocketClose,
        udpMessageSend,
        onUDPMessageReceived,
    };

    await xr12Run({ platform });

    process.on('SIGINT', async () => {
        await xr12Stop();
        process.exit();
    });
};


main();
