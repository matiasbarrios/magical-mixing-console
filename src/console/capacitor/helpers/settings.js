// Requirements
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


// Constants
const SETTINGS_FILE_NAME = 'settings.json';
const initialConfig = {};


// Internal
const fileExists = async () => {
    try {
        await Filesystem.stat({
            path: SETTINGS_FILE_NAME,
            directory: Directory.Data,
        });
        return true;
    } catch {
        return false;
    }
};


// Exported
export const settingsLoad = async () => {
    const exists = await fileExists();
    try {
        if (!exists) {
            await Filesystem.writeFile({
                path: SETTINGS_FILE_NAME,
                data: JSON.stringify(initialConfig),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
                recursive: true,
            });
            return initialConfig;
        }
        const res = await Filesystem.readFile({
            path: SETTINGS_FILE_NAME,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        return JSON.parse(res.data);
    } catch (error) {
        console.error(`Unable to read settings file: ${error.message}`);
        return initialConfig;
    }
};


export const settingsSet = (c) => {
    setTimeout(async () => {
        try {
            await Filesystem.writeFile({
                path: SETTINGS_FILE_NAME,
                data: JSON.stringify(c, null, 2),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
        } catch (error) {
            console.error(`Unable to write settings file: ${error.message}`);
        }
    });
};
