const TYPING_FOCUS_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const CHROME_FOCUS_SELECTOR = 'header, footer';


// Exported
export const resetFocusForHotkeys = () => {
    const { activeElement } = document;
    if (activeElement?.closest?.(TYPING_FOCUS_SELECTOR)) return;

    if (activeElement?.closest?.(CHROME_FOCUS_SELECTOR)) {
        activeElement.blur();
    }

    const main = document.querySelector('main');
    if (!main || main.contains(document.activeElement)) return;

    main.focus({ preventScroll: true });
};

export const shouldIgnoreHotkeyEvent = (event) => {
    if (event?.target?.closest?.('[data-hotkey-recording]')) return true;

    const { activeElement } = document;
    if (!activeElement) return false;

    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) return true;
    if (activeElement.isContentEditable) return true;

    return false;
};
