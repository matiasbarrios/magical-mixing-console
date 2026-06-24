// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useBusInputId } from '@magical-mixing/mixers-react';
import {
    LabelControlTable, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { useUiSize } from '../../../../components/theme';
import { BusIconNameLinkLabeled } from '../../../bus/view/name';
import { InputSelect } from '../../../bus/view/input';


// Internal
const RowInner = ({ busId, inputId }) => {
    const { textSize } = useUiSize();
    const { has, value, get } = useBusInputId(busId);

    const isOption = useMemo(() => !!get(inputId), [get, inputId]);
    const assigned = useMemo(() => value === inputId, [value, inputId]);

    if (!has || !isOption || !assigned) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <BusIconNameLinkLabeled busId={busId} size={textSize} variant="ghost" />
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <InputSelect busId={busId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ busId, inputId }) => <RowInner busId={busId} inputId={inputId} />;
