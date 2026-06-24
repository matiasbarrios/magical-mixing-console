// Requirements
import { Flex } from '@radix-ui/themes';
import { useDcaLevel } from '@magical-mixing/mixers-react';
import EditButton from './editButton';
import Level from './level';
import DcaQuickActions from './dcaActions';


// Exported
export default ({ dcaId }) => {
    const { has: levelHas } = useDcaLevel(dcaId);

    return (
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
                <EditButton dcaId={dcaId} />
            </Flex>
            {levelHas && (
                <Flex
                    flexGrow="1"
                    align="center"
                    justify="center"
                    minHeight="0"
                >
                    <Level dcaId={dcaId} isVertical />
                </Flex>
            )}
            <Flex direction="column" align="center" gapY="1" flexShrink="0">
                <DcaQuickActions dcaId={dcaId} stacked />
            </Flex>
        </Flex>
    );
};
