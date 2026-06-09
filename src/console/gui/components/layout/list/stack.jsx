// Requirements
import { Flex } from '@radix-ui/themes';


// Entity list rows — single column stack (see docs/gui/LIST_PATTERN.md).
// Exported
export default ({ children }) => (
    <Flex direction="column" gap="3" width="100%">
        {children}
    </Flex>
);
