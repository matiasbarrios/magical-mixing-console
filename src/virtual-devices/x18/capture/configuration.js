// Requirements
import { doAsync } from '../../helpers/iterator.js';
import { captureValue } from './values.js';


// Exported
export const configurationCapture = async (device) => {
    const { configuration } = device.features;
    const { categories, options } = configuration;

    const indeed = await new Promise((resolve) => {
        configuration.has(resolve);
    });
    if (!indeed) return;

    console.log('Capturing configuration values');
    await doAsync(categories, async (category) => {
        const categoryOptions = options.filter(o => o.categoryId === category.id);
        await doAsync(categoryOptions, async (option) => {
            const feature = configuration[category.id][option.categoryOptionId];
            await captureValue(undefined, feature);
        });
    });
};
