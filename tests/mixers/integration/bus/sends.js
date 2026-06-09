import { describe, it } from 'vitest';
import {
    connectToVirtualX18,
    setAndReadBack,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

const MAIN_BUS_ID = 27;
const EFFECT_1_BUS_ID = 17;

describe('bus send levels', () => {
    useVirtualX18();

    it('round-trips channel to main and FX', async () => {
        const device = await connectToVirtualX18();
        const busId = 1;
        const { bus } = device.features;

        try {
            await setAndReadBack(
                device,
                bus.to.level,
                [busId, MAIN_BUS_ID],
                -6,
                { approx: true },
            );
            await setAndReadBack(
                device,
                bus.to.level,
                [busId, EFFECT_1_BUS_ID],
                -12,
                { approx: true },
            );
        } finally {
            await device.dispose();
        }
    }, 90000);
});
