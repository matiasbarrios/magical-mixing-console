import { describe, it, expect } from 'vitest';
import {
    featureGet,
    connectToVirtualX18,
    setAndReadBack,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

describe('bus stereo link', () => {
    useVirtualX18();

    it('round-trips toggle on a linked channel pair', async () => {
        const device = await connectToVirtualX18();
        const busId = 6;
        const { bus } = device.features;

        try {
            expect(await featureGet(bus.stereoLink, busId)).toBe(true);

            await setAndReadBack(device, bus.stereoLink, [busId], false);
            await setAndReadBack(device, bus.stereoLink, [busId], true);
        } finally {
            await device.dispose();
        }
    }, 60000);
});
