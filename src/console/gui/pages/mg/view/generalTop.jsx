// Requirements
import { Flex } from '@radix-ui/themes';
import EditButton from './editButton';
import Mute from './mute';


// Exported
export default ({ mgId }) => (
    <Flex align="center" gapX="1" width="100%" minWidth="0" wrap="nowrap">
        <EditButton mgId={mgId} />
        <Flex flexGrow="1" minWidth="0" />
        <Mute mgId={mgId} />
    </Flex>
);
