// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { DROPDOWN_MENU_CONTENT_SIZE } from '../../helpers/values';


// Internal
const parseInset = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};


const readSafeAreaCollisionPadding = () => {
    const style = getComputedStyle(document.documentElement);
    return {
        top: parseInset(style.getPropertyValue('--mmc-safe-top')),
        right: parseInset(style.getPropertyValue('--mmc-safe-right')),
        bottom: parseInset(style.getPropertyValue('--mmc-safe-bottom')),
        left: parseInset(style.getPropertyValue('--mmc-safe-left')),
    };
};


export const useSafeAreaCollisionPadding = () => {
    const [collisionPadding, setCollisionPadding] = useState(readSafeAreaCollisionPadding);

    useEffect(() => {
        const update = () => setCollisionPadding(readSafeAreaCollisionPadding());
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return collisionPadding;
};


// Exported
export const DropdownMenuContent = ({
    collisionPadding: collisionPaddingProp, size, children, ...props
}) => {
    const safeCollisionPadding = useSafeAreaCollisionPadding();

    return (
        <DropdownMenu.Content
            size={size ?? DROPDOWN_MENU_CONTENT_SIZE}
            collisionPadding={collisionPaddingProp ?? safeCollisionPadding}
            {...props}
        >
            {children}
        </DropdownMenu.Content>
    );
};


export const DropdownMenuSubContent = ({
    collisionPadding: collisionPaddingProp, size, children, ...props
}) => {
    const safeCollisionPadding = useSafeAreaCollisionPadding();

    return (
        <DropdownMenu.SubContent
            size={size ?? DROPDOWN_MENU_CONTENT_SIZE}
            collisionPadding={collisionPaddingProp ?? safeCollisionPadding}
            {...props}
        >
            {children}
        </DropdownMenu.SubContent>
    );
};
