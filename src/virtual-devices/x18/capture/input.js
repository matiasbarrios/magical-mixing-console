// Requirements
import { captureValues } from './values.js';


// Exported
export const inputCapture = async (device) => {
    const { input } = device.features;
    const inputIds = input.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { input.has(resolve); });
    if (!indeed) return;

    await captureValues('Input gain', input.gain, inputIds);
    await captureValues('Input phantom', input.phantom, inputIds);
};
