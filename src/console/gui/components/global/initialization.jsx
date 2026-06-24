// Requirements
import { useEffect, useState } from 'react';
import { mixersInitialize } from '@magical-mixing/mixers-react';
import { platformGet, platformLoad } from '../../platform';
import { translationInitialize } from '../language/translations';
import { vaultSetProvider } from '../vault';
import { settingsSetProvider } from './settings';


// Exported
export default ({ children }) => {
    const [initialized, setInitialized] = useState(false);

    // On load
    useEffect(() => {
        const initialization = async () => {
            // Initialize components
            await platformLoad();
            const platform = platformGet();
            const osLanguage = await platform.getOSLanguage();
            await translationInitialize(osLanguage);

            await settingsSetProvider({
                settingsLoad: platform.settingsLoad,
                settingsSet: platform.settingsSet,
            });

            await vaultSetProvider({
                vaultsLoad: platform.vaultsLoad,
                vaultLoad: platform.vaultLoad,
                vaultSave: platform.vaultSave,
                vaultErase: platform.vaultErase,
                vaultEdit: platform.vaultEdit,
                vaultReplace: platform.vaultReplace,
            });

            mixersInitialize({
                getLANBroadcastAddress: platform.getLANBroadcastAddress,
                getLocalAddressForIP: platform.getLocalAddressForIP,
                udpSocketOpen: platform.udpSocketOpen,
                udpSocketClose: platform.udpSocketClose,
                udpMessageSend: platform.udpMessageSend,
                onUDPMessageReceived: platform.onUDPMessageReceived,
                cacheMaxEntries: 1024,
            });

            setInitialized(true);
        };
        initialization();
    }, []);

    // It initialized, render the app
    if (!initialized) return null;
    return children;
};
