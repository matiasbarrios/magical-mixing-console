// Requirements
import { Flex } from '@radix-ui/themes';
import Solo from './solo';
import Mute from './mute';
import Remove from './remove';


// Exported
export default ({ dcaId, stacked = false }) => (
    <Flex
        direction={stacked ? 'column' : 'row'}
        align="center"
        gap={stacked ? '1' : undefined}
        gapX={stacked ? undefined : '1'}
        flexShrink="0"
    >
        <Solo dcaId={dcaId} />
        <Mute dcaId={dcaId} />
        <Remove dcaId={dcaId} />
    </Flex>
);
