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
        <Flex align="center" gapX="1" flexShrink="0">
            {polarityHas && <Polarity busId={busId} />}
            {stereoLinkHas && <StereoLink busId={busId} />}
        </Flex>
    );
};


// Exported
export default ({ busId, showQuickActions = true }) => (
    <Flex align="center" gapX="1" width="100%" minWidth="0" wrap="nowrap">
        <EditButton busId={busId} />
        <Flex align="center" flexGrow="1" gapX="1" minWidth="0" width="100%">
            <BusConfigActions busId={busId} />
            <Flex flexGrow="1" minWidth="0" width="100%">
                <Level busId={busId} minWidth="0" fullWidth />
            </Flex>
        </Flex>
        <Pan busId={busId} />
        {showQuickActions && <BusQuickActions busId={busId} />}
    </Flex>
);
