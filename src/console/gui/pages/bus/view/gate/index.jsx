// Requirements
import { Flex } from '@radix-ui/themes';
import { useBusGate } from '@magical-mixing/mixers-react';
import { GATE_INPUTS_WIDTH } from '../../../../helpers/values';
import Envelope from './envelope';
import Sidechain from './sidechain';
import Options from './options';
import Parameters from './parameters';
import {
    PaginationContents, PaginationContext, PaginationNext, PaginationPrevious,
} from './pagination';
import Chart from './chart';


// Internal
const Gate = ({ busId }) => (
    <Flex direction="column" flexGrow="1" minHeight="0" height="100%" gapY="2">
        <Flex align="stretch" gapX="3" flexGrow="1" minHeight="0">
            <Flex direction="column" align="stretch" gapY="2" flexGrow="1" minHeight="0">
                <Flex align="center" justify="center" flexGrow="1" width="100%" minHeight="0">
                    <Chart busId={busId} />
                </Flex>
            </Flex>
            <Flex
                direction="column"
                align="center"
                gapY="2"
                width={GATE_INPUTS_WIDTH}
                maxWidth={GATE_INPUTS_WIDTH}
                minHeight="296px"
                pt="1"
                flexShrink="0"
            >
                <Flex gap="2" flexShrink="0" py="2">
                    <PaginationPrevious />
                    <PaginationNext />
                </Flex>
                <Flex direction="column" align="center" gapY="3" width="100%">
                    <PaginationContents tab="Parameters">
                        <Parameters busId={busId} />
                    </PaginationContents>
                    <PaginationContents tab="Envelope">
                        <Envelope busId={busId} />
                    </PaginationContents>
                    <PaginationContents tab="Sidechain">
                        <Sidechain busId={busId} />
                    </PaginationContents>
                </Flex>
            </Flex>
        </Flex>
        <Flex align="start" flexShrink="0" py="1" width="100%" overflow="visible">
            <Options busId={busId} />
        </Flex>
    </Flex>
);


// Exported
export default ({ busId }) => {
    const { has } = useBusGate(busId);
    if (!has) return null;
    return (
        <PaginationContext busId={busId}>
            <Gate busId={busId} />
        </PaginationContext>
    );
};
