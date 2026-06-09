// Exported
export const getLANBroadcastAddress = () => [
    { localAddress: '127.0.0.1', broadcastAddress: '127.0.0.1' },
    { localAddress: '0.0.0.0', broadcastAddress: '255.255.255.255' },
];


export const getLocalAddressForIP = (targetIp) => {
    if (targetIp === '127.0.0.1') return '127.0.0.1';
    return null;
};
