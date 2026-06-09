// Requirements
const { existsSync } = require('fs');
const {
    readFile, writeFile, mkdir, unlink,
} = require('fs/promises');
const path = require('path');
const process = require('process');
const crypto = require('crypto');
const electron = require('electron');
const { defaultPresets } = require('./presets');


// Variables
let userDataPath;
try {
    userDataPath = electron.app?.getPath('userData') || electron.remote?.app.getPath('userData');
} catch {
    userDataPath = process.cwd(); // Fallback for development
}
const vaultsFolder = path.join(userDataPath, 'vaults');
const vaultsIndex = path.join(vaultsFolder, 'index.json');
let vaults = [];
let vaultsLoaded = false;
let vaultsLoading = false;


// Constants
const VAULT_ID_RE = /^[0-9a-f]{16}$/;


// Internal
const assertVaultId = (vaultId) => {
    if (!VAULT_ID_RE.test(vaultId)) throw new Error('Invalid vault id');
};


const valueIdGet = () => {
    const vaultId = crypto.randomBytes(8).toString('hex');
    if (!vaults.find(v => v.vaultId === vaultId)) return vaultId;
    return valueIdGet();
};


const vaultsSave = async () => {
    await writeFile(vaultsIndex, JSON.stringify({
        modified: new Date().toISOString(),
        vaults,
    }, null, 2));
};


const vaultsSaveDefault = async () => {
    const presetSave = (vaultType, where) => async (vaultName) => {
        const vaultId = valueIdGet();
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        const vaultContents = where[vaultName];
        await writeFile(vaultFile, JSON.stringify(vaultContents, null, 2));
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
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        const vaultContents = defaultPresets.equalizer[vaultName];
        await writeFile(vaultFile, JSON.stringify(vaultContents, null, 2));
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
                const vaultFile = path.join(vaultsFolder, `${existing.vaultId}.json`);
                await writeFile(vaultFile, JSON.stringify(vaultContents, null, 2));
                return;
            }
            await presetSave(vaultName);
        }));
        await vaultsSave();
    } catch (error) {
        console.error('Error syncing default equalizer presets', error.stack);
    }
};


// Exported
const vaultsLoad = async () => {
    if (vaultsLoading) {
        await new Promise((resolve) => { setTimeout(resolve, 300); });
        return vaultsLoad();
    }

    if (vaultsLoaded) return [...vaults];

    vaultsLoading = true;

    if (!existsSync(vaultsIndex)) {
        if (!existsSync(vaultsFolder)) {
            await mkdir(vaultsFolder, { recursive: true });
        }
        await vaultsSaveDefault();
        vaultsLoading = false;
        vaultsLoaded = true;
        return [...vaults];
    }

    try {
        const indexFileContents = await readFile(vaultsIndex, 'utf8');
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


const vaultLoad = async (vaultId) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        const vaultContents = await readFile(vaultFile, 'utf8');
        return JSON.parse(vaultContents);
    } catch (error) {
        console.error('Error loading vault', vaultId, error.message);
        return null;
    }
};


const vaultSave = async ({ vaultType, vaultName, vaultContents }) => {
    try {
        if (!vaultType.trim() || !vaultName.trim()) {
            throw new Error('Invalid vault type or name');
        }
        if (!vaultContents || typeof vaultContents !== 'object') {
            throw new Error('Invalid data to save');
        }
        const vaultId = valueIdGet();
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        await writeFile(vaultFile, JSON.stringify(vaultContents, null, 2));

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


const vaultErase = async (vaultId) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        try {
            await unlink(vaultFile);
        } catch {
            // Ignore
        }
        vaults = vaults.filter(v => v.vaultId !== vaultId);
        await vaultsSave();
    } catch (error) {
        console.error('Error erasing vault', vaultId, error.message);
    }
};


const vaultEdit = async (vaultId, vaultName) => {
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


const vaultReplace = async (vaultId, vaultContents) => {
    try {
        assertVaultId(vaultId);
        if (!vaults.find(v => v.vaultId === vaultId)) throw new Error('Vault not found');
        if (!vaultContents || typeof vaultContents !== 'object') {
            throw new Error('Invalid data to save');
        }
        const vaultFile = path.join(vaultsFolder, `${vaultId}.json`);
        await writeFile(vaultFile, JSON.stringify(vaultContents, null, 2));
    } catch (error) {
        console.error('Error replacing vault', vaultId, error.message);
    }
};


// Export
module.exports = {
    vaultsLoad,
    vaultLoad,
    vaultSave,
    vaultErase,
    vaultEdit,
    vaultReplace,
};
