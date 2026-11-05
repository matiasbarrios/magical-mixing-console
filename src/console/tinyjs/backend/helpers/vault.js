// Requirements
import defaultPresets from '../../../defaultPresets.json';
import {
    dataPath, exists, makeDir, readText, remove, writeText,
} from './files.js';


// Variables
let vaults = [];
let vaultsLoaded = false;
let vaultsLoading = false;


// Constants
const VAULT_ID_RE = /^[0-9a-f]{16}$/;


// Internal
const vaultsFolder = () => dataPath('vaults');


const vaultsIndex = () => dataPath('vaults', 'index.json');


const vaultFile = vaultId => dataPath('vaults', `${vaultId}.json`);


const assertVaultId = (vaultId) => {
    if (!VAULT_ID_RE.test(vaultId)) throw new Error('Invalid vault id');
};


const valueIdGet = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const vaultId = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    if (!vaults.find(v => v.vaultId === vaultId)) return vaultId;
    return valueIdGet();
};


const vaultsSave = async () => {
    await writeText(vaultsIndex(), JSON.stringify({
        modified: new Date().toISOString(),
        vaults,
    }, null, 2));
};


const vaultsSaveDefault = async () => {
    const presetSave = (vaultType, where) => async (vaultName) => {
        const vaultId = valueIdGet();
        const vaultContents = where[vaultName];
        await writeText(vaultFile(vaultId), JSON.stringify(vaultContents, null, 2));
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
        const vaultContents = defaultPresets.equalizer[vaultName];
        await writeText(vaultFile(vaultId), JSON.stringify(vaultContents, null, 2));
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
                await writeText(vaultFile(existing.vaultId), JSON.stringify(vaultContents, null, 2));
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
export const vaultsLoad = async () => {
    if (vaultsLoading) {
        await new Promise((resolve) => { setTimeout(resolve, 300); });
        return vaultsLoad();
    }

    if (vaultsLoaded) return [...vaults];

    vaultsLoading = true;

    if (!await exists(vaultsIndex())) {
        await makeDir(vaultsFolder());
        await vaultsSaveDefault();
        vaultsLoading = false;
        vaultsLoaded = true;
        return [...vaults];
    }

    try {
        const index = JSON.parse(await readText(vaultsIndex()));
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
        return JSON.parse(await readText(vaultFile(vaultId)));
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
        await writeText(vaultFile(vaultId), JSON.stringify(vaultContents, null, 2));

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
        try {
            await remove(vaultFile(vaultId));
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
        await writeText(vaultFile(vaultId), JSON.stringify(vaultContents, null, 2));
    } catch (error) {
        console.error('Error replacing vault', vaultId, error.message);
    }
};
