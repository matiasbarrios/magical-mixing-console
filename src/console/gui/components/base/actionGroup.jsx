// Requirements
import { Children } from 'react';
import { Flex } from '@radix-ui/themes';


// End-aligned action slot (list filter row, header toolbar, etc.).
// Exported
export default ({ children }) => {
    if (!Children.toArray(children).length) return null;

    return (
        <Flex align="center" gapX="4" justify="end" flexShrink="0">
            {children}
        </Flex>
    );
};
