import { describe, it, expect } from 'vitest';
import { scaleLinear, scaleLog } from '@magical-mixing/mixers/helpers/scale.js';

describe('scaleLinear', () => {
    it('maps domain to range', () => {
        const scale = scaleLinear().domain([0, 1]).range([0, 100]);
        expect(scale(0)).toBe(0);
        expect(scale(0.5)).toBe(50);
        expect(scale(1)).toBe(100);
    });

    it('inverts range back to domain', () => {
        const scale = scaleLinear().domain([0, 10]).range([-80, 0]);
        expect(scale.invert(-40)).toBe(5);
    });

    it('clamps out-of-range values when enabled', () => {
        const scale = scaleLinear().domain([0, 1]).range([0, 100]).clamp(true);
        expect(scale(2)).toBe(100);
        expect(scale(-1)).toBe(0);
    });
});

describe('scaleLog', () => {
    it('maps logarithmic domain to range', () => {
        const scale = scaleLog().domain([1, 10]).range([0, 1]);
        expect(scale(1)).toBe(0);
        expect(scale(10)).toBe(1);
    });

    it('inverts range back to logarithmic domain', () => {
        const scale = scaleLog().domain([20, 20000]).range([0, 1]);
        const mid = scale.invert(0.5);
        expect(mid).toBeGreaterThan(20);
        expect(mid).toBeLessThan(20000);
    });
});
