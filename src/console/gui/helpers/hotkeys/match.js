// Internal
const modifierMatches = (event, binding) => !!event.ctrlKey === !!binding.ctrlKey
    && !!event.altKey === !!binding.altKey
    && !!event.metaKey === !!binding.metaKey
    && !!event.shiftKey === !!binding.shiftKey;


// Exported
export const bindingsEqual = (a, b) => {
    if (!a || !b) return false;
    return a.key === b.key
        && !!a.ctrlKey === !!b.ctrlKey
        && !!a.altKey === !!b.altKey
        && !!a.metaKey === !!b.metaKey
        && !!a.shiftKey === !!b.shiftKey;
};

export const eventMatchesBinding = (event, binding) => {
    if (!event || !binding?.key) return false;
    return event.code === binding.key && modifierMatches(event, binding);
};

export const findActionForEvent = (event, bindings, matchesAction = () => true) => {
    const match = Object.entries(bindings).find(([actionId, binding]) => (
        matchesAction(actionId) && eventMatchesBinding(event, binding)
    ));
    return match ? match[0] : null;
};
