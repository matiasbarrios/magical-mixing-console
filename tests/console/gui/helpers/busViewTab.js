import { describe, expect, it } from 'vitest';
import {
    rememberBusTab,
    resolveBusViewTab,
} from '@magical-mixing/console/gui/pages/bus/view/useBusViewTab.js';


const channelTabs = [
    { id: 'input' },
    { id: 'to' },
    { id: 'eq' },
    { id: 'outputs' },
];

const mainTabs = [
    { id: 'from' },
    { id: 'to' },
    { id: 'outputs' },
];


describe('resolveBusViewTab', () => {
    it('uses the tab remembered for that bus type', () => {
        const memory = { channel: 'eq', main: 'outputs' };

        expect(resolveBusViewTab({
            tabs: channelTabs,
            memory,
            busType: 'channel',
            defaultTab: 'input',
        })).toBe('eq');

        expect(resolveBusViewTab({
            tabs: mainTabs,
            memory,
            busType: 'main',
            defaultTab: 'from',
        })).toBe('outputs');
    });

    it('remembers reception for the type that used it', () => {
        expect(resolveBusViewTab({
            tabs: mainTabs,
            memory: { main: 'from' },
            busType: 'main',
            defaultTab: 'from',
        })).toBe('from');
    });

    it('ignores a legacy string and falls back to the default', () => {
        expect(resolveBusViewTab({
            tabs: channelTabs,
            memory: 'outputs',
            busType: 'channel',
            defaultTab: 'input',
        })).toBe('input');
    });

    it('keeps a url tab this bus has', () => {
        expect(resolveBusViewTab({
            urlTab: 'to',
            tabs: channelTabs,
            memory: { channel: 'eq' },
            busType: 'channel',
            defaultTab: 'input',
        })).toBe('to');
    });

    it('falls back to the type memory when the url tab is not on this bus', () => {
        expect(resolveBusViewTab({
            urlTab: 'input',
            tabs: mainTabs,
            memory: { main: 'outputs' },
            busType: 'main',
            defaultTab: 'from',
        })).toBe('outputs');
    });

    it('uses the default when that type has no memory', () => {
        expect(resolveBusViewTab({
            tabs: channelTabs,
            memory: { main: 'outputs' },
            busType: 'channel',
            defaultTab: 'input',
        })).toBe('input');

        expect(resolveBusViewTab({
            tabs: channelTabs,
            memory: null,
            busType: 'channel',
            defaultTab: 'input',
        })).toBe('input');
    });

    it('does not pick a default before settings have been read', () => {
        expect(resolveBusViewTab({
            tabs: channelTabs,
            memory: undefined,
            busType: 'channel',
            defaultTab: 'input',
        })).toBeUndefined();
    });
});


describe('rememberBusTab', () => {
    it('stores the tab on its type, including reception', () => {
        expect(rememberBusTab({}, 'main', 'from')).toEqual({ main: 'from' });
    });

    it('replaces a legacy string with a map for the type being saved', () => {
        expect(rememberBusTab('outputs', 'channel', 'input')).toEqual({ channel: 'input' });
    });

    it('keeps other types when one type changes', () => {
        expect(rememberBusTab(
            { channel: 'eq', main: 'from' },
            'channel',
            'input',
        )).toEqual({ channel: 'input', main: 'from' });
    });

    it('does not write when the type already has that tab', () => {
        expect(rememberBusTab({ channel: 'eq' }, 'channel', 'eq')).toBeNull();
        expect(rememberBusTab({ channel: 'eq' }, 'channel', '')).toBeNull();
    });
});
