import { describe, it, expect } from 'vitest';
import {
    modelIsSupported,
    modelBrand,
    modelIs18,
    modelIs16,
    modelIs12,
} from '@magical-mixing/mixers/drivers/xair/model.js';

describe('xAir model helpers', () => {
    it('recognizes supported desk models', () => {
        expect(modelIsSupported('X18')).toBe(true);
        expect(modelIsSupported('XR12')).toBe(true);
        expect(modelIsSupported('XR16V2')).toBe(true);
        expect(modelIsSupported('UNKNOWN')).toBe(false);
    });

    it('maps brand from model prefix', () => {
        expect(modelBrand('X18')).toBe('Behringer');
        expect(modelBrand('XR18')).toBe('Behringer');
        expect(modelBrand('MR12')).toBe('Midas');
    });

    it('classifies models by channel count family', () => {
        expect(modelIs18('X18V2')).toBe(true);
        expect(modelIs18('XR12')).toBe(false);

        expect(modelIs16('XR16')).toBe(true);
        expect(modelIs16('X18')).toBe(false);

        expect(modelIs12('MR12V2')).toBe(true);
        expect(modelIs12('XR16')).toBe(false);
    });
});
