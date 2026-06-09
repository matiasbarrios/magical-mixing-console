// Requirements
import { useCallback } from 'react';
import { IconButton } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { ICON_STYLE } from '../../helpers/values';
import { useUiSize } from '../theme';


// Exported
export default ({ checked, onCheckedChange, disabled }) => {
    const { disabled: deviceDisabled } = useDevice();
    const { textSize } = useUiSize();

    const toggle = useCallback(() => {
        onCheckedChange(!checked);
    }, [checked, onCheckedChange]);

    return (
        <IconButton
            size={textSize}
            variant="soft"
            color="gray"
            radius="medium"
            disabled={disabled || deviceDisabled}
            onClick={toggle}
        >
            {checked && <CheckIcon style={ICON_STYLE} />}
        </IconButton>
    );
};
