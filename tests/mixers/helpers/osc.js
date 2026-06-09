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

    it('round-trips a string and integer message', () => {
        const message = {
            address: '/xinfo',
            args: [
                { type: 'string', value: '127.0.0.1' },
                { type: 'string', value: 'X18-DEMO' },
                { type: 'string', value: 'X18' },
                { type: 'string', value: '1.18' },
            ],
        };
        const roundTrip = fromBuffer(toBuffer(message));
        expect(roundTrip.address).toBe('/xinfo');
        expect(roundTrip.args.map(a => a.value)).toEqual([
            '127.0.0.1',
            'X18-DEMO',
            'X18',
            '1.18',
        ]);
    });
});
