// Requirements
import { Flex } from '@radix-ui/themes';
import { useBusOptions } from '@magical-mixing/mixers-react';
import ConditionalScrollX from '../../../../../components/base/conditionalScrollX';
import { AddBuses, BusEvaluator, ResetBuses } from '../shared';
import Column from './column';


// Internal
const EvaluateColumn = ({ busId, dcaId }) => (
    <BusEvaluator busId={busId} dcaId={dcaId}>
        {({ onHas, on, set }) => (
            <Column busId={busId} onHas={onHas} on={on} set={set} />
        )}
    </BusEvaluator>
);


const BusesStripActions = ({ dcaId }) => (
    <Flex
        direction="column"
        align="center"
        justify="center"
        gap="1"
        flexShrink="0"
        height="100%"
        px="2"
    >
        <ResetBuses dcaId={dcaId} />
        <AddBuses dcaId={dcaId} />
    </Flex>
);


// Exported
export default ({ dcaId }) => {
    const { options } = useBusOptions();

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" height="100%" gapY="3">
            <Flex position="relative" flexGrow="1" minHeight="0" width="100%">
                <ConditionalScrollX>
                    <Flex
                        gapX="1"
                        height="100%"
                        width="max-content"
                        align="stretch"
                    >
                        {options.map(o => (
                            <EvaluateColumn key={o.id} busId={o.id} dcaId={dcaId} />
                        ))}
                        <BusesStripActions dcaId={dcaId} />
                    </Flex>
                </ConditionalScrollX>
            </Flex>
        </Flex>
    );
};
