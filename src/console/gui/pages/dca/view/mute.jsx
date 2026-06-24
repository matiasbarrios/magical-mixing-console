// Requirements
import { useCallback, useMemo } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { LetterIconButton } from '../../../components/base/letterIconButton';
import { FallbackDcaMute } from '../../../components/fallback';


// Internal
const Mute = ({
    has, value, toggle, dense = false,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
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
            focusRoam="mute"
        />
    );
};


// Exported
export default ({ dcaId, dense = false }) => (
    <FallbackDcaMute dcaId={dcaId}>
        {({ has, value, toggle }) => (
            <Mute has={has} value={value} toggle={toggle} dense={dense} />
        )}
    </FallbackDcaMute>
);
