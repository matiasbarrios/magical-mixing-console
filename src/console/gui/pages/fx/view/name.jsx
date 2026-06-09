// Requirements
import { useMemo } from 'react';
import { useFxOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';


// Exported
export const useFxNameTranslated = (fxId) => {
    const { translateTry } = useLanguage();
    const { get } = useFxOptions();
    const option = useMemo(() => get(fxId), [get, fxId]);
    const name = useMemo(() => translateTry(option?.name || ''), [option, translateTry]);
    return { name };
};
