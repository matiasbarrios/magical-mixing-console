// Requirements
import { useMemo } from 'react';
import { useSceneName, useSceneOptions } from '@magical-mixing/mixers-react';
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
    const { has, value, set } = useSceneName(sceneId);
    const placeholder = useSceneFinalName(sceneId);

    if (!has || value === undefined) return null;

    return (
        <NameEditRow
            id="scene-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};
