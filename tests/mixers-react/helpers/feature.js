import { describe, it, expect } from 'vitest';
import { toArray } from '@magical-mixing/mixers-react/helpers/feature.js';

describe('toArray', () => {
    it('returns an empty array for undefined', () => {
        expect(toArray(undefined)).toEqual([]);
    });

    it('wraps a scalar in an array', () => {
        expect(toArray(5)).toEqual([5]);
    });

    it('returns arrays unchanged', () => {
        expect(toArray([1, 2])).toEqual([1, 2]);
    });
});
