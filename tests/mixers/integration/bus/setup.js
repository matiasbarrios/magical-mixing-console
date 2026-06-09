import { beforeAll, afterAll } from 'vitest';
import { mixersInitialize } from '@magical-mixing/mixers';
import { x18Run, x18Stop } from '@magical-mixing/virtual-devices/x18/run/index.js';
import { createNodePlatform } from '../../../helpers/nodePlatform.js';
import { TEST_IP, TEST_PORT } from '../../../helpers/integration.js';

export const useVirtualX18 = () => {
    let platform;

    beforeAll(async () => {
        platform = createNodePlatform();
        mixersInitialize(platform);
        await x18Run({ ip: TEST_IP, port: TEST_PORT, platform });
    });

    afterAll(async () => {
        await x18Stop();
    });
};
