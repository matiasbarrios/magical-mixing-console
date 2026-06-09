// Requirements
import { useCallback, useMemo } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { FallbackMgMute } from '../../../components/fallback';
import { LetterIconButton } from '../../../components/base/letterIconButton';


// Internal
const Mute = ({
    has, value, toggle, dense = false,
}) => {
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
            dense={dense}
        />
    );
};


// Exported
export default ({ mgId, dense = false }) => (
    <FallbackMgMute mgId={mgId}>
        {({ has, value, toggle }) => (
            <Mute has={has} value={value} toggle={toggle} dense={dense} />
        )}
    </FallbackMgMute>
);
