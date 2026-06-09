// Requirements
import { useCallback, useState } from 'react';
import { DropdownMenu, Flex } from '@radix-ui/themes';
import { DropdownMenuTrigger } from '../../../base/dropdownMenuTrigger';
import { DropdownMenuContent } from '../../../base/dropdownMenuContent';


// Exported
export default ({
    color = 'gray', label, hasMenu, children,
}) => {
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!hasMenu) {
        return (
            <Flex align="center" mx="2">
                { label }
            </Flex>
        );
    }

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                size="2"
                variant="ghost"
                color={color}
                onClick={toggleOpened}
            >
                { label }
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                { children }
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
