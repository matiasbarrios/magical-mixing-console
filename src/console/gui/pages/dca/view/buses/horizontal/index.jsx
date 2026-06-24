// Requirements
import { Flex } from '@radix-ui/themes';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { AddBuses, BusEvaluator, ResetBuses } from '../shared';
import Row from './row';


// Internal
const Evaluate = ({ busId, dcaId }) => (
    <BusEvaluator busId={busId} dcaId={dcaId}>
        {({ onHas, on, set }) => (
            <Row busId={busId} onHas={onHas} on={on} set={set} />
        )}
    </BusEvaluator>
);


// Exported
export default ({ dcaId }) => {
    const { options } = useBusOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            {options.map(o => (
                <Evaluate key={o.id} busId={o.id} dcaId={dcaId} />
            ))}
            <Flex align="center" justify="end" gap="1">
                <ResetBuses dcaId={dcaId} />
                <AddBuses dcaId={dcaId} />
            </Flex>
        </Flex>
    );
};
