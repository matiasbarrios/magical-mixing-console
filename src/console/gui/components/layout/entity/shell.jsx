// Requirements
import { Flex } from '@radix-ui/themes';
import { entityViewShellStyle, useEntityViewHeight } from './useViewHeight';


// Entity detail route shell — full viewport height below header (see docs/gui/LAYOUT.md).
// Exported
export default ({ children, layoutPaddingY }) => {
    const viewHeight = useEntityViewHeight(layoutPaddingY);

    return (
        <Flex
            direction="column"
            minHeight="0"
            style={entityViewShellStyle(viewHeight)}
        >
            {children}
        </Flex>
    );
};
