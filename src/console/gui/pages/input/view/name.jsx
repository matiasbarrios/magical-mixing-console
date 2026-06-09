// Requirements
import { useMemo } from 'react';
import { useInputName, useInputOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { NameEditRow } from '../../../components/base/nameEditRow';


// Exported
export const useInputNameTranslated = (inputId) => {
    const { translateOption } = useLanguage();
    const { get } = useInputOptions();
    const option = useMemo(() => get(inputId), [get, inputId]);
    const { has, value } = useInputName(inputId);
    const name = translateOption(option, has ? value : '');
    return { name };
};


export const InputName = ({ inputId }) => {
    const { name } = useInputNameTranslated(inputId);
    return name;
};


export const NameEdit = ({ inputId, onEnter }) => {
    const { t, translateOption } = useLanguage();
    const { has, value, set } = useInputName(inputId);
    const { get } = useInputOptions();
    const option = useMemo(() => get(inputId), [get, inputId]);
    const placeholder = translateOption(option);

    if (!has || value === undefined) return null;

    return (
        <NameEditRow
            id="input-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};
