// Requirements
const { existsSync } = require('fs');
const path = require('path');
const { writeFile, readFile } = require('fs/promises');
const electron = require('electron');


// Constants
const SETTINGS_FILE_NAME = 'settings.json';


// Variables
let userDataPath;
try {
    userDataPath = electron.app?.getPath('userData') || electron.remote?.app.getPath('userData');
} catch {
    userDataPath = process.cwd(); // Fallback for development
}
const settingsFile = path.join(userDataPath, SETTINGS_FILE_NAME);
const initialConfig = {};


// Exported
const settingsLoad = async () => {
    if (!existsSync(settingsFile)) {
        await writeFile(settingsFile, JSON.stringify(initialConfig));
        return initialConfig;
    }
    const res = await readFile(settingsFile);
    try {
        return JSON.parse(res);
    } catch (error) {
        console.error(`Unable to load settings file: ${error.message}`);
        return initialConfig;
    }
};


const settingsSet = async (c) => {
    await writeFile(settingsFile, JSON.stringify(c, null, 2));
};


// Export
module.exports = {
    settingsLoad,
    settingsSet,
};
