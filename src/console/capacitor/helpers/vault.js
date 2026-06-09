// Requirements
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { defaultPresets } from './presets';


// Constants
const vaultsFolder = 'vaults';
const vaultsIndex = `${vaultsFolder}/index.json`;
const VAULT_ID_RE = /^[0-9a-f]{16}$/;


// Variables
let vaults = [];
let vaultsLoaded = false;
let vaultsLoading = false;


// Internal
const assertVaultId = (vaultId) => {
    if (!VAULT_ID_RE.test(vaultId)) throw new Error('Invalid vault id');
};


const valueIdGet = () => {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    const vaultId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    if (!vaults.find(v => v.vaultId === vaultId)) return vaultId;
    return valueIdGet();
};


const vaultsSave = async () => {
    try {
        await Filesystem.writeFile({
            path: vaultsIndex,
            data: JSON.stringify({
                modified: new Date().toISOString(),
                vaults,
            }, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    } catch (error) {
        console.error(`Unable to write settings file: ${error.message}`);
    }
};


const vaultsSaveDefault = async () => {
    const presetSave = (vaultType, where) => async (vaultName) => {
        const vaultId = valueIdGet();
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        const vaultContents = where[vaultName];
        await Filesystem.writeFile({
            path: vaultFile,
            data: JSON.stringify(vaultContents, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        const vaultCreated = new Date().toISOString();
        vaults.push({
            vaultId, vaultType, vaultName, vaultCreated,
        });
    };

    try {
        await Promise.all(Object.keys(defaultPresets.compressor)
            .map(presetSave('preset-compressor', defaultPresets.compressor)));
        await Promise.all(Object.keys(defaultPresets.gate)
            .map(presetSave('preset-gate', defaultPresets.gate)));
        await Promise.all(Object.keys(defaultPresets.equalizer)
            .map(presetSave('preset-equalizer', defaultPresets.equalizer)));
        await vaultsSave();
    } catch (error) {
        console.error('Error saving default vaults', error.stack);
    }
};


const vaultsSyncEqualizerDefaults = async () => {
    const presetSave = async (vaultName) => {
        const vaultId = valueIdGet();
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        const vaultContents = defaultPresets.equalizer[vaultName];
        await Filesystem.writeFile({
            path: vaultFile,
            data: JSON.stringify(vaultContents, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        vaults.push({
            vaultId,
            vaultType: 'preset-equalizer',
            vaultName,
            vaultCreated: new Date().toISOString(),
        });
    };

    try {
        await Promise.all(Object.keys(defaultPresets.equalizer).map(async (vaultName) => {
            const existing = vaults.find(v => (
                v.vaultType === 'preset-equalizer' && v.vaultName === vaultName
            ));
            const vaultContents = defaultPresets.equalizer[vaultName];
            if (existing) {
                assertVaultId(existing.vaultId);
                const vaultFile = `${vaultsFolder}/${existing.vaultId}.json`;
                await Filesystem.writeFile({
                    path: vaultFile,
                    data: JSON.stringify(vaultContents, null, 2),
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                return;
            }
            await presetSave(vaultName);
        }));
        await vaultsSave();
    } catch (error) {
        console.error('Error syncing default equalizer presets', error.stack);
    }
};


const fileExists = async (path) => {
    try {
        await Filesystem.stat({
            path,
            directory: Directory.Data,
        });
        return true;
    } catch {
        return false;
    }
};


// Exported
export const vaultsLoad = async () => {
    if (vaultsLoading) {
        await new Promise((resolve) => { setTimeout(resolve, 300); });
        return vaultsLoad();
    }

    if (vaultsLoaded) return [...vaults];

    vaultsLoading = true;

    const vaultsIndexExists = await fileExists(vaultsIndex);
    if (!vaultsIndexExists) {
        const vaultsFolderExists = await fileExists(vaultsFolder);
        if (!vaultsFolderExists) {
            await Filesystem.mkdir({
                path: vaultsFolder,
                directory: Directory.Data,
            });
        }
        await vaultsSaveDefault();
        vaultsLoading = false;
        vaultsLoaded = true;
        return [...vaults];
    }

    try {
        const { data: indexFileContents } = await Filesystem.readFile({
            path: vaultsIndex,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        const index = JSON.parse(indexFileContents);
        if (!index || !Array.isArray(index.vaults)) throw new Error('Invalid vaults');
        vaults = index.vaults;
        await vaultsSyncEqualizerDefaults();
        vaultsLoading = false;
        vaultsLoaded = true;
        return [...vaults];
    } catch (error) {
        console.error('Error loading vaults', error.message);
        vaults = [];
        await vaultsSaveDefault();
        vaultsLoading = false;
        vaultsLoaded = true;
        return [...vaults];
    }
};


export const vaultLoad = async (vaultId) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        const { data: vaultContents } = await Filesystem.readFile({
            path: vaultFile,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        return JSON.parse(vaultContents);
    } catch (error) {
        console.error('Error loading vault', vaultId, error.message);
        return null;
    }
};


export const vaultSave = async ({ vaultType, vaultName, vaultContents }) => {
    try {
        if (!vaultType.trim() || !vaultName.trim()) {
            throw new Error('Invalid vault type or name');
        }
        if (!vaultContents || typeof vaultContents !== 'object') {
            throw new Error('Invalid data to save');
        }
        const vaultId = valueIdGet();
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        await Filesystem.writeFile({
            path: vaultFile,
            data: JSON.stringify(vaultContents, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });

        const vaultCreated = new Date().toISOString();
        vaults.push({
            vaultId, vaultType, vaultName, vaultCreated,
        });
        await vaultsSave();

        return vaultId;
    } catch (error) {
        console.error('Error saving vault', error.message);
        return null;
    }
};


export const vaultErase = async (vaultId) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        try {
            await Filesystem.deleteFile({
                path: vaultFile,
                directory: Directory.Data,
            });
        } catch {
            // Ignore
        }
        vaults = vaults.filter(v => v.vaultId !== vaultId);
        await vaultsSave();
    } catch (error) {
        console.error('Error erasing vault', vaultId, error.message);
    }
};


export const vaultEdit = async (vaultId, vaultName) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        if (!vaultName.trim()) throw new Error('Invalid vault name');
        vaults.find(v => v.vaultId === vaultId).vaultName = vaultName;
        await vaultsSave();
    } catch (error) {
        console.error('Error editing vault', vaultId, error.message);
    }
};


export const vaultReplace = async (vaultId, vaultContents) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        if (!vaultContents || typeof vaultContents !== 'object') {
            throw new Error('Invalid data to save');
        }
        const vaultFile = `${vaultsFolder}/${vaultId}.json`;
        await Filesystem.writeFile({
            path: vaultFile,
            data: JSON.stringify(vaultContents, null, 2),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    } catch (error) {
        console.error('Error replacing vault', vaultId, error.message);
    }
};

