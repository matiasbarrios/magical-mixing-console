// Exported
export const hotkeyBinding = (key, modifiers = {}) => ({
    key,
    ctrlKey: !!modifiers.ctrlKey,
    altKey: !!modifiers.altKey,
    metaKey: !!modifiers.metaKey,
    shiftKey: !!modifiers.shiftKey,
});
