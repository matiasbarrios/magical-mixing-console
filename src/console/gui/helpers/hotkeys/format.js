// Requirements
import { isMacPlatform } from './platformModifier';


// Constants
const KEY_LABELS = {
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Enter: 'Enter',
    Escape: 'Esc',
    Tab: 'Tab',
    Space: 'Space',
    PageUp: 'Page Up',
    PageDown: 'Page Down',
    Home: 'Home',
    End: 'End',
};


// Internal
const isMac = isMacPlatform();


const formatKey = (code) => {
    if (KEY_LABELS[code]) return KEY_LABELS[code];
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Numpad')) return code.slice(6);
    return code;
};


// Exported
export const formatBinding = (binding) => {
    if (!binding?.key) return '';

    const parts = [];
    if (binding.ctrlKey) parts.push(isMac ? '⌃' : 'Ctrl');
    if (binding.altKey) parts.push(isMac ? '⌥' : 'Alt');
    if (binding.metaKey) parts.push(isMac ? '⌘' : 'Win');
    if (binding.shiftKey) parts.push(isMac ? '⇧' : 'Shift');
    parts.push(formatKey(binding.key));

    return isMac ? parts.join('') : parts.join('+');
};
