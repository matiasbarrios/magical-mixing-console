import { describe, it, expect, vi } from 'vitest';
import { doAsync } from '@magical-mixing/virtual-devices/helpers/iterator.js';

describe('doAsync', () => {
    it('runs the callback sequentially for each element', async () => {
        const order = [];
        await doAsync([1, 2, 3], async (value) => {
            order.push(value);
        });
        expect(order).toEqual([1, 2, 3]);
    });

    it('does nothing when input is not an array', async () => {
        const fn = vi.fn();
        await doAsync(null, fn);
        expect(fn).not.toHaveBeenCalled();
    });
});
