import { describe, it, expect } from 'vitest';
import { getDefaultBindings } from '@magical-mixing/console/gui/helpers/hotkeys/actions.js';
import { BUS_VIEW_TAB_HOTKEYS } from '@magical-mixing/console/gui/helpers/hotkeys/busViewTabs.js';
import { formatBinding } from '@magical-mixing/console/gui/helpers/hotkeys/format.js';
import {
    bindingsEqual, eventMatchesBinding, findActionForEvent,
} from '@magical-mixing/console/gui/helpers/hotkeys/match.js';
import { normalizeKeyboardEvent } from '@magical-mixing/console/gui/helpers/hotkeys/normalize.js';
import { isBusViewTabAction, findBusViewTabActionForEvent } from '@magical-mixing/console/gui/helpers/hotkeys/busViewTabs.js';

describe('hotkeys normalize', () => {
    it('ignores modifier-only key events', () => {
        expect(normalizeKeyboardEvent({ code: 'ShiftLeft', shiftKey: true })).toBeNull();
    });

    it('captures key and modifiers', () => {
        expect(normalizeKeyboardEvent({
            code: 'KeyH',
            ctrlKey: true,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        })).toEqual({
            key: 'KeyH',
            ctrlKey: true,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        });
    });
});

describe('hotkeys match', () => {
    it('matches events against bindings', () => {
        const binding = { key: 'KeyH', ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };
        expect(eventMatchesBinding({
            code: 'KeyH',
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        }, binding)).toBe(true);
        expect(eventMatchesBinding({
            code: 'KeyH',
            ctrlKey: true,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        }, binding)).toBe(false);
    });

    it('finds the action for a matching event', () => {
        const bindings = getDefaultBindings();
        const actionId = findActionForEvent({
            code: 'KeyH',
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        }, bindings);
        expect(actionId).toBe('navigate.home');
    });

    it('filters actions when matching', () => {
        const bindings = getDefaultBindings();
        const actionId = findActionForEvent({
            code: 'KeyI',
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        }, bindings, isBusViewTabAction);
        expect(actionId).toBe('busView.tab.input');
    });

    it('compares bindings', () => {
        const a = { key: 'KeyH', ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };
        const b = { key: 'KeyH', ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };
        expect(bindingsEqual(a, b)).toBe(true);
        expect(bindingsEqual(a, { ...b, shiftKey: true })).toBe(false);
    });
});

describe('hotkeys format', () => {
    it('formats simple letter bindings', () => {
        expect(formatBinding({
            key: 'KeyH',
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        })).toBe('H');
    });
});

describe('bus view tab hotkeys', () => {
    it('lets FX and Fx insert share the same default key', () => {
        const fx = BUS_VIEW_TAB_HOTKEYS.find(({ tabId }) => tabId === 'fx');
        const insert = BUS_VIEW_TAB_HOTKEYS.find(({ tabId }) => tabId === 'insert');
        expect(fx.key).toBe('KeyF');
        expect(insert.key).toBe(fx.key);
    });

    it('resolves shared keys to the visible tab', () => {
        const bindings = getDefaultBindings();
        const event = {
            code: 'KeyF',
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
        };

        expect(findBusViewTabActionForEvent(event, bindings, ['fx'])).toBe('busView.tab.fx');
        expect(findBusViewTabActionForEvent(event, bindings, ['insert'])).toBe('busView.tab.insert');
    });
});
