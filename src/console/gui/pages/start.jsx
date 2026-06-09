// Requirements
import { Navigate } from 'react-router';
import { useBusFromOptions, useBusOptions } from '@magical-mixing/mixers-react';
import { buildBusPath } from './bus/view/useBusViewTab';


// Exported
export default () => {
    const { mainOne } = useBusOptions();
    const { options: fromOptions } = useBusFromOptions(mainOne?.id);
    if (mainOne) {
        if (fromOptions.length > 0) {
            return <Navigate to={buildBusPath(mainOne.id, 'from')} replace />;
        }
        return <Navigate to={buildBusPath(mainOne.id)} replace />;
    }
    return <Navigate to="/" replace />;
};
