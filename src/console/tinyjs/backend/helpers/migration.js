// Copies settings and vaults from the Electron app into the tinyjs data dir the
// first time tinyjs runs. Both apps use the same files and JSON format.


// Requirements
import { exists, makeDir } from './files.js';


// Constants
const ELECTRON_APP_NAME = 'Magical Mixing Console';

const SETTINGS_FILE_NAME = 'settings.json';

const VAULTS_FOLDER = 'vaults';

const VAULTS_INDEX = 'index.json';


// Internal
// Electron's userData: the OS app data dir plus the productName
const electronDataDir = () => {
    const { env, homeDir } = tjs;
    if (env.OS === 'Windows_NT') {
        return `${env.APPDATA || `${homeDir}/AppData/Roaming`}/${ELECTRON_APP_NAME}`;
    }
    if (navigator.userAgentData?.platform === 'macOS') {
        return `${homeDir}/Library/Application Support/${ELECTRON_APP_NAME}`;
    }
    return `${env.XDG_CONFIG_HOME || `${homeDir}/.config`}/${ELECTRON_APP_NAME}`;
};


const pathIn = dir => (...parts) => [dir, ...parts].join('/');


const vaultFilesList = async (dir) => {
    const entries = await Array.fromAsync(await tjs.readDir(dir));
    return entries
        .filter(e => e.isFile && e.name.endsWith('.json') && e.name !== VAULTS_INDEX)
        .map(e => e.name);
};


// Exported
export const electronDataMigrate = async (targetDir, sourceDir = electronDataDir()) => {
    const target = pathIn(targetDir);
    const source = pathIn(sourceDir);
    try {
        const targetUsed = await exists(target(SETTINGS_FILE_NAME))
            || await exists(target(VAULTS_FOLDER, VAULTS_INDEX));
        if (targetUsed) return false;

        const hasSettings = await exists(source(SETTINGS_FILE_NAME));
        const hasVaults = await exists(source(VAULTS_FOLDER, VAULTS_INDEX));
        if (!hasSettings && !hasVaults) return false;

        // The index and settings go last: until they land, the next launch retries
        await makeDir(target(VAULTS_FOLDER));
        if (hasVaults) {
            const files = await vaultFilesList(source(VAULTS_FOLDER));
            await Promise.all(files.map(name => tjs.copyFile(source(VAULTS_FOLDER, name), target(VAULTS_FOLDER, name))));
            await tjs.copyFile(source(VAULTS_FOLDER, VAULTS_INDEX), target(VAULTS_FOLDER, VAULTS_INDEX));
        }
        if (hasSettings) {
            await tjs.copyFile(source(SETTINGS_FILE_NAME), target(SETTINGS_FILE_NAME));
        }

        console.log(`Migrated Electron data from ${sourceDir}`);
        return true;
    } catch (error) {
        console.error(`Electron data migration failed: ${error.message}`);
        return false;
    }
};
