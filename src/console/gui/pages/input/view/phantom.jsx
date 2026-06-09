// Requirements
import { useCallback, useMemo } from 'react';
import { useDevice, useInputPhantom } from '@magical-mixing/mixers-react';
import { LetterIconButton } from '../../../components/base/letterIconButton';


// Exported
export default ({ inputId }) => {
    const { disabled } = useDevice();
    const { has, value, toggle } = useInputPhantom(inputId);

    const color = useMemo(() => (value ? 'red' : 'gray'), [value]);

    const onClick = useCallback(() => {
        toggle();
    }, [toggle]);

    if (!has) return null;

    return (
        <LetterIconButton
            letter="48v"
            color={color}
            disabled={disabled}
            onClick={onClick}
        />
    );
};
