// Requirements
import { Button, DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { noPointerDown } from '../../helpers/behaviour';
import { useUiSize } from '../theme';


// Constants
const buttonStyle = {
    height: 'auto',
    minHeight: 'var(--base-button-height)',
    fontWeight: 'var(--font-weight-regular)',
};


// Exported
export const DropdownMenuTrigger = ({
    size: sizeProp, variant = 'ghost', radius, color = 'gray', onClick, style, children, square, maxWidth,
    className,
    ...rest
}) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;

    const classNameFinal = useMemo(() => (
        ['mmc-dropdown-menu-trigger', className].filter(Boolean).join(' ')
    ), [className]);

    const buttonStyleFinal = useMemo(() => ({
        ...(size !== '1' ? buttonStyle : {}),
        ...(variant === 'ghost' && { margin: 0 }),
        ...(!!maxWidth && { maxWidth, minWidth: maxWidth, wordBreak: 'break-all' }),
        ...(style || {}),
    }), [style, maxWidth, size, variant]);

    return (
        <>
            {!square && (
                <DropdownMenu.Trigger asChild>
                    <IconButton size={size} variant={variant} radius={radius || 'full'} color={color || 'gray'} disabled={disabled} data-disabled={disabled ? 'true' : undefined} className={classNameFinal} onPointerDown={noPointerDown} onClick={onClick} style={style || undefined} {...rest}>
                        {children}
                    </IconButton>
                </DropdownMenu.Trigger>
            )}
            {square && (
                <DropdownMenu.Trigger asChild>
                    <Button size={size} variant={variant} radius={radius || 'medium'} color={color} disabled={disabled} data-disabled={disabled ? 'true' : undefined} className={classNameFinal} onPointerDown={noPointerDown} onClick={onClick} style={buttonStyleFinal} {...rest}>
                        {children}
                    </Button>
                </DropdownMenu.Trigger>
            )}
        </>
    );
};
