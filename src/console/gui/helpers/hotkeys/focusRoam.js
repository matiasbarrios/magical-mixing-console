// Requirements
import { hotkeyBinding } from './binding';
import { primaryModifier } from './platformModifier';


// Constants
const FOCUS_ROAM_GROUP = 'Focus';

const FOCUS_ROAM_SPECS = [
    {
        roamId: 'pan',
        key: 'KeyP',
        labelNext: 'Focus next pan',
        labelPrev: 'Focus previous pan',
    },
    {
        roamId: 'slider',
        key: 'KeyL',
        labelNext: 'Focus next slider',
        labelPrev: 'Focus previous slider',
    },
    {
        roamId: 'previewEq',
        key: 'KeyE',
        labelNext: 'Focus next equalizer preview',
        labelPrev: 'Focus previous equalizer preview',
    },
    {
        roamId: 'previewCompressor',
        key: 'KeyC',
        labelNext: 'Focus next compressor preview',
        labelPrev: 'Focus previous compressor preview',
    },
    {
        roamId: 'previewGate',
        key: 'KeyG',
        labelNext: 'Focus next gate preview',
        labelPrev: 'Focus previous gate preview',
    },
    {
        roamId: 'inputPreview',
        key: 'KeyI',
        labelNext: 'Focus next input button',
        labelPrev: 'Focus previous input button',
    },
    {
        roamId: 'solo',
        key: 'KeyS',
        labelNext: 'Focus next solo button',
        labelPrev: 'Focus previous solo button',
    },
    {
        roamId: 'mute',
        key: 'KeyM',
        labelNext: 'Focus next mute button',
        labelPrev: 'Focus previous mute button',
    },
    {
        roamId: 'busIdentifier',
        key: 'KeyB',
        labelNext: 'Focus next bus identifier',
        labelPrev: 'Focus previous bus identifier',
    },
    {
        roamId: 'reset',
        key: 'KeyR',
        bindingModifiers: { altKey: true },
        labelNext: 'Focus reset button',
        bidirectional: false,
    },
    {
        roamId: 'add',
        key: 'KeyA',
        bindingModifiers: { altKey: true },
        labelNext: 'Focus add button',
        bidirectional: false,
    },
    {
        roamId: 'remove',
        key: 'KeyD',
        labelNext: 'Focus next remove button',
        labelPrev: 'Focus previous remove button',
    },
    {
        roamId: 'edit',
        key: 'KeyE',
        bindingModifiers: { altKey: true },
        labelNext: 'Focus next edit button',
        labelPrev: 'Focus previous edit button',
    },
];

const focusActionId = (direction, roamId) => `focus.${direction}.${roamId}`;

const buildFocusBinding = (key, extraModifiers = {}, shiftKey = false) => hotkeyBinding(key, {
    ...primaryModifier(),
    ...extraModifiers,
    shiftKey,
});


// Internal
const focusRoamActions = Object.fromEntries(FOCUS_ROAM_SPECS.flatMap((spec) => {
    const {
        roamId, key, labelNext, labelPrev, bindingModifiers, bidirectional = true,
    } = spec;
    const modifiers = bindingModifiers ?? {};
    const nextId = focusActionId('next', roamId);
    const entries = [[nextId, {
        id: nextId,
        labelKey: labelNext,
        groupKey: FOCUS_ROAM_GROUP,
        defaultBinding: buildFocusBinding(key, modifiers),
    }]];

    if (bidirectional) {
        const prevId = focusActionId('prev', roamId);
        entries.push([prevId, {
            id: prevId,
            labelKey: labelPrev,
            groupKey: FOCUS_ROAM_GROUP,
            defaultBinding: buildFocusBinding(key, modifiers, true),
        }]);
    }

    return entries;
}));


// Exported
export {
    FOCUS_ROAM_GROUP,
    FOCUS_ROAM_SPECS,
    focusRoamActions,
};

export const PAN_ROAM_ID = 'pan';
export const SLIDER_ROAM_ID = 'slider';
export const PREVIEW_EQ_ROAM_ID = 'previewEq';
export const PREVIEW_COMPRESSOR_ROAM_ID = 'previewCompressor';
export const PREVIEW_GATE_ROAM_ID = 'previewGate';
export const INPUT_PREVIEW_ROAM_ID = 'inputPreview';
export const SOLO_ROAM_ID = 'solo';
export const MUTE_ROAM_ID = 'mute';
export const BUS_IDENTIFIER_ROAM_ID = 'busIdentifier';
export const RESET_ROAM_ID = 'reset';
export const ADD_ROAM_ID = 'add';
export const REMOVE_ROAM_ID = 'remove';
export const EDIT_ROAM_ID = 'edit';

export const focusRoamAttrs = roamId => (roamId ? { 'data-focus-roam': roamId } : {});

export const focusNextPanActionId = focusActionId('next', PAN_ROAM_ID);
export const focusPrevPanActionId = focusActionId('prev', PAN_ROAM_ID);
export const focusNextSliderActionId = focusActionId('next', SLIDER_ROAM_ID);
export const focusPrevSliderActionId = focusActionId('prev', SLIDER_ROAM_ID);
export const focusNextPreviewEqActionId = focusActionId('next', PREVIEW_EQ_ROAM_ID);
export const focusPrevPreviewEqActionId = focusActionId('prev', PREVIEW_EQ_ROAM_ID);
export const focusNextPreviewCompressorActionId = focusActionId('next', PREVIEW_COMPRESSOR_ROAM_ID);
export const focusPrevPreviewCompressorActionId = focusActionId('prev', PREVIEW_COMPRESSOR_ROAM_ID);
export const focusNextPreviewGateActionId = focusActionId('next', PREVIEW_GATE_ROAM_ID);
export const focusPrevPreviewGateActionId = focusActionId('prev', PREVIEW_GATE_ROAM_ID);
export const focusNextInputPreviewActionId = focusActionId('next', INPUT_PREVIEW_ROAM_ID);
export const focusPrevInputPreviewActionId = focusActionId('prev', INPUT_PREVIEW_ROAM_ID);
export const focusNextSoloActionId = focusActionId('next', SOLO_ROAM_ID);
export const focusPrevSoloActionId = focusActionId('prev', SOLO_ROAM_ID);
export const focusNextMuteActionId = focusActionId('next', MUTE_ROAM_ID);
export const focusPrevMuteActionId = focusActionId('prev', MUTE_ROAM_ID);
export const focusNextBusIdentifierActionId = focusActionId('next', BUS_IDENTIFIER_ROAM_ID);
export const focusPrevBusIdentifierActionId = focusActionId('prev', BUS_IDENTIFIER_ROAM_ID);
export const focusNextResetActionId = focusActionId('next', RESET_ROAM_ID);
export const focusNextAddActionId = focusActionId('next', ADD_ROAM_ID);
export const focusNextRemoveActionId = focusActionId('next', REMOVE_ROAM_ID);
export const focusPrevRemoveActionId = focusActionId('prev', REMOVE_ROAM_ID);
export const focusNextEditActionId = focusActionId('next', EDIT_ROAM_ID);
export const focusPrevEditActionId = focusActionId('prev', EDIT_ROAM_ID);

export const focusRoamControl = (roamId, direction, root = document) => {
    const targets = [...root.querySelectorAll(`[data-focus-roam="${roamId}"]`)];
    if (!targets.length) return false;

    const { activeElement } = root;
    const activeIndex = targets.findIndex(el => el === activeElement || el.contains(activeElement));

    let nextIndex;
    if (activeIndex < 0) {
        nextIndex = direction > 0 ? 0 : targets.length - 1;
    } else {
        nextIndex = (activeIndex + direction + targets.length) % targets.length;
    }

    const target = targets[nextIndex];
    if (!target?.focus) return false;

    // Plain .focus() does not match :focus-visible; Radix buttons need the ring.
    target.focus({ preventScroll: false, focusVisible: true });
    target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    return true;
};

export const buildFocusRoamHandlers = () => Object.fromEntries(FOCUS_ROAM_SPECS.flatMap(({ roamId, bidirectional = true }) => {
    const nextId = focusActionId('next', roamId);
    const entries = [[nextId, () => focusRoamControl(roamId, 1) !== false]];

    if (bidirectional) {
        const prevId = focusActionId('prev', roamId);
        entries.push([prevId, () => focusRoamControl(roamId, -1) !== false]);
    }

    return entries;
}));
