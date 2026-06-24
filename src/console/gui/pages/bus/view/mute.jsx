// Requirements
import { useCallback, useMemo } from 'react';
import { useBusMute, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { LetterIconButton } from '../../../components/base/letterIconButton';


// Exported
export default ({
    busId, dense = false, stopPropagation = false, focusRoam = 'mute',
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { has, value, toggle } = useBusMute(busId);

    const color = useMemo(() => (value ? 'red' : 'gray'), [value]);

    const onClick = useCallback(() => {
        toggle();
    }, [toggle]);

    if (!has) return null;

    return (
        <LetterIconButton
            letter="M"
            color={color}
            disabled={disabled}
            onClick={onClick}
            aria-label={t('Muted')}
            aria-pressed={value}
            dense={dense}
            stopPropagation={stopPropagation}
            focusRoam={focusRoam}
        />
    );
};
