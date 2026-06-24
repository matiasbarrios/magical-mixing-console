// Requirements
import { Flex } from '@radix-ui/themes';
import { useInputGain, useInputPhantom } from '@magical-mixing/mixers-react';
import EditButton from './editButton';
import Phantom from './phantom';
import Gain from './gain';


// Exported
export default ({ inputId }) => {
    const { has: gainHas } = useInputGain(inputId);
    const { has: phantomHas } = useInputPhantom(inputId);

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
                <EditButton inputId={inputId} />
            </Flex>
            {gainHas && (
                <Flex
                    flexGrow="1"
                    align="center"
                    justify="center"
                    minHeight="0"
                >
                    <Gain inputId={inputId} isVertical />
                </Flex>
            )}
            {phantomHas && (
                <Flex direction="column" align="center" gapY="1" flexShrink="0">
                    <Phantom inputId={inputId} />
                </Flex>
            )}
        </Flex>
    );
};
