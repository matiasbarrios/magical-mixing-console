// Requirements
import { captureValues } from './values.js';


// Exported
export const outputCapture = async (device) => {
    const { output } = device.features;
    const outputIds = output.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { output.has(resolve); });
    if (!indeed) return;

    await captureValues('Output source', output.source, outputIds);
    await captureValues('Output tap', output.tap, outputIds);
    await captureValues('Output volume', output.volume, outputIds);
};
