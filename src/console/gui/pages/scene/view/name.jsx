// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useSceneName, useSceneOptions, useSceneSave } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { NameEditRow } from '../../../components/base/nameEditRow';


// Exported
export const useSceneDefaultName = (sceneId) => {
    const { t } = useLanguage();
    const { get } = useSceneOptions();
    const d = useMemo(() => get(sceneId), [get, sceneId]);
    return `${t('Scene')} ${d.number}`;
};


export const useSceneFinalName = (sceneId) => {
    const { t } = useLanguage();
    const { has, value } = useSceneName(sceneId);

    const { get } = useSceneOptions();
    const d = useMemo(() => get(sceneId), [get, sceneId]);

    const defaultName = useMemo(() => `${t('Scene')} ${d.number}`, [t, d]);

    return (!has || !value) ? defaultName : value;
};


export const NameEdit = ({ sceneId, onEnter }) => {
    const { t } = useLanguage();
    const { has, value } = useSceneName(sceneId);
    const { save } = useSceneSave(sceneId);
    const placeholder = useSceneFinalName(sceneId);
    const [editValue, setEditValue] = useState(undefined);
    const synced = useRef(false);

    useEffect(() => {
        synced.current = false;
        setEditValue(undefined);
    }, [sceneId]);

    useEffect(() => {
        if (value !== undefined && !synced.current) {
            setEditValue(value);
            synced.current = true;
        }
    }, [value]);

    const onSet = useCallback((name) => {
        setEditValue(name);
        save(name);
    }, [save]);

    if (!has || value === undefined || editValue === undefined) return null;

    return (
        <NameEditRow
            id="scene-name"
            label={t('Name')}
            placeholder={placeholder}
            value={editValue}
            set={onSet}
            onEnter={onEnter}
        />
    );
};
