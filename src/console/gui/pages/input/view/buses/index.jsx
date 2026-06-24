// Requirements
import { Flex } from '@radix-ui/themes';
import { useBusOptions } from '@magical-mixing/mixers-react';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../../components/base/labelControlTable';
import { AddBuses, BusEvaluator, ResetAssignments } from './shared';
import Row from './row';


// Internal
const Evaluate = ({ busId, inputId }) => (
    <BusEvaluator busId={busId} inputId={inputId}>
        <Row busId={busId} inputId={inputId} />
    </BusEvaluator>
);


// Exported
export default ({ inputId }) => {
    const { options } = useBusOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {options.map(o => (
                    <Evaluate key={o.id} busId={o.id} inputId={inputId} />
                ))}
            </LabelControlTable.List>
            <Flex align="center" justify="end" gap="1">
                <ResetAssignments inputId={inputId} />
                <AddBuses inputId={inputId} />
            </Flex>
        </Flex>
    );
};
