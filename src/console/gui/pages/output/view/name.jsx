// Requirements
import { useMemo } from 'react';
import { useOutputName, useOutputOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { NameEditRow } from '../../../components/base/nameEditRow';


// Exported
export const useOutputNameTranslated = (outputId) => {
    const { translateOption } = useLanguage();
    const { get } = useOutputOptions();
    const option = useMemo(() => get(outputId), [get, outputId]);
    const { has, value } = useOutputName(outputId);
    const name = translateOption(option, has ? value : '');
    return { name };
};


export const NameEdit = ({ outputId, onEnter }) => {
    const { t, translateOption } = useLanguage();
    const { has, value, set } = useOutputName(outputId);
    const { get } = useOutputOptions();
    const option = useMemo(() => get(outputId), [get, outputId]);
    const placeholder = translateOption(option);

    if (!has || value === undefined) return null;

    return (
        <NameEditRow
            id="output-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};
