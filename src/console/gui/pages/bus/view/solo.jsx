// Requirements
import { useCallback, useMemo } from 'react';
import { useBusOptions, useBusToOn, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { LetterIconButton } from '../../../components/base/letterIconButton';


// Exported
export default ({
    busId, dense = false, stopPropagation = false,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { soloOne } = useBusOptions();
    const { has, value, toggle } = useBusToOn(busId, soloOne.id);

    const color = useMemo(() => (value ? 'yellow' : 'gray'), [value]);

    const onClick = useCallback(() => {
        toggle();
    }, [toggle]);

    if (!has) return null;

    return (
        <LetterIconButton
            letter="S"
            color={color}
            disabled={disabled}
            onClick={onClick}
            aria-label={t('Solo on')}
            aria-pressed={value}
            dense={dense}
            stopPropagation={stopPropagation}
        />
    );
};
