// Requirements
import { Flex } from '@radix-ui/themes';
import Mute from './mute';
import Remove from './remove';


// Exported
export default ({ mgId }) => (
    <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
        <Mute mgId={mgId} />
        <Remove mgId={mgId} />
    </Flex>
);
