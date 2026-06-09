// Requirements
import { Button, Text } from '@radix-ui/themes';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';


// Constants
const buttonStyle = {
    margin: 0,
    textAlign: 'left',
};


// Exported
export default ({
    to, size, color, disabled, children, onContextMenu, variant, mx,
}) => {
    const navigate = useNavigate();

    const gotTo = useCallback((e) => {
        if (disabled) return;
        e.preventDefault();
        navigate(to);
    }, [navigate, to, disabled]);

    const linkStyleFinal = useMemo(() => ({
        textAlign: 'left',
        ...(disabled && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
    }), [disabled]);

    return (
        <>
            {!variant && (
                <div role="button" tabIndex={0} style={linkStyleFinal} onClick={gotTo} onContextMenu={onContextMenu}>
                    <Text size={size} color={color}>{children}</Text>
                </div>
            )}
            {!!variant && (
                <Button
                    size={size}
                    color={color}
                    variant={variant}
                    onClick={gotTo}
                    onContextMenu={onContextMenu}
                    style={buttonStyle}
                    disabled={disabled}
                    mx={mx}
                >
                    {children}
                </Button>
            )}
        </>
    );
};
