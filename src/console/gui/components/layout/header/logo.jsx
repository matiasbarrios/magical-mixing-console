// Requirements
import { useCallback } from 'react';
import logo from '../../../static/logo.svg';
import { resetFocusForHotkeys } from '../../../helpers/hotkeys/guards';
import { useNavigateHome } from './useNavigateHome';


// Constants
const logoStyle = {
    width: '32px',
    height: '32px',
};


// Exported
export const Logo = () => {
    const navigateHome = useNavigateHome();

    const onClick = useCallback(() => {
        navigateHome();
        requestAnimationFrame(resetFocusForHotkeys);
    }, [navigateHome]);

    return (
        <div role="button" tabIndex="0" onClick={onClick} style={logoStyle}>
            <img src={logo} alt="Logo" style={logoStyle} />
        </div>
    );
};
