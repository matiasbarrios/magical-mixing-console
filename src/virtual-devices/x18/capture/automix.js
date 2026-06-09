// Requirements
import { captureValues } from './values.js';


// Exported
export const automixCapture = async (device) => {
    const { automix } = device.features;
    const automixIds = automix.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { automix.has(resolve); });
    if (!indeed) return;

    await captureValues('Automix on', automix.on, automixIds);
    await captureValues('Automix lock', automix.lock, automixIds);
};
