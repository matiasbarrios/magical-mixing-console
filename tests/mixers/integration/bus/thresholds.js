import { describe, it, expect } from 'vitest';
import {
    featureGet,
    connectToVirtualX18,
    setAndReadBack,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

describe('bus gate and compressor thresholds', () => {
    useVirtualX18();

    it('round-trips log-scaled values', async () => {
        const device = await connectToVirtualX18();
        const busId = 2;
        const { bus } = device.features;

        try {
            expect(await featureGet(bus.gate.threshold, busId)).toBe(-80);
            expect(await featureGet(bus.compressor.threshold, busId)).toBeCloseTo(0, 1);

            await setAndReadBack(device, bus.gate.threshold, [busId], -50, { approx: true });
            await setAndReadBack(device, bus.compressor.threshold, [busId], -20, { approx: true });

            await setAndReadBack(device, bus.gate.threshold, [busId], -80, { approx: true });
            await setAndReadBack(device, bus.compressor.threshold, [busId], 0, { approx: true });
        } finally {
            await device.dispose();
        }
    }, 90000);
});
