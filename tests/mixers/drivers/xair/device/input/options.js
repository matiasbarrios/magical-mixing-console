import { describe, it, expect } from 'vitest';
import {
    optionsForModel,
    inputOsc,
    inputIsPreamp,
    inputIdDefaultForBus,
    inputIdToXAirId,
} from '@magical-mixing/mixers/drivers/xair/device/input/options.js';

describe('input options', () => {
    it('filters options by desk model', () => {
        const x18 = optionsForModel('X18');
        const xr12 = optionsForModel('XR12');
        expect(x18.length).toBeGreaterThan(xr12.length);
        expect(x18.every(o => o.models.includes('X18'))).toBe(true);
    });

    it('builds headamp OSC paths for preamp inputs', () => {
        expect(inputOsc(0)).toBe('/headamp/01/');
        expect(inputOsc(15)).toBe('/headamp/16/');
    });

    it('detects preamp inputs', () => {
        expect(inputIsPreamp(0)).toBe(true);
        expect(inputIsPreamp(16)).toBe(false);
    });

    it('returns default input ids per bus for X18', () => {
        expect(inputIdDefaultForBus('X18', '0')).toBe(0);
        expect(inputIdDefaultForBus('X18', '15')).toBe(15);
        expect(inputIdDefaultForBus('X18', '17')).toBeGreaterThan(0);
    });

    it('maps input ids to X Air ids for a channel bus', () => {
        const toXAirId = inputIdToXAirId('X18', 0);
        expect(toXAirId(0)).toBeDefined();
        expect(toXAirId(999)).toBeUndefined();
    });
});
