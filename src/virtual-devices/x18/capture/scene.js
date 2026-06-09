// Requirements
import { captureValues } from './values.js';


// Exported
export const sceneCapture = async (device) => {
    const { scene } = device.features;
    const sceneIds = scene.options.map(o => o.id);

    const indeed = await new Promise((resolve) => { scene.has(resolve); });
    if (!indeed) return;

    await captureValues('Scene name', scene.name, sceneIds);
    await captureValues('Scene scope', scene.scope, sceneIds, {
        onHas: async (sceneId) => {
            const scopeIds = scene.scope.options(sceneId).map(o => o.id);
            await captureValues('Scene scope options', scene.scope.on, scopeIds, {
                parentId: sceneId,
            });
        },
    });
    await captureValues('Scene active', scene.active, sceneIds);
};
