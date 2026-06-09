import { describe, it, expect } from 'vitest';
import {
    options,
    sceneGet,
    sceneOsc,
} from '@magical-mixing/mixers/drivers/xair/device/scene/options.js';

describe('scene options', () => {
    it('exposes 64 scenes', () => {
        expect(options).toHaveLength(64);
        expect(options[0]).toEqual({ id: 0, number: '1' });
        expect(options[63]).toEqual({ id: 63, number: '64' });
    });

    it('builds zero-padded OSC paths', () => {
        expect(sceneOsc(0)).toBe('/-snap/01');
        expect(sceneOsc(9)).toBe('/-snap/10');
    });

    it('throws for unknown scene ids', () => {
        expect(() => sceneGet(99)).toThrow('Unknown scene: 99');
    });
});
