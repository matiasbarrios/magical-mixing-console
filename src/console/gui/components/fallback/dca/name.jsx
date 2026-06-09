// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useDcaName, useDcaNameResetAll, useDcaOptions } from '@magical-mixing/mixers-react';
import { FallbackContextRoot } from '../context';
import { useLanguage } from '../../language';
import { useFallbackName, useFallbackNames } from '../shared/name';
import { useFallbackDcaOptions } from './options';


// Internal
const FallbackName = ({ dcaId, defaultName, children }) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);
    const { value: nameValue, set: nameSet } = useFallbackName('dca', dcaId);

    const { options: deviceOptions } = useDcaOptions();

    const isDeviceOption = useMemo(() => deviceOptions
        .some(o => o.id === dcaId), [deviceOptions, dcaId]);

    const value = useMemo(() => {
        if (isDeviceOption) return nameValue || '';
        const r = dcaOptions.find(o => o.id === dcaId);
        if (r) return r.name || '';
        return '';
    }, [dcaId, nameValue, dcaOptions, isDeviceOption]);

    const set = useCallback((name) => {
        // Names for device ones are stored separately
        if (isDeviceOption) {
            nameSet(name);
        } else {
            const r = dcaOptions.find(o => o.id === dcaId);
            if (!r) return;
            r.name = name;
            setDcaOptions([...dcaOptions]);
        }
    }, [isDeviceOption, nameSet, dcaId, dcaOptions, setDcaOptions]);

    return children({
        has: true, value, set, defaultName,
    });
};


const DeviceDcaName = ({ dcaId, defaultName, children }) => {
    const { has, value, set } = useDcaName(dcaId);
    if (!has) {
        return (
            <FallbackName dcaId={dcaId} defaultName={defaultName}>
                {children}
            </FallbackName>
        );
    }
    return children({
        has, value, set, defaultName,
    });
};


// Exported
export const useFallbackDcaNames = () => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);
    const { namesReset } = useFallbackNames('dca');
    const { resetAll: dcaNameResetAll } = useDcaNameResetAll();

    const namesResetFinal = useCallback(async () => {
        namesReset();
        await dcaNameResetAll();
        dcaOptions.forEach((o) => { o.name = ''; });
        setDcaOptions([...dcaOptions]);
    }, [namesReset, dcaOptions, setDcaOptions, dcaNameResetAll]);

    return { namesReset: namesResetFinal };
};


export const FallbackDcaName = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);

    const { t } = useLanguage();
    const { get } = useFallbackDcaOptions();
    const d = useMemo(() => get(dcaId), [get, dcaId]);
    const defaultName = useMemo(() => (
        d ? `${t('DCA')} ${d.number}` : `${t('DCA')}`
    ), [t, d]);

    if (!d) return null;

    if (!dcaOptions.find(o => o.id === dcaId)) {
        return (
            <DeviceDcaName dcaId={dcaId} defaultName={defaultName}>
                {children}
            </DeviceDcaName>
        );
    }
    return <FallbackName dcaId={dcaId} defaultName={defaultName}>{children}</FallbackName>;
};
