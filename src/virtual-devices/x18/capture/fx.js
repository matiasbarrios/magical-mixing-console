// Requirements
import { captureValues, captureValue } from './values.js';


// Exported
export const fxCapture = async (device) => {
    const { fx } = device.features;
    const fxIds = fx.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { fx.has(resolve); });
    if (!indeed) return;

    await captureValues('Fx insert', fx.insert, fxIds, {
        onHas: async (fxId) => {
            await captureValue(fxId, fx.insert.on);
            await captureValue(fxId, fx.insert.left);
            await captureValue(fxId, fx.insert.right);
        },
    });

    await captureValues('Fx bus', fx.bus, fxIds);
    await captureValues('Fx type', fx.type, fxIds); // Get values
    await captureValues('Fx type', fx.type, fxIds, {
        onHas: async (fxId) => {
            const typeOptions = fx.type.options(fxId).map(o => o.id);
            await captureValues(`Fx parameters of ${fxId}`, fx.parameters, typeOptions, {
                parentId: fxId,
                onHas: async (typeId) => {
                    const parametersOptions = fx.parameters.options(fxId, typeId).map(o => o.id);
                    await captureValues(`Fx parameters parameter of ${fxId} ${typeId}`, fx.parameters.parameter, parametersOptions, {
                        parentId: [fxId, typeId],
                    });
                },
            });
        },
    });
};
