import { describe, it, expect } from 'vitest';
import {
    featureGet,
    connectToVirtualX18,
    setAndReadBack,
} from '../../../helpers/integration.js';
import { useVirtualX18 } from './setup.js';

describe('bus channel parameters', () => {
    useVirtualX18();

    it('round-trips over UDP', async () => {
        const device = await connectToVirtualX18();
        const busId = 0;
        const { bus } = device.features;

        const parameters = [
            {
                label: 'name',
                feature: bus.name,
                ids: [busId],
                initial: 'Vocal 1',
                value: 'MMC Test Ch1',
            },
            {
                label: 'color',
                feature: bus.color,
                ids: [busId],
                initial: 4,
                value: 2,
            },
            {
                label: 'mute',
                feature: bus.mute,
                ids: [busId],
                initial: false,
                value: true,
            },
            {
                label: 'polarity',
                feature: bus.polarity,
                ids: [busId],
                initial: false,
                value: true,
            },
            {
                label: 'pan',
                feature: bus.pan,
                ids: [busId],
                initial: 0,
                value: -50,
            },
            {
                label: 'level',
                feature: bus.level,
                ids: [busId],
                approx: true,
                value: -12,
            },
            {
                label: 'gate.on',
                feature: bus.gate.on,
                ids: [busId],
                initial: true,
                value: false,
            },
            {
                label: 'equalizer.on',
                feature: bus.equalizer.on,
                ids: [busId],
                initial: true,
                value: false,
            },
            {
                label: 'compressor.on',
                feature: bus.compressor.on,
                ids: [busId],
                initial: true,
                value: false,
            },
            {
                label: 'lowCut.on',
                feature: bus.lowCut.on,
                ids: [busId],
                initial: true,
                value: false,
            },
            {
                label: 'lowCut.frequency',
                feature: bus.lowCut.frequency,
                ids: [busId],
                approx: true,
                value: 100,
            },
        ];

        try {
            for (const param of parameters) {
                const {
                    label,
                    feature,
                    ids,
                    initial,
                    value,
                    approx = false,
                } = param;

                if (initial !== undefined) {
                    expect(
                        await featureGet(feature, ...ids),
                        `${label} initial`,
                    ).toBe(initial);
                }

                await setAndReadBack(device, feature, ids, value, { approx });
            }
        } finally {
            await device.dispose();
        }
    }, 120000);
});
