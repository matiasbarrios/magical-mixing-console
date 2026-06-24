// Requirements
import { useCallback } from 'react';
import { IconButton } from '@radix-ui/themes';
import { useUiSize } from '../../../../../components/theme';


// Constants
const MINI_PREVIEW_FONT_SIZE_PX = 11;

const MINI_PREVIEW_CHART_STYLE = {
    position: 'absolute',
    inset: 0,
};

const MINI_PREVIEW_LABEL_STYLE = {
    fontSize: `${MINI_PREVIEW_FONT_SIZE_PX}px`,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
};


// Exported
export { MINI_PREVIEW_CHART_STYLE };


export const MiniPreviewPlaceholder = () => {
    const { textSize } = useUiSize();

    return (
        <IconButton
            size={textSize}
            variant="soft"
            radius="large"
            color="gray"
            disabled
            aria-hidden
            tabIndex={-1}
            style={{
                padding: 0,
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                pointerEvents: 'none',
            }}
        />
    );
};


export const MiniPreviewContainer = ({
    children,
    'aria-label': ariaLabel,
    onClick,
    opacity = 1,
    disabled = false,
    label,
    focusRoam,
}) => {
    const { textSize } = useUiSize();

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        onClick?.(e);
    }, [onClick]);

    const handlePointerDown = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <IconButton
            size={textSize}
            variant="soft"
            radius="large"
            color="gray"
            disabled={disabled}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            aria-label={ariaLabel}
            {...(focusRoam ? { 'data-focus-roam': focusRoam } : {})}
            style={{
                padding: 0,
                overflow: 'hidden',
                opacity,
                flexShrink: 0,
                position: 'relative',
            }}
        >
            {label !== undefined ? (
                <span style={MINI_PREVIEW_LABEL_STYLE}>{ label }</span>
            ) : children}
        </IconButton>
    );
};
