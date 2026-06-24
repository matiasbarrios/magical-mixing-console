// Requirements
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { isMobile, platformGet } from '../../../platform';


// Internal
const isLocalhost = ({ localAddress, interfaceName }) => (
    localAddress === '127.0.0.1' || interfaceName === 'lo0'
);

const formatSearchNetwork = (localAddress, broadcastAddress) => {
    const local = localAddress.split('.');
    const broadcast = broadcastAddress.split('.');
    const parts = [];

    for (let i = 0; i < 4; i += 1) {
        if (local[i] === broadcast[i]) {
            parts.push(local[i]);
        } else {
            parts.push('0');
            break;
        }
    }

    return parts.join('.');
};


// Exported
export default () => {
    const { t } = useLanguage();
    const [searchInterfaces, setSearchInterfaces] = useState(null);

    const loadSearchInterfaces = useCallback(() => {
        if (isMobile) return;
        const getLAN = platformGet()?.getLANBroadcastAddress;
        if (!getLAN) return;
        setSearchInterfaces(getLAN() ?? []);
    }, []);

    useEffect(() => {
        loadSearchInterfaces();
    }, [loadSearchInterfaces]);

    const searchNetworks = useMemo(() => {
        if (!searchInterfaces) return [];

        return searchInterfaces
            .filter(iface => !isLocalhost(iface))
            .map(({ localAddress, broadcastAddress }) => (
                formatSearchNetwork(localAddress, broadcastAddress)
            ))
            .filter((network, index, networks) => networks.indexOf(network) === index);
    }, [searchInterfaces]);

    if (isMobile || searchNetworks.length === 0) return null;

    const label = searchNetworks.length === 1 ? t('Network:') : t('Networks:');

    return (
        <Text size="1" color="gray">
            { `${label} ${searchNetworks.join(', ')}` }
        </Text>
    );
};
