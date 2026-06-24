// Requirements
import { Navigate } from 'react-router';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { buildBusPath } from './bus/view/useBusViewTab';


// Exported
export default () => {
    const { mainOne } = useBusOptions();
    if (mainOne) {
        return <Navigate to={buildBusPath(mainOne.id, 'from')} replace />;
    }
    return <Navigate to="/" replace />;
};
