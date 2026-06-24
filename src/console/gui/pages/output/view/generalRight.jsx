// Requirements
import { Flex } from '@radix-ui/themes';
import { useOutputVolume } from '@magical-mixing/mixers-react';
import Volume from './volume';


// Exported
export default ({ outputId }) => {
    const { has: volumeHas } = useOutputVolume(outputId);

    if (!volumeHas) return null;

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
            <Flex
                flexGrow="1"
                align="center"
                justify="center"
                minHeight="0"
            >
                <Volume outputId={outputId} isVertical />
            </Flex>
        </Flex>
    );
};
