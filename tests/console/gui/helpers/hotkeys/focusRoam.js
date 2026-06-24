import { describe, it, expect } from 'vitest';
import { getDefaultBindings } from '@magical-mixing/console/gui/helpers/hotkeys/actions.js';
import { hotkeyBinding } from '@magical-mixing/console/gui/helpers/hotkeys/binding.js';
import {
    FOCUS_ROAM_SPECS,
    focusNextPanActionId,
    focusPrevPanActionId,
    focusNextSliderActionId,
    focusPrevSliderActionId,
    focusNextPreviewEqActionId,
    focusPrevPreviewEqActionId,
    focusNextResetActionId,
    focusPrevEditActionId,
    focusNextEditActionId,
} from '@magical-mixing/console/gui/helpers/hotkeys/focusRoam.js';
import { primaryAltModifier, primaryModifier } from '@magical-mixing/console/gui/helpers/hotkeys/platformModifier.js';
import {
    tabsNextActionId,
    tabsPrevActionId,
} from '@magical-mixing/console/gui/helpers/hotkeys/tabCycle.js';

const expectPrimaryBinding = (binding, key, extra = {}, shiftKey = false) => {
    expect(binding).toEqual(hotkeyBinding(key, {
        ...primaryModifier(),
        ...extra,
        shiftKey,
    }));
};

describe('focus roam pan hotkeys', () => {
    it('defaults to primary modifier + P', () => {
        const bindings = getDefaultBindings();
        expectPrimaryBinding(bindings[focusNextPanActionId], 'KeyP');
        expectPrimaryBinding(bindings[focusPrevPanActionId], 'KeyP', {}, true);
    });
});

describe('focus roam slider hotkeys', () => {
    it('defaults to primary modifier + L', () => {
        const bindings = getDefaultBindings();
        expectPrimaryBinding(bindings[focusNextSliderActionId], 'KeyL');
        expectPrimaryBinding(bindings[focusPrevSliderActionId], 'KeyL', {}, true);
    });
});

describe('focus roam control hotkeys', () => {
    it('registers primary modifier for bidirectional roam targets', () => {
        const bindings = getDefaultBindings();

        FOCUS_ROAM_SPECS.filter(({ bidirectional = true }) => bidirectional).forEach((spec) => {
            const { roamId, key, bindingModifiers } = spec;
            const altKey = bindingModifiers?.altKey ?? false;
            expectPrimaryBinding(bindings[`focus.next.${roamId}`], key, { altKey });
            expectPrimaryBinding(bindings[`focus.prev.${roamId}`], key, { altKey }, true);
        });
    });

    it('registers primary+alt for reset, add and edit', () => {
        const bindings = getDefaultBindings();
        const primaryAlt = primaryAltModifier();

        expect(bindings[focusNextResetActionId]).toEqual(hotkeyBinding('KeyR', primaryAlt));
        expect(bindings['focus.prev.reset']).toBeUndefined();
        expect(bindings['focus.next.add']).toEqual(hotkeyBinding('KeyA', primaryAlt));
        expect(bindings['focus.prev.add']).toBeUndefined();
        expect(bindings[focusNextEditActionId]).toEqual(hotkeyBinding('KeyE', primaryAlt));
        expect(bindings[focusPrevEditActionId]).toEqual(hotkeyBinding('KeyE', {
            ...primaryAlt,
            shiftKey: true,
        }));
    });

    it('registers primary modifier + E for equalizer preview', () => {
        const bindings = getDefaultBindings();
        expectPrimaryBinding(bindings[focusNextPreviewEqActionId], 'KeyE');
        expectPrimaryBinding(bindings[focusPrevPreviewEqActionId], 'KeyE', {}, true);
    });
});

describe('tab cycle hotkeys', () => {
    it('defaults to T and Shift+T', () => {
        const bindings = getDefaultBindings();
        expect(bindings[tabsNextActionId]).toEqual(hotkeyBinding('KeyT'));
        expect(bindings[tabsPrevActionId]).toEqual(hotkeyBinding('KeyT', { shiftKey: true }));
    });
});
