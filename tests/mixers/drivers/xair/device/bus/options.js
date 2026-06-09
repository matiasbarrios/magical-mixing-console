import { describe, it, expect } from 'vitest';
import {
    busGet,
    busIsOfType,
    busOsc,
    busIdToMetersZeroId,
} from '@magical-mixing/mixers/drivers/xair/device/bus/options.js';

describe('bus options', () => {
    it('builds OSC paths per bus type', () => {
        expect(busOsc(0)).toBe('/ch/01');
        expect(busOsc(16)).toBe('/rtn/aux');
        expect(busOsc(17)).toBe('/rtn/1');
        expect(busOsc(21)).toBe('/bus/1');
        expect(busOsc(27)).toBe('/lr');
        expect(busOsc(28)).toBe('/config/solo');
    });

    it('checks bus type membership', () => {
        expect(busIsOfType(0, 'channel')).toBe(true);
        expect(busIsOfType(0, 'main')).toBe(false);
        expect(busIsOfType(27, 'main')).toBe(true);
    });

    it('maps bus ids to meter zero ids', () => {
        expect(busIdToMetersZeroId['0']).toBe(0);
        expect(busIdToMetersZeroId['27']).toBe(31);
        expect(busIdToMetersZeroId['17']).toBe(27);
    });

    it('throws for unknown bus ids', () => {
        expect(() => busGet(999)).toThrow('Unknown bus: 999');
    });
});
