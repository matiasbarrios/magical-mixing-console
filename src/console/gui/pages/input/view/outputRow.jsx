// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useOutputSource } from '@magical-mixing/mixers-react';
import {
    LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import ViewOutput from '../../output/view/openOutput';
import { TapViewSelect } from '../../output/view/tap';


// Internal
const OutputRowInner = ({ outputId, inputId }) => {
    const {
        has, value, options,
    } = useOutputSource(outputId);

    const sourceOption = useMemo(() => options
        .find(o => o.type === 'input' && o.externalId === inputId), [options, inputId]);

    const assigned = useMemo(() => {
        if (!sourceOption || value === undefined) return false;
        return value === sourceOption.id;
    }, [sourceOption, value]);

    if (!has || !sourceOption || !assigned) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <ViewOutput outputId={outputId} mx="0" />
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <TapViewSelect outputId={outputId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ outputId, inputId }) => (
    <OutputRowInner outputId={outputId} inputId={inputId} />
);
