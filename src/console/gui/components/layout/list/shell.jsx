// Requirements
import { Flex } from '@radix-ui/themes';


// List route shell — filter bar, stack (see docs/gui/LAYOUT.md).
// Exported
export default ({ children }) => (
    <Flex direction="column" gapY="4" width="100%">
        {children}
    </Flex>
);
