// Requirements
import { useCallback, useMemo } from 'react';
import { useBusInputId, useBusOptions } from '@magical-mixing/mixers-react';
import { Flex } from '@radix-ui/themes';
import { useUiSize } from '../../components/theme';
import { BusIconNameLinkLabeled } from '../bus/view/name';


// Internal
const AssignedBus = ({ busId, inputId }) => {
    const { textSize } = useUiSize();
    const { has, value, get } = useBusInputId(busId);

    const isOption = useMemo(() => !!get(inputId), [get, inputId]);
    const assigned = useMemo(() => value === inputId, [value, inputId]);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    if (!has || !isOption || !assigned) return null;

    return (
        <Flex
            flexShrink="0"
            onPointerDown={stopRowOpen}
            onClick={stopRowOpen}
        >
            <BusIconNameLinkLabeled busId={busId} size={textSize} variant="ghost" />
        </Flex>
    );
};


// Exported
export default ({ inputId }) => {
    const { options } = useBusOptions();

    return (
        <Flex align="center" gapX="1" flexShrink="0" wrap="nowrap">
            {options.map(o => (
                <AssignedBus key={o.id} busId={o.id} inputId={inputId} />
            ))}
        </Flex>
    );
};
