// Requirements
import { useMemo } from 'react';
import { useBusCompressorAutomatic } from '@magical-mixing/mixers-react';
import Automatic from './automatic';
import Type from './type';
import Attack from './attack';
import Hold from './hold';
import Release from './release';


// Exported
export default ({ busId }) => {
    const {
        has: automaticHas,
        value: automaticValue,
    } = useBusCompressorAutomatic(busId);
    const automaticOn = useMemo(() => automaticHas && automaticValue,
        [automaticHas, automaticValue]);

    return (
        <>
            <Automatic busId={busId} />
            {!automaticOn && <Type busId={busId} />}
            {!automaticOn && <Attack busId={busId} />}
            {!automaticOn && <Hold busId={busId} />}
            {!automaticOn && <Release busId={busId} />}
        </>
    );
};
