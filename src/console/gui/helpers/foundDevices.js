const LOCALHOST_IP = '127.0.0.1';

export const isLocalhostIp = ip => ip === LOCALHOST_IP;

/** When the same desk name appears on localhost and LAN, keep only localhost. */
export const filterDuplicateLocalhostDevices = (devices) => {
    if (!devices?.length) return devices;

    const byName = new Map();
    devices.forEach((d) => {
        if (!byName.has(d.name)) byName.set(d.name, []);
        byName.get(d.name).push(d);
    });

    const hidden = new Set();
    byName.forEach((group) => {
        if (group.length < 2) return;
        if (!group.some(d => isLocalhostIp(d.ip))) return;
        group.forEach((d) => {
            if (!isLocalhostIp(d.ip)) hidden.add(`${d.ip}:${d.port}`);
        });
    });

    if (!hidden.size) return devices;
    return devices.filter(d => !hidden.has(`${d.ip}:${d.port}`));
};
