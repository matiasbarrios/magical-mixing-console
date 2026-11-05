// Requirements
import { Netmask } from 'netmask';
import { call } from './bridge';


// Constants
const NON_LAN_INTERFACE_PREFIXES = ['awdl', 'llw'];

const PRIVATE_RANGES = [
    new Netmask('10.0.0.0/8'),
    new Netmask('172.16.0.0/12'),
    new Netmask('192.168.0.0/16'),
    new Netmask('169.254.0.0/16'),
];

const IPV4_RE = /^\d{1,3}(\.\d{1,3}){3}$/;


// Variables
let ipv4Interfaces = [];


// Internal
const isNonLANInterface = name => NON_LAN_INTERFACE_PREFIXES
    .some(prefix => name.startsWith(prefix));


const getInterfacePriority = (name) => {
    const enMatch = name.match(/^en(\d+)$/);
    if (enMatch) return Number(enMatch[1], 10);

    const utunMatch = name.match(/^utun(\d+)$/);
    if (utunMatch) return 50 + Number(utunMatch[1], 10);

    const pppMatch = name.match(/^ppp(\d+)$/);
    if (pppMatch) return 50 + Number(pppMatch[1], 10);

    return 100;
};


const pickBestInterface = (interfaces) => {
    if (!interfaces.length) return null;

    return [...interfaces].sort((a, b) => {
        const prefixDiff = b.netmask.bitmask - a.netmask.bitmask;
        if (prefixDiff !== 0) return prefixDiff;
        return getInterfacePriority(a.name) - getInterfacePriority(b.name);
    })[0];
};


// Exported
// The mixers layer reads interfaces synchronously, so they are cached here.
// txiki.js reports neither `family` nor `cidr`: IPv4 is detected by address shape.
export const lanRefresh = async () => {
    try {
        const interfaces = await call('networkInterfaces');
        ipv4Interfaces = (interfaces || [])
            .filter(i => IPV4_RE.test(i.address) && IPV4_RE.test(i.netmask) && !i.internal)
            .filter(i => !isNonLANInterface(i.name))
            .map(i => ({ ...i, netmask: new Netmask(i.address, i.netmask) }));
    } catch (error) {
        console.error(`Unable to read network interfaces: ${error.message}`);
    }
};


export const getLANBroadcastAddress = () => {
    const interfaces = ipv4Interfaces
        .filter(i => PRIVATE_RANGES.some(range => range.contains(i.address)))
        .map(i => ({
            localAddress: i.address,
            broadcastAddress: i.netmask.broadcast,
            interfaceName: i.name,
        }));

    return [{
        localAddress: '127.0.0.1',
        broadcastAddress: '127.0.0.1',
        interfaceName: 'lo0',
    }, ...interfaces];
};


export const getLocalAddressForIP = (targetIp) => {
    if (!targetIp) return null;
    if (targetIp === '127.0.0.1') return '127.0.0.1';

    const match = pickBestInterface(ipv4Interfaces.filter(i => i.netmask.contains(targetIp)));
    return match?.address ?? null;
};
