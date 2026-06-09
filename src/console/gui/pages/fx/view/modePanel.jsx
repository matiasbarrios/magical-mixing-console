// Requirements
import { useMemo } from 'react';
import { useFxInsertOn } from '@magical-mixing/mixers-react';
import Mode from './mode';
import Bus from './bus';
import Insert from './insert';
import Type from './type';


// Exported
export default ({ fxId, controlSize = '1' }) => {
    const { has: onHas, value: onValue } = useFxInsertOn(fxId);
    const inserted = useMemo(() => onHas && onValue, [onHas, onValue]);

    return (
        <>
            <Mode fxId={fxId} controlSize={controlSize} />
            {!inserted && <Bus fxId={fxId} controlSize={controlSize} />}
            {inserted && <Insert fxId={fxId} controlSize={controlSize} />}
            <Type fxId={fxId} label="Which" controlSize={controlSize} />
        </>
    );
};
