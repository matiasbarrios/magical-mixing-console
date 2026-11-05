import { describe, it, expect } from 'vitest';
import {
    modelIsSupported,
    modelResolve,
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
        expect(modelIsSupported('XR16W')).toBe(true);
        expect(modelIsSupported('UNKNOWN')).toBe(false);
    });

    it('keeps a known model name and maps unknown names by channel count', () => {
        expect(modelResolve('XR18')).toBe('XR18');
        expect(modelResolve('MR12')).toBe('MR12');
        expect(modelResolve('XR18V2')).toBe('XR18V2');

        expect(modelResolve('XR16W')).toBe('XR16V2');
        expect(modelResolve('XR12W')).toBe('XR12V2');
        expect(modelResolve('MR12W')).toBe('XR12V2');
        expect(modelResolve('XR18W')).toBe('X18V2');
        expect(modelResolve('X18V3')).toBe('X18');
        expect(modelResolve('A18WR')).toBe('X18');
        expect(modelResolve('A16ZZ')).toBe('XR16');
        expect(modelResolve('A12QQ')).toBe('XR12');

        expect(modelResolve('UNKNOWN')).toBe(null);
        expect(modelResolve(null)).toBe(null);
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
