// Requirements
import { useCallback } from 'react';
import { IconButton } from '@radix-ui/themes';
import { MinusIcon } from '@radix-ui/react-icons';
import { useBusToOnAndLevelAbove, useDevice } from '@magical-mixing/mixers-react';
import { ICON_STYLE } from '../../../../helpers/values';
import { useUiSize } from '../../../../components/theme';


// Exported
export default ({ busIdFrom, busIdTo, ariaLabel }) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { disableOnOrLevelAbove } = useBusToOnAndLevelAbove(busIdFrom, busIdTo);

    const onClick = useCallback(() => {
        disableOnOrLevelAbove();
    }, [disableOnOrLevelAbove]);

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className="mmc-shrink-0"
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};
