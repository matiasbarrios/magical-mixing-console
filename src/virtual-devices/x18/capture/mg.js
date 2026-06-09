// Requirements
import { captureValues } from './values.js';


// Exported
export const mgCapture = async (device) => {
    const { mg } = device.features;
    const mgIds = mg.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { mg.has(resolve); });
    if (!indeed) return;

    await captureValues('MG mute', mg.mute, mgIds);
};
