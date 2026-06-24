// Requirements
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isMobile, platformGet } from '../../platform';
import { useTheme } from '../theme';


// Exported
export default ({ children }) => {
    const { themeCurrent } = useTheme();
    const navigate = useNavigate();

    // Colors settings
    useEffect(() => {
        if (themeCurrent === undefined) return;

        const className = 'dark';
        const bodyClass = window.document.body.classList;
        if (themeCurrent === 'dark') bodyClass.add(className);
        if (themeCurrent !== 'dark') bodyClass.remove(className);

        // For mobile app
        if (isMobile) {
            // Strange bug: it does not set it immediately. Retry 5 times!
            const applyColorsToBar = async (tries = 0) => {
                if (tries > 5) return;

                await platformGet().statusBarSetBackgroundColor(themeCurrent === 'dark' ? '#0a0f1a' : '#f8f9fb');
                await platformGet().statusBarSetStyle(themeCurrent === 'dark');
                await platformGet().navigationBarSetColor({
                    color: themeCurrent === 'dark' ? '#1a1f2b' : '#ffffff',
                    darkButtons: true,
                });

                setTimeout(async () => applyColorsToBar(tries + 1), 200);
            };
            applyColorsToBar();
        }
    }, [themeCurrent]);

    // Back button on desktop
    useEffect(() => {
        if (isMobile) return () => {};

        const handleKeyDown = (e) => {
            const { activeElement } = document;
            const isTextInput = ['INPUT', 'TEXTAREA'].includes(activeElement?.tagName) || activeElement?.isContentEditable;
            if (!isTextInput && e.key === 'Backspace') {
                e.preventDefault();
                navigate(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    return children;
};
