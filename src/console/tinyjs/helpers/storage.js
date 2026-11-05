// Requirements
import { call } from './bridge';


// Exported
export const settingsLoad = () => call('settingsLoad');


export const settingsSet = s => call('settingsSet', s);


export const vaultsLoad = () => call('vaultsLoad');


export const vaultLoad = vaultId => call('vaultLoad', vaultId);


export const vaultSave = vault => call('vaultSave', vault);


export const vaultErase = vaultId => call('vaultErase', vaultId);


export const vaultEdit = (vaultId, vaultName) => call('vaultEdit', vaultId, vaultName);


export const vaultReplace = (vaultId, vaultContents) => call('vaultReplace', vaultId, vaultContents);
