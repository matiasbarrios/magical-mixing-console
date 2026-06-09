// Requirements
import { useMemo } from 'react';
import { useFxInsertOn } from '@magical-mixing/mixers-react';
import { Flex } from '@radix-ui/themes';
import { BusSelect } from './bus';
import { FxInsert, InsertRoutingSelect } from './insert';


// Internal
const DestinationSelect = ({ fxId, controlSize = '2', inline = false }) => {
    const { has: onHas, value: onValue } = useFxInsertOn(fxId);
    const inserted = useMemo(() => onHas && onValue, [onHas, onValue]);

    if (inserted) {
        if (inline) {
            return <FxInsert fxId={fxId} controlSize={controlSize} />;
        }
        return (
            <InsertRoutingSelect fxId={fxId} controlSize={controlSize} inline={inline} />
        );
    }

    return <BusSelect fxId={fxId} controlSize={controlSize} />;
};


// Exported
export default ({
    fxId, controlSize = '2', trackStart, fullWidth, inline = false,
}) => (
    <Flex
        align="center"
        gapX="1"
        flexGrow={fullWidth ? '1' : undefined}
        minWidth="0"
        width={fullWidth ? '100%' : undefined}
    >
        { trackStart }
        <Flex flexGrow={fullWidth && !inline ? '1' : undefined} minWidth="0">
            <DestinationSelect fxId={fxId} controlSize={controlSize} inline={inline} />
        </Flex>
    </Flex>
);
