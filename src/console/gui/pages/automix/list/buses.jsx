// Requirements
import { useMemo } from 'react';
import { useBusAutomix, useBusOptions } from '@magical-mixing/mixers-react';
import ListStack from '../../../components/layout/list/stack';
import BusRow from './busRow';


// Internal
const Bus = ({ element }) => {
    const busId = useMemo(() => element.id, [element.id]);
    const { has } = useBusAutomix(busId);

    if (!has) return null;

    return <BusRow busId={busId} />;
};


// Exported
export default () => {
    const { options } = useBusOptions();

    return (
        <ListStack>
            {options.map(o => (
                <Bus key={o.id} element={o} />
            ))}
        </ListStack>
    );
};
