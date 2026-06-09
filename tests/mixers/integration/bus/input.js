import { describe, it, expect } from 'vitest';
import {
    featureGet,
    connectToVirtualX18,
    setAndReadBack,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

describe('bus input id', () => {
    useVirtualX18();

    it('round-trips USB assignment via setBatch', async () => {
        const device = await connectToVirtualX18();
        const busId = 1;
        const { bus } = device.features;
        const preampInputId = 1;
        const usbInputId = 18;

        try {
            expect(await featureGet(bus.input.id, busId)).toBe(preampInputId);

            await setAndReadBack(device, bus.input.id, [busId], usbInputId);
            await setAndReadBack(device, bus.input.id, [busId], preampInputId);
        } finally {
            await device.dispose();
        }
    }, 60000);
});
