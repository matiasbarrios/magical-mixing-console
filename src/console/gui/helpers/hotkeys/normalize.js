// Constants
const MODIFIER_CODES = new Set([
    'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight',
    'MetaLeft', 'MetaRight',
    'ShiftLeft', 'ShiftRight',
]);


// Exported
export const normalizeKeyboardEvent = (event) => {
    if (!event?.code || MODIFIER_CODES.has(event.code)) return null;

    return {
        key: event.code,
        ctrlKey: !!event.ctrlKey,
        altKey: !!event.altKey,
        metaKey: !!event.metaKey,
        shiftKey: !!event.shiftKey,
    };
};
