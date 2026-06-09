// Requirements
import { Flex } from '@radix-ui/themes';


// List pages: global actions below the list, end-aligned. Reset before add when both exist.
// Exported
export default ({ reset, add }) => {
    if (!reset && !add) return null;

    return (
        <Flex align="center" justify="end" gap="1">
            { reset }
            { add }
        </Flex>
    );
};
