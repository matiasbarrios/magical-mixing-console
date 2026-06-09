// Requirements
import { useCallback } from 'react';
import { Switch } from '@radix-ui/themes';
import { noPointerDown } from '../../helpers/behaviour';
import { useUiSize } from '../theme';


// Exported
export default ({
    active, onClick, disabled, size: sizeProp, ...props
}) => {
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;

    const handleCheckedChange = useCallback(() => {
        onClick?.();
    }, [onClick]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Switch
            size={size}
            checked={active}
            onCheckedChange={handleCheckedChange}
            disabled={disabled}
            onPointerDown={noPointerDown}
            onClick={handleClick}
            {...props}
        />
    );
};
