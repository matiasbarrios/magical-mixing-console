// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useMgName, useMgNameResetAll, useMgOptions } from '@magical-mixing/mixers-react';
import { FallbackContext } from '../context';
import { useLanguage } from '../../language';
import { useFallbackName, useFallbackNames } from '../shared/name';
import { useFallbackMgOptions } from './options';


// Internal
const FallbackName = ({ mgId, defaultName, children }) => {
    const { mgOptions, setMgOptions } = useContext(FallbackContext);
    const { value: nameValue, set: nameSet } = useFallbackName('mg', mgId);

    const { options: deviceOptions } = useMgOptions();

    const isDeviceOption = useMemo(() => deviceOptions
        .some(o => o.id === mgId), [deviceOptions, mgId]);

    const value = useMemo(() => {
        if (isDeviceOption) return nameValue || '';
        const r = mgOptions.find(o => o.id === mgId);
        if (r) return r.name || '';
        return '';
    }, [mgId, nameValue, mgOptions, isDeviceOption]);

    const set = useCallback((name) => {
        // Names for device ones are stored separately
        if (isDeviceOption) {
            nameSet(name);
        } else {
            const r = mgOptions.find(o => o.id === mgId);
            if (!r) return;
            r.name = name;
            setMgOptions([...mgOptions]);
        }
    }, [isDeviceOption, nameSet, mgId, mgOptions, setMgOptions]);

    return children({
        has: true, value, set, defaultName,
    });
};


const DeviceMgName = ({ mgId, defaultName, children }) => {
    const { has, value, set } = useMgName(mgId);
    if (!has) return <FallbackName mgId={mgId} defaultName={defaultName}>{children}</FallbackName>;
    return children({
        has, value, set, defaultName,
    });
};


// Exported
export const useFallbackMgNames = () => {
    const { mgOptions, setMgOptions } = useContext(FallbackContext);
    const { namesReset } = useFallbackNames('mg');
    const { resetAll: mgNameResetAll } = useMgNameResetAll();

    const namesResetFinal = useCallback(async () => {
        namesReset();
        await mgNameResetAll();
        mgOptions.forEach((o) => { o.name = ''; });
        setMgOptions([...mgOptions]);
    }, [namesReset, mgOptions, setMgOptions, mgNameResetAll]);

    return { namesReset: namesResetFinal };
};


export const FallbackMgName = ({ mgId, children }) => {
    const { mgOptions } = useContext(FallbackContext);

    const { t } = useLanguage();
    const { get } = useFallbackMgOptions();
    const d = useMemo(() => get(mgId), [get, mgId]);
    const defaultName = useMemo(() => (
        d ? `${t('Mute group')} ${d.number}` : `${t('Mute group')}`
    ), [t, d]);

    if (!d) return null;

    if (!mgOptions.find(o => o.id === mgId)) {
        return (
            <DeviceMgName mgId={mgId} defaultName={defaultName}>
                {children}
            </DeviceMgName>
        );
    }
    return <FallbackName mgId={mgId} defaultName={defaultName}>{children}</FallbackName>;
};
