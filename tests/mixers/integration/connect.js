import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mixersInitialize } from '@magical-mixing/mixers';
import { x18Run, x18Stop } from '@magical-mixing/virtual-devices/x18/run/index.js';
import { createNodePlatform } from '../../helpers/nodePlatform.js';
import {
    TEST_IP,
    TEST_PORT,
    connectToVirtualX18,
} from '../../helpers/integration.js';

const KEEPALIVE_WAIT_MS = 3000;

const wait = ms => new Promise((resolve) => { setTimeout(resolve, ms); });

describe('mixers session against virtual X18', () => {
    let platform;

    beforeAll(async () => {
        platform = createNodePlatform();
        mixersInitialize(platform);
        await x18Run({ ip: TEST_IP, port: TEST_PORT, platform });
    });

    afterAll(async () => {
        await x18Stop();
    });

    it('discovers, connects, and stays online via /status keepalive', async () => {
        const device = await connectToVirtualX18();

        try {
            expect(device.model).toBe('X18');
            expect(device.name).toBe('X18-DEMO');
            expect(device.ip).toBe(TEST_IP);
            expect(device.port).toBe(TEST_PORT);

            await wait(KEEPALIVE_WAIT_MS);
            expect(device.online.read()).toBe(true);
        } finally {
            await device.dispose();
        }
    });
});
