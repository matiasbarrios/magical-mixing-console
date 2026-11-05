import { describe, expect, it } from 'vitest';
import { BUS_MOVE_PREAMP } from '@magical-mixing/mixers-react/device/bus/move.jsx';
import { scheduleBusChannelMovePaths } from '@magical-mixing/mixers-react/device/scene/capturePaths.js';
import {
    busMoveChanges,
    receptionMoveChanges,
    receptionPaths,
    remapSidechainSource,
    rewriteBusPath,
    rewriteSendDestination,
    sidechainFollowChanges,
    sidechainSourceId,
} from '@magical-mixing/mixers-react/device/bus/movePaths.js';


describe('channel move module', () => {
    it('loads the operation', () => {
        expect(BUS_MOVE_PREAMP).toBe('preamp');
    });
});


describe('rewriteBusPath', () => {
    it('replaces only the first bus id', () => {
        expect(rewriteBusPath('bus.to(4).level(4)', 4, 2)).toBe('bus.to(2).level(4)');
        expect(rewriteBusPath('bus.to(4).level(14)', 4, 2)).toBe('bus.to(2).level(14)');
        expect(rewriteBusPath('bus.equalizer(1).parametric.on(1)', 1, 5))
            .toBe('bus.equalizer(5).parametric.on(1)');
    });

    it('does not treat a longer id as the bus id', () => {
        expect(rewriteBusPath('bus.compressor(11).threshold', 1, 3)).toBe(null);
        expect(rewriteBusPath('bus.to(11).level(1)', 1, 3)).toBe(null);
    });
});


describe('sidechainSourceId', () => {
    it('maps channel and secondary numbers onto sidechain ids', () => {
        expect(sidechainSourceId({ type: 'channel', number: '5' })).toBe(5);
        expect(sidechainSourceId({ type: 'secondary', number: '1' })).toBe(17);
        expect(sidechainSourceId({ type: 'secondary', number: '6' })).toBe(22);
        expect(sidechainSourceId({ type: 'effect', number: '1' })).toBe(null);
    });
});


describe('remapSidechainSource', () => {
    it('follows the moved channel when the sidechain names it', () => {
        const path = 'bus.gate(2).sidechain.source';
        expect(remapSidechainSource(path, 5, 5, 3)).toBe(3);
    });

    it('follows a secondary named as the sidechain source', () => {
        const path = 'bus.compressor(0).sidechain.source';
        expect(remapSidechainSource(path, 17, 17, 18)).toBe(18);
    });

    it('leaves Self, other channels, and other secondaries alone', () => {
        const path = 'bus.compressor(2).sidechain.source';
        expect(remapSidechainSource(path, 0, 5, 3)).toBe(0);
        expect(remapSidechainSource(path, 6, 5, 3)).toBe(6);
        expect(remapSidechainSource(path, 17, 5, 3)).toBe(17);
    });

    it('ignores other parameters', () => {
        expect(remapSidechainSource('bus.gate(2).threshold', 5, 4, 2)).toBe(5);
    });
});


describe('scheduleBusChannelMovePaths', () => {
    it('copies strip parameters and leaves input assignment and stereo link', () => {
        const bus = {
            options: [
                { id: 4, type: 'channel' },
                { id: 2, type: 'channel' },
            ],
            dca: { options: () => [{ id: 0 }] },
            equalizer: {
                parametric: { options: () => [{ id: 0 }] },
                graphic: { options: () => [] },
                true: { options: () => [] },
            },
            mg: { options: () => [{ id: 0 }] },
        };
        const paths = [];
        const discover = (_feature, _ids, fn) => { fn(); };

        scheduleBusChannelMovePaths(
            { enqueuePath: path => paths.push(path), discover },
            bus,
            4,
        );

        expect(paths).toContain('bus.name(4)');
        expect(paths).toContain('bus.compressor(4).sidechain.source');
        expect(paths).toContain('bus.to(4).level(2)');
        expect(paths.some(path => path.includes('input'))).toBe(false);
        expect(paths.some(path => path.includes('stereoLink'))).toBe(false);
        expect(paths.some(path => path.startsWith('output.'))).toBe(false);
    });
});


describe('rewriteSendDestination', () => {
    it('moves who sends to an aux onto the destination aux', () => {
        expect(rewriteSendDestination('bus.to(0).level(21)', 21, 22)).toBe('bus.to(0).level(22)');
        expect(rewriteSendDestination('bus.to(0).pan(21)', 21, 22)).toBe('bus.to(0).pan(22)');
    });

    it('leaves the sender id and other destinations alone', () => {
        expect(rewriteSendDestination('bus.to(21).level(27)', 21, 22)).toBe(null);
        expect(rewriteSendDestination('bus.to(11).level(1)', 21, 22)).toBe(null);
        expect(rewriteSendDestination('bus.name(21)', 21, 22)).toBe(null);
    });
});


describe('receptionPaths', () => {
    it('asks every other bus for its send to this aux', () => {
        const options = [{ id: 0 }, { id: 21 }, { id: 22 }];
        expect(receptionPaths(options, 21, new Set([21, 22]))).toEqual([
            'bus.to(0).on(21)',
            'bus.to(0).level(21)',
            'bus.to(0).pan(21)',
            'bus.to(0).tap(21)',
        ]);
    });
});


describe('reception and sidechain follow', () => {
    it('rewrites incoming sends and sidechain sources that name the aux', () => {
        const captured = [
            ['bus.to(0).level(21)', 0.4],
            ['bus.to(16).on(21)', true],
            ['bus.compressor(0).sidechain.source', 17],
            ['bus.gate(1).sidechain.source', 3],
            ['bus.compressor(4).threshold', 0],
        ];

        expect(receptionMoveChanges(captured, 21, 22)).toEqual([
            ['bus.to(0).level(22)', 0.4],
            ['bus.to(16).on(22)', true],
        ]);
        expect(sidechainFollowChanges(captured, 17, 18)).toEqual([
            ['bus.compressor(0).sidechain.source', 18],
        ]);
    });
});


describe('busMoveChanges', () => {
    it('rewrites captured paths and sidechain sources together', () => {
        const captured = [
            ['bus.name(4)', 'Guitar'],
            ['bus.to(4).level(27)', 0.5],
            ['bus.compressor(4).sidechain.source', 5],
            ['bus.level(11)', 0],
        ];

        expect(busMoveChanges(captured, 4, 2)).toEqual([
            ['bus.name(2)', 'Guitar'],
            ['bus.to(2).level(27)', 0.5],
            ['bus.compressor(2).sidechain.source', 3],
        ]);
    });

    it('uses an explicit sidechain id for a secondary strip', () => {
        const captured = [
            ['bus.compressor(21).sidechain.source', 17],
        ];
        expect(busMoveChanges(captured, 21, 22, { from: 17, to: 18 })).toEqual([
            ['bus.compressor(22).sidechain.source', 18],
        ]);
    });
});
