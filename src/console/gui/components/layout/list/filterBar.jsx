// Requirements
import { Flex } from '@radix-ui/themes';
import ActionGroup from '../../base/actionGroup';


// Exported
export const ListFilterBar = ({ children }) => (
    <Flex align="center" justify="between" gapX="2">
        {children}
    </Flex>
);


export const ListFilterTitle = ({ children }) => (
    <Flex align="center" gapX="2" flexGrow="1" minWidth="0">
        {children}
    </Flex>
);


export const ListFilterActions = ActionGroup;
