import { describe, it, expect, vi } from 'vitest';
import { fromBuffer } from '@magical-mixing/mixers/helpers/osc.js';
import { oscMessageSend, oscMessageReceived } from '@magical-mixing/mixers/controllers/udpOSC/osc.js';

describe('oscMessageSend', () => {
    it('encodes typed arguments into an OSC buffer', () => {
        const callback = vi.fn();
        oscMessageSend(callback, '/ch/01/mix/fader', 0.75, 3, 'bus');

        expect(callback).toHaveBeenCalledOnce();
        const parsed = fromBuffer(callback.mock.calls[0][0]);
        expect(parsed.address).toBe('/ch/01/mix/fader');
        expect(parsed.args.map(a => a.type)).toEqual(['float', 'integer', 'string']);
        expect(parsed.args.map(a => a.value)).toEqual([0.75, 3, 'bus']);
    });

    it('sanitizes string arguments before encoding', () => {
        const callback = vi.fn();
        oscMessageSend(callback, '/ch/01/config/name', '<b>desk</b>');

        const parsed = fromBuffer(callback.mock.calls[0][0]);
        expect(parsed.args[0].value).toBe('desk');
    });
});

describe('oscMessageReceived', () => {
    it('passes decoded values to the listener', () => {
        const send = vi.fn();
        oscMessageSend(send, '/status', 'active', '127.0.0.1', 'X18-DEMO');

        let received = null;
        oscMessageReceived(send.mock.calls[0][0], ({ address, values }) => {
            received = { address, values };
        });

        expect(received).toEqual({
            address: '/status',
            values: ['active', '127.0.0.1', 'X18-DEMO'],
        });
    });

    it('strips HTML from received string values', () => {
        const send = vi.fn();
        oscMessageSend(send, '/ch/01/config/name', '<i>vocal</i>');

        let values = null;
        oscMessageReceived(send.mock.calls[0][0], ({ values: decoded }) => {
            values = decoded;
        });

        expect(values[0]).toBe('vocal');
    });
});
