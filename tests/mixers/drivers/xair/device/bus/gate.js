import { describe, it, expect } from 'vitest';
import { gate } from '@magical-mixing/mixers/drivers/xair/device/bus/gate.js';

const noopDriver = {
    read: () => {},
    get: () => {},
    set: () => {},
    subscribe: () => {},
};

const readHas = (feature, busId) => {
    let result;
    feature.has(busId, (value) => { result = value; });
    return result;
};

describe('bus gate driver feature', () => {
    const feature = gate(noopDriver);

    it('is available only on channel buses', () => {
        expect(readHas(feature, 0)).toBe(true);
        expect(readHas(feature, 27)).toBe(false);
    });

    it('exposes gate mode options', () => {
        expect(feature.mode.options(0)).toHaveLength(5);
        expect(feature.mode.defaultOption(0)).toEqual({ id: 0, name: 'Exp 2:1' });
    });

    it('exposes threshold range metadata', () => {
        expect(feature.threshold.minimum).toBe(-80);
        expect(feature.threshold.maximum).toBe(0);
    });
});
