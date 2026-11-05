// Requirements
import {
    dataPath, exists, makeDir, readText, writeText,
} from './files.js';


// Constants
const SETTINGS_FILE_NAME = 'settings.json';

const initialConfig = {};


// Exported
export const settingsLoad = async () => {
    const settingsFile = dataPath(SETTINGS_FILE_NAME);
    if (!await exists(settingsFile)) {
        await makeDir(dataPath());
        await writeText(settingsFile, JSON.stringify(initialConfig));
        return initialConfig;
    }
    try {
        return JSON.parse(await readText(settingsFile));
    } catch (error) {
        console.error(`Unable to load settings file: ${error.message}`);
        return initialConfig;
    }
};


export const settingsSet = async (c) => {
    await writeText(dataPath(SETTINGS_FILE_NAME), JSON.stringify(c, null, 2));
};
