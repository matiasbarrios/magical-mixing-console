// Requirements
import { Flex } from '@radix-ui/themes';
import { useBusPolarity, useBusStereoLink } from '@magical-mixing/mixers-react';
import Pan from './pan';
import Level from './level';
import BusQuickActions from './busActions';
import EditButton from './editButton';
import Polarity from './polarity';
import StereoLink from './stereoLink';


// Internal
const BusConfigActions = ({ busId }) => {
    const { has: polarityHas } = useBusPolarity(busId);
    const { has: stereoLinkHas } = useBusStereoLink(busId);

    if (!polarityHas && !stereoLinkHas) return null;

    return (
        <Flex direction="column" align="center" justify="center" gapY="1" flexShrink="0">
            {polarityHas && <Polarity busId={busId} />}
            {stereoLinkHas && <StereoLink busId={busId} />}
        </Flex>
    );
};


// Exported
export default ({ busId }) => (
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
            <EditButton busId={busId} />
        </Flex>
        <BusConfigActions busId={busId} />
        <Flex
            flexGrow="1"
            align="center"
            justify="center"
            minHeight="0"
        >
            <Level busId={busId} isVertical />
        </Flex>
        <Flex direction="column" align="center" gapY="1" flexShrink="0">
            <Pan busId={busId} />
            <BusQuickActions busId={busId} stacked />
        </Flex>
    </Flex>
);
