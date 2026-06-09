import { expect } from 'vitest';
import { searchNew } from '@magical-mixing/mixers';

export const TEST_IP = '127.0.0.1';
export const TEST_PORT = 50124;

const FEATURE_GET_TIMEOUT_MS = 5000;
const CONNECT_SETTLE_MS = 500;

/** Space SET and the follow-up GET on the same OSC address (virtual desk flood guard). */
export const OSC_SETTLE_MS = 1100;

export const wait = ms => new Promise((resolve) => { setTimeout(resolve, ms); });

export const featureGet = (feature, ...ids) => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
        reject(new Error(`featureGet timed out after ${FEATURE_GET_TIMEOUT_MS}ms`));
    }, FEATURE_GET_TIMEOUT_MS);

    let unlisten;
    unlisten = feature.get(...ids, (value) => {
        clearTimeout(timeout);
        if (unlisten) unlisten();
        resolve(value);
    });
});

export const connectToVirtualX18 = async (ip = TEST_IP, port = TEST_PORT) => {
    const search = searchNew();
    let device = null;

    await search.inIPPort(
        ip,
        port,
        async (data) => {
            device = await search.getFound(data.ip, data.port);
            await device.connect();
        },
        async () => {
            throw new Error('Virtual X18 not found within search timeout');
        },
    );

    if (!device) {
        throw new Error('Virtual X18 connect failed — device handle missing');
    }

    await wait(CONNECT_SETTLE_MS);
    return device;
};

export const setAndReadBackImmediate = async (feature, ids, value, {
    approx = false,
    tolerance = 4,
} = {}) => {
    feature.set(...ids, value);
    const updated = await featureGet(feature, ...ids);
    if (approx) {
        expect(updated).toBeCloseTo(value, tolerance);
    } else {
        expect(updated).toBe(value);
    }
    return updated;
};

export const setAndReadBack = async (device, feature, ids, value, {
    approx = false,
    tolerance = 4,
} = {}) => {
    feature.set(...ids, value);
    await wait(OSC_SETTLE_MS);
    device.features.cacheClear();
    const updated = await featureGet(feature, ...ids);
    if (approx) {
        expect(updated).toBeCloseTo(value, tolerance);
    } else {
        expect(updated).toBe(value);
    }
    return updated;
};
