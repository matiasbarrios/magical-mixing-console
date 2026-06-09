import { describe, it, expect } from 'vitest';
import { panAndLevelApply } from '@magical-mixing/mixers/helpers/panLevel.js';

const apply = panAndLevelApply(0, 100);

describe('panAndLevelApply', () => {
    it('returns the value unchanged when pan is centered', () => {
        expect(apply(0, -6, -12)).toBe(-18);
        expect(apply(0, 0, -12)).toBe(-12);
    });

    it('caps summed level at 0 dB', () => {
        expect(apply(0, 6, -3)).toBe(0);
    });

    it('applies pan to a mono value', () => {
        const [left, right] = apply(100, 0, -12);
        expect(left).toBeLessThan(-12);
        expect(right).toBeGreaterThan(-12);
    });

    it('applies pan to a stereo pair', () => {
        const [left, right] = apply(100, 0, [-12, -12]);
        expect(left).not.toBe(right);
    });
});
