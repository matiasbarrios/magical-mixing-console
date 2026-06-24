// Exported
export const isMacPlatform = () => typeof navigator !== 'undefined'
    && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export const primaryModifier = () => (isMacPlatform()
    ? { metaKey: true }
    : { ctrlKey: true });

export const primaryAltModifier = () => ({
    ...primaryModifier(),
    altKey: true,
});
