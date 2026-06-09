// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useBusFromOptions, useBusOptions } from '@magical-mixing/mixers-react';
import { buildBusPath } from '../../../pages/bus/view/useBusViewTab';
import logo from '../../../static/logo.svg';


// Constants
const logoStyle = {
    width: '32px',
    height: '32px',
};


// Exported
export const Logo = () => {
    const navigate = useNavigate();
    const { mainOne } = useBusOptions();
    const { options: fromOptions } = useBusFromOptions(mainOne?.id);
    const onClick = useCallback(() => {
        if (!mainOne) {
            navigate('/');
            return;
        }
        if (fromOptions.length > 0) {
            navigate(buildBusPath(mainOne.id, 'from'));
            return;
        }
        navigate(buildBusPath(mainOne.id));
    }, [mainOne, fromOptions.length, navigate]);

    return (
        <div role="button" tabIndex="0" onClick={onClick} style={logoStyle}>
            <img src={logo} alt="Logo" style={logoStyle} />
        </div>
    );
};
