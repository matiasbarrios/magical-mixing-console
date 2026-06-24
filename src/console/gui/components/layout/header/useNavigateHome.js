// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { buildBusPath } from '../../../pages/bus/view/useBusViewTab';


// Exported
export const useNavigateHome = () => {
    const navigate = useNavigate();
    const { mainOne } = useBusOptions();

    return useCallback(() => {
        if (!mainOne) {
            navigate('/');
            return;
        }
        navigate(buildBusPath(mainOne.id, 'from'));
    }, [mainOne, navigate]);
};
