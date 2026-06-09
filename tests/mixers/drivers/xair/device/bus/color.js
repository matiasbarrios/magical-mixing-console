import { describe, it, expect } from 'vitest';
import { color } from '@magical-mixing/mixers/drivers/xair/device/bus/color.js';

const noopDriver = { read: () => {}, get: () => {}, set: () => {} };

describe('bus color driver feature', () => {
    it('exposes 16 color options', () => {
        const feature = color(noopDriver);
        expect(feature.options(0)).toHaveLength(16);
    });

    it('defaults to none', () => {
        const feature = color(noopDriver);
        expect(feature.defaultOption(0)).toEqual({ id: 0, name: 'none' });
    });
});
