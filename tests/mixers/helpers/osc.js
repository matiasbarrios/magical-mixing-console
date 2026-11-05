import { describe, it, expect } from 'vitest';
import { toBuffer, fromBuffer } from '@magical-mixing/mixers/helpers/osc.js';

describe('OSC toBuffer / fromBuffer', () => {
    it('round-trips a float message', () => {
        const message = {
            address: '/test/float',
            args: [{ type: 'float', value: 1.5 }],
        };
        const roundTrip = fromBuffer(toBuffer(message));
        expect(roundTrip.address).toBe('/test/float');
        expect(roundTrip.args[0].value).toBe(1.5);
    });
});
