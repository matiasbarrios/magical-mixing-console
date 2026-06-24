// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';


// Variables
let provider = null;

const Context = createContext({});


// Internal
const vaultsSortByName = (a, b) => {
    if (a.vaultName.toLowerCase() < b.vaultName.toLowerCase()) return -1;
    if (a.vaultName.toLowerCase() > b.vaultName.toLowerCase()) return 1;
    return 0;
};


// Exported
export const vaultSetProvider = async (p) => {
    provider = p;
};


export const VaultProvider = ({ children }) => {
    const [vaults, setVaults] = useState([]);

    useEffect(() => {
        const loadVaults = async () => {
            const v = await provider.vaultsLoad();
            v.sort(vaultsSortByName);
            setVaults(v);
        };
        loadVaults();
    }, []);

    const state = useMemo(() => ({ vaults, setVaults }), [vaults, setVaults]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


export const useVault = (vaultType) => {
    const { vaults, setVaults } = useContext(Context);

    const vaultsOfType = useMemo(() => vaults
        .filter(v => v.vaultType === vaultType), [vaults, vaultType]);

    const vaultLoad = useCallback(async (vaultId) => {
        const v = await provider.vaultLoad(vaultId);
        return v;
    }, []);

    const vaultSave = useCallback(async (vaultName, vaultContents) => {
        if (!vaultType) return;
        await provider.vaultSave({ vaultType, vaultName, vaultContents });
        const v = await provider.vaultsLoad();
        v.sort(vaultsSortByName);
        setVaults(v);
    }, [vaultType, setVaults]);

    const vaultErase = useCallback(async (vaultId) => {
        await provider.vaultErase(vaultId);
        const v = await provider.vaultsLoad();
        v.sort(vaultsSortByName);
        setVaults(v);
    }, [setVaults]);

    const vaultReplace = useCallback(async (vaultId, vaultContents) => {
        await provider.vaultReplace(vaultId, vaultContents);
    }, []);

    const removeNonValidNameCharacters = useCallback(v => v.replace(/[^a-zA-Z0-9\s-_]/g, ''), []);

    return {
        vaults: vaultType ? vaultsOfType : vaults,
        vaultLoad,
        vaultSave,
        vaultReplace,
        vaultErase,
        removeNonValidNameCharacters,
    };
};


export const useVaultName = (vaultId) => {
    const { vaults, setVaults } = useContext(Context);

    const vault = useMemo(() => vaults.find(v => v.vaultId === vaultId), [vaults, vaultId]);

    const setVaultName = useCallback(async (vaultName) => {
        await provider.vaultEdit(vaultId, vaultName);
        const v = await provider.vaultsLoad();
        v.sort(vaultsSortByName);
        setVaults(v);
    }, [vaultId, setVaults]);

    return {
        vaultName: vault?.vaultName,
        setVaultName,
    };
};
