// Requirements
import { Flex } from '@radix-ui/themes';
import EditButton from './editButton';
import Mute from './mute';


// Exported
export default ({ mgId }) => (
    <Flex
        direction="column"
        align="center"
        gapY="1"
        flexShrink="0"
        height="100%"
        minHeight="0"
        ml="4"
        pl="4"
        style={{ borderLeft: '1px solid var(--gray-a4)' }}
    >
        <Flex direction="column" align="center" justify="center">
            <EditButton mgId={mgId} />
        </Flex>
        <Flex flexGrow="1" minHeight="0" />
        <Flex direction="column" align="center" gapY="1" flexShrink="0">
            <Mute mgId={mgId} />
        </Flex>
    </Flex>
);
