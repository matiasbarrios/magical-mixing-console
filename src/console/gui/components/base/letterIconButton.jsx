// Requirements
import { IconButton, Text } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useCallback, useMemo } from 'react';
import { QUICK_LETTER_LABEL_STYLE } from '../../helpers/values';
import { useUiSize } from '../theme';


// Internal
const useLabelTextStyle = (letter, dense, textStyle, textSize) => useMemo(() => {
    const len = letter?.length ?? 0;
    const base = { lineHeight: 1, whiteSpace: 'nowrap' };

    if (textStyle) return { ...base, ...textStyle };
    if (len <= 1) return base;

    const large = textSize === '2';
    let fontSize;
    if (len >= 3) {
        if (dense) {
            fontSize = large ? '9px' : '8px';
        } else {
            fontSize = large ? '10px' : '9px';
        }
    } else if (dense) {
        fontSize = large ? '10px' : '9px';
    } else {
        fontSize = large ? '11px' : '10px';
    }

    return { ...base, fontSize };
}, [letter, dense, textStyle, textSize]);


// Exported
export const LetterIconButtonLabel = ({
    letter, textSize: textSizeProp, dense = false, textStyle,
}) => {
    const { textSize: uiTextSize } = useUiSize();
    const textSize = textSizeProp ?? uiTextSize;
    const style = useLabelTextStyle(letter, dense, textStyle, textSize);

    return (
        <Text size={textSize} style={style} wrap="nowrap">
            { letter }
        </Text>
    );
};


export const LetterIconButton = ({
    letter,
    color = 'gray',
    onClick,
    disabled: disabledProp,
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    dense = false,
    stopPropagation = false,
    focusRoam,
    textSize: textSizeProp,
    textStyle,
    style: styleProp,
    ...rest
}) => {
    const { disabled: deviceDisabled } = useDevice();
    const { textSize: uiTextSize } = useUiSize();
    const textSize = textSizeProp ?? uiTextSize;

    const disabled = disabledProp ?? deviceDisabled;

    const labelTextStyle = useMemo(() => ({
        ...(dense ? QUICK_LETTER_LABEL_STYLE : {}),
        ...(textStyle || {}),
    }), [dense, textStyle]);

    const handleClick = useCallback((e) => {
        if (stopPropagation) e.stopPropagation();
        onClick?.(e);
    }, [onClick, stopPropagation]);

    return (
        <IconButton
            size={textSize}
            variant="soft"
            radius="full"
            color={color}
            disabled={disabled}
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            {...(focusRoam ? { 'data-focus-roam': focusRoam } : {})}
            style={styleProp || undefined}
            {...rest}
        >
            <LetterIconButtonLabel
                letter={letter}
                textSize={textSize}
                dense={dense}
                textStyle={labelTextStyle}
            />
        </IconButton>
    );
};
