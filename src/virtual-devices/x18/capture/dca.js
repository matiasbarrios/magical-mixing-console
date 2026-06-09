// Requirements
import { captureValues } from './values.js';


// Exported
export const dcaCapture = async (device) => {
    const { dca } = device.features;
    const dcaIds = dca.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { dca.has(resolve); });
    if (!indeed) return;

    await captureValues('DCA name', dca.name, dcaIds);
    await captureValues('DCA color', dca.color, dcaIds);
    await captureValues('DCA mute', dca.mute, dcaIds);
    await captureValues('DCA level', dca.level, dcaIds);
    await captureValues('DCA solo', dca.solo, dcaIds);
};
