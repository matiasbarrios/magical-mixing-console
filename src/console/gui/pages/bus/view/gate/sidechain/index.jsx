// Requirements
import {
    useBusGateSidechain,
    useBusGateSidechainOn,
} from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import Source from './source';
import Type from './type';
import Frequency from './frequency';
import On from './on';


// Exported
export default ({ busId }) => {
    const { has } = useBusGateSidechain(busId);
    const { has: onHas, value: onValue } = useBusGateSidechainOn(busId);

    const isOn = useMemo(() => has && onHas && onValue, [has, onHas, onValue]);

    if (!has || !onHas || onValue === undefined) return null;

    return (
        <>
            <On busId={busId} />
            {isOn && <Source busId={busId} />}
            {isOn && <Type busId={busId} />}
            {isOn && <Frequency busId={busId} />}
        </>
    );
};
