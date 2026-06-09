// Requirements
import { doAsync } from '../../helpers/iterator.js';


// Exported
export const captureValue = async (id, feature, { parentId, onHas, onGotten } = {}) => {
    const ids = [];
    if (parentId !== undefined) {
        if (Array.isArray(parentId)) ids.push(...parentId);
        else ids.push(parentId);
    }
    if (id !== undefined) ids.push(id);

    const doHas = await new Promise((resolve) => {
        feature.has(...ids, resolve);
    });
    if (!doHas) return;

    // If it has its own, call it
    if (onHas) {
        await onHas(id);
        return;
    }

    // Otherwise, get the value
    let unlisten = null;
    const value = await new Promise((resolve) => {
        unlisten = feature.get(...ids, resolve);
    });
    if (unlisten) unlisten();
    if (onGotten) onGotten(value);
};


export const captureValues = async (title, feature, ids, options) => {
    if (title) console.log(`  ${title}`);
    await doAsync(ids, async (id) => {
        await captureValue(id, feature, options);
    });
};
