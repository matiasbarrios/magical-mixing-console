// Requirements
import { Buffer } from 'buffer';
import { oscFromBuffer, oscToBuffer } from '@magical-mixing/mixers';
import { scaleLinear } from 'd3';


// Constants
const listeningIpDefault = '127.0.0.1';

const listeningPortDefault = 10024;

const subscriptionInterval = 200;

const keepAliveTimeout = 10 * 1000;

const knownAddresses = ['/-snap/save', '/-snap/load'];

const floodingMaxMessages = 2;

const floodingTimeWindow = 1000;

const subscriptionLengths = {
    '/meters/0': (8 * 2) + 4,
    '/meters/1': (40 * 2) + 4,
    '/meters/2': (36 * 2) + 4,
    '/meters/3': (56 * 2) + 4,
    '/meters/4': (100 * 2) + 4,
    '/meters/5': (44 * 2) + 4,
    '/meters/6': (39 * 2) + 4,
    '/meters/7': (16 * 2) + 4,
    '/meters/8': (4 * 2) + 4,
};


// Exported
export const createVirtualDesk = ({
    deviceName,
    deviceModel,
    deviceFirmware,
    addressesValues,
}) => {
    let provider = null;
    let socketId = null;
    let unlistenMessageReceived = null;
    let listeningAddress = null;
    let metersValues = {};
    const metersValuesSubscriptions = {};
    let subscriptions = {};
    let changeListeners = {};
    const flood = {};

    const dbScale = scaleLinear()
        .domain([-1, 1])
        .range([-90, 0]);

    const createRadioVolumeSimulator = ({
        smoothness = 0.9,
        volatility = 0.1,
    } = {}) => {
        let x = 0;

        return function getDb() {
            const w = (Math.random() * 2 - 1) * volatility;
            x = smoothness * x + w;
            x = Math.max(-1, Math.min(1, x));
            return dbScale(x);
        };
    };

    const floodingCheck = (address) => {
        if (!flood[address]) flood[address] = [];
        const now = Date.now();
        flood[address] = flood[address]
            .filter(t => now - t < floodingTimeWindow);
        flood[address].push(Date.now());
        if (flood[address].length > floodingMaxMessages) {
            console.warn(`${address} ${flood[address].length} times / ${floodingTimeWindow} ms`);
        }
    };

    const initializeSimulatedWave = (meterAddress) => {
        if (!subscriptionLengths[meterAddress]) {
            throw new Error(`No subscription length for ${meterAddress}`);
        }

        const length = subscriptionLengths[meterAddress];
        const simulators = Array(length).fill(0).map(() => createRadioVolumeSimulator({
            smoothness: 0.85,
            volatility: 0.55,
        }));
        const r = { values: simulators.map(s => s()) };
        r.interval = setInterval(() => {
            r.values = simulators.map(s => s());
        }, subscriptionInterval);
        return r;
    };

    const busesInGroupAddresses = (groupAddress, groupNumber) => {
        let busesAddresses = Object.keys(addressesValues).filter(a => a.endsWith(groupAddress));
        busesAddresses = busesAddresses.filter((a) => {
            const binaryValue = addressesValues[a].toString(2).padStart(4, '0');
            return binaryValue.charAt(4 - groupNumber) === '1';
        });
        return busesAddresses;
    };

    const doWrite = (
        oscAddress, args, ip, port, force = false
    ) => {
        addressesValues[oscAddress] = args[0].value;

        Object.keys(changeListeners).forEach((sIp) => {
            Object.keys(changeListeners[sIp]).forEach((sPort) => {
                const nSPort = parseInt(sPort, 10);
                if (!force && sIp === ip && nSPort === port) return;
                provider.udpMessageSend(socketId, sIp, nSPort, oscToBuffer({
                    address: oscAddress,
                    args,
                }));
            });
        });
    };

    const processOSCMessage = (buffer, ip, port) => {
        try {
            const decodedMessage = oscFromBuffer(buffer);
            const { address: oscAddress, args } = decodedMessage;

            floodingCheck(oscAddress);

            if (oscAddress === '/status') {
                provider.udpMessageSend(socketId, ip, port, oscToBuffer({
                    address: '/status',
                    args: ['active', listeningAddress, deviceName],
                }));
                return;
            }

            if (oscAddress === '/xremotenfb') {
                if (!changeListeners[ip]) changeListeners[ip] = {};
                if (!changeListeners[ip][port]) {
                    changeListeners[ip][port] = {};
                } else {
                    clearTimeout(changeListeners[ip][port].expiration);
                }
                changeListeners[ip][port].expiration = setTimeout(() => {
                    delete changeListeners[ip][port];
                }, keepAliveTimeout);
                return;
            }

            if (oscAddress === '/meters' || oscAddress === '/batchsubscribe' || oscAddress === '/renew') {
                if (!args?.length) {
                    console.log('No meters address provided');
                    return;
                }

                let meterAddress = null;
                if (oscAddress === '/meters') {
                    meterAddress = args[0].value;
                } else if (['/batchsubscribe', '/renew'].includes(oscAddress)) {
                    meterAddress = `/${args[0].value}`;
                }

                const subscriptionId = `${ip}:${port}:${meterAddress}`;

                if (!metersValues[meterAddress]) {
                    try {
                        metersValues[meterAddress] = initializeSimulatedWave(meterAddress);
                    } catch (error) {
                        console.log(error);
                        return;
                    }
                }
                if (!metersValuesSubscriptions[meterAddress]) {
                    metersValuesSubscriptions[meterAddress] = {};
                }
                metersValuesSubscriptions[meterAddress][subscriptionId] = true;

                if (!subscriptions[subscriptionId]) {
                    subscriptions[subscriptionId] = {
                        interval: setInterval(() => {
                            provider.udpMessageSend(socketId, ip, port, oscToBuffer({
                                address: meterAddress,
                                args: Buffer.from(metersValues[meterAddress].values),
                            }));
                        }, subscriptionInterval),
                    };
                } else {
                    clearTimeout(subscriptions[subscriptionId].expiration);
                }
                subscriptions[subscriptionId].expiration = setTimeout(() => {
                    if (!subscriptions[subscriptionId]) return;
                    if (subscriptions[subscriptionId].interval) {
                        clearInterval(subscriptions[subscriptionId].interval);
                    }
                    delete subscriptions[subscriptionId];
                }, keepAliveTimeout);

                return;
            }

            if (oscAddress === '/unsubscribe') {
                if (!args?.length) return;

                const meterAddress = args[0].value;
                const subscriptionId = `${ip}:${port}:${meterAddress}`;

                if (subscriptions[subscriptionId]) {
                    clearTimeout(subscriptions[subscriptionId].expiration);
                    clearInterval(subscriptions[subscriptionId].interval);
                    delete subscriptions[subscriptionId];
                }

                if (metersValuesSubscriptions
                    && metersValuesSubscriptions[meterAddress]
                    && metersValuesSubscriptions[meterAddress][subscriptionId]) {
                    delete metersValuesSubscriptions[meterAddress][subscriptionId];
                }
                if (metersValuesSubscriptions
                    && metersValuesSubscriptions[meterAddress]
                    && typeof metersValuesSubscriptions[meterAddress] === 'object'
                    && !Object.keys(metersValuesSubscriptions[meterAddress]).length) {
                    clearInterval(metersValues[meterAddress].interval);
                    delete metersValues[meterAddress];
                }

                return;
            }

            if (oscAddress === '/-snap/delete') {
                const sceneId = args[0].value || 0;
                provider.udpMessageSend(socketId, ip, port, oscToBuffer({
                    address: `/-snap/${sceneId.toString().padStart(2, '0')}/name`,
                    args: '',
                }));
                return;
            }

            if (oscAddress.startsWith('/config/mute/') && args?.length) {
                const mgNumber = oscAddress.split('/').pop();
                doWrite(oscAddress, args, ip, port);
                args[0].value = args[0].value === 1 ? 0 : 1;
                busesInGroupAddresses('/grp/mute', mgNumber).forEach((a) => {
                    doWrite(
                        a.replace('/grp/mute', '/mix/on'), args, ip, port, true
                    );
                });
                return;
            }

            if (oscAddress.startsWith('/dca/') && oscAddress.endsWith('/on') && args?.length) {
                const dcaNumber = oscAddress.replace('/dca/', '').replace('/on', '');
                doWrite(oscAddress, args, ip, port);
                busesInGroupAddresses('/grp/dca', dcaNumber).forEach((a) => {
                    doWrite(
                        a.replace('/grp/dca', '/mix/on'), args, ip, port, true
                    );
                });
                return;
            }

            if (oscAddress.startsWith('/dca/') && oscAddress.endsWith('/fader') && args?.length) {
                const dcaNumber = oscAddress.replace('/dca/', '').replace('/fader', '');
                doWrite(oscAddress, args, ip, port);
                busesInGroupAddresses('/grp/dca', dcaNumber).forEach((a) => {
                    doWrite(
                        a.replace('/grp/dca', '/mix/fader'), args, ip, port, true
                    );
                });
                return;
            }

            if (!oscAddress || addressesValues[oscAddress] === undefined) {
                if (!knownAddresses.includes(oscAddress)) {
                    console.log('OSC message with no value:', oscAddress, args);
                }
                provider.udpMessageSend(socketId, ip, port, oscToBuffer({
                    address: oscAddress,
                    args: 0,
                }));
                return;
            }

            if (!args || !args.length) {
                provider.udpMessageSend(socketId, ip, port, oscToBuffer({
                    address: oscAddress,
                    args: addressesValues[oscAddress],
                }));
                return;
            }

            doWrite(oscAddress, args, ip, port);
        } catch (err) {
            console.error('Error processing OSC message:', err);
        }
    };

    const run = async ({ ip, port, platform }) => {
        provider = platform;
        const listeningIp = ip || listeningIpDefault;
        const listeningPort = port || listeningPortDefault;
        if (!listeningIp) {
            console.error('No listening address found');
            return;
        }

        addressesValues['/xinfo'] = [listeningIp, deviceName, deviceModel, deviceFirmware];

        socketId = await provider.udpSocketOpen(listeningIp, listeningPort);
        console.log(`Virtual ${deviceModel} listening on`, listeningIp, listeningPort);
        unlistenMessageReceived = provider.onUDPMessageReceived((buffer, ipReceived, portReceived) => {
            processOSCMessage(buffer, ipReceived, portReceived);
        }, socketId);
    };

    const stop = async () => {
        console.log(`Virtual ${deviceModel} stopped`);
        if (unlistenMessageReceived) unlistenMessageReceived();
        Object.values(metersValues).forEach((m) => {
            clearInterval(m.interval);
        });
        metersValues = {};
        Object.values(changeListeners).forEach((c1) => {
            Object.values(c1).forEach((c2) => {
                clearTimeout(c2.expiration);
            });
        });
        changeListeners = {};
        Object.values(subscriptions).forEach((s) => {
            if (s.expiration) clearTimeout(s.expiration);
            if (s.interval) clearInterval(s.interval);
        });
        subscriptions = {};
        if (provider && socketId) await provider.udpSocketClose(socketId);
        provider = null;
        listeningAddress = null;
        socketId = null;
    };

    return { run, stop };
};
