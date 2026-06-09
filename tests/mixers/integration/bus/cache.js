import { describe, it } from 'vitest';
import {
    featureGet,
    connectToVirtualX18,
    setAndReadBack,
    setAndReadBackImmediate,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

describe('bus OSC cache', () => {
    useVirtualX18();

    it('serves optimistic values immediately after set', async () => {
        const device = await connectToVirtualX18();
        const busId = 4;
        const { bus } = device.features;
        const originalName = await featureGet(bus.name, busId);
        const optimisticName = 'MMC Cache Probe';

        try {
            await setAndReadBackImmediate(bus.name, [busId], optimisticName);
            await setAndReadBack(device, bus.name, [busId], originalName);
        } finally {
            await device.dispose();
        }
    }, 60000);
});
