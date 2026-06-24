// Requirements
import { lanSetProvider } from './helpers/lan.js';
import { fromBuffer, toBuffer } from './helpers/osc.js';
import { udpOSCSetProvider, udpOSCSetCacheConfig } from './controllers/udpOSC/index.js';


// Exported
export const oscFromBuffer = fromBuffer;


export const oscToBuffer = toBuffer;


export { searchNew } from './devices/search.js';


export const mixersInitialize = ({
    getLANBroadcastAddress,
    getLocalAddressForIP,
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
    cacheMaxEntries,
}) => {

    lanSetProvider({
        getLANBroadcastAddress,
        getLocalAddressForIP,
    });
    udpOSCSetProvider({
        udpSocketOpen,
        udpSocketClose,
        udpMessageSend,
        onUDPMessageReceived,
    });
    if (cacheMaxEntries != null) {
        udpOSCSetCacheConfig({ maxEntries: cacheMaxEntries });
    }
};
