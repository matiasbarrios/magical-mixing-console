// Requirements
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, useNavigationType } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { isMobile, platformGet } from '../../platform';
import { useLanguage } from '../language';


// Variables
const mobileBackbuttonEvents = new EventTarget();


// Exported
export const useHaptics = () => {
    const hapticsTrigger = useCallback(async () => {
        if (!isMobile) return;
        await platformGet().triggerHaptic();
    }, []);

    return { hapticsTrigger };
};


export const MobileOfflineHaptics = ({ children }) => {
    const { disabled } = useDevice();
    const { hapticsTrigger } = useHaptics();

    useEffect(() => {
        if (disabled) {
            hapticsTrigger();
        }
    }, [disabled, hapticsTrigger]);

    return children;
};


export const MobileBack = ({ children }) => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [navigationHistory, setNavigationHistory] = useState([]);
    const [suggestionShown, setSuggestionShown] = useState(false);

    useEffect(() => {
        if (!isMobile) return;

        setNavigationHistory((prevHistory) => {
            if (navigationType === 'POP') {
                return prevHistory.slice(0, -1);
            } if (navigationType === 'PUSH') {
                return [...prevHistory, location.pathname];
            } if (navigationType === 'REPLACE') {
                return [...prevHistory.slice(0, -1), location.pathname];
            }
            return prevHistory;
        });

        setSuggestionShown(false);
    }, [location.key, navigationType, location.pathname]);

    useEffect(() => {
        if (!isMobile) return () => {};

        const backButtonPressed = () => {
            if (location.pathname === '/device/connect') {
                setTimeout(platformGet().appExit);
            } else if (navigationHistory.length === 1) {
                if (!suggestionShown) {
                    platformGet().toastShow(t('Press back again to exit'));
                    setSuggestionShown(true);
                } else {
                    setTimeout(platformGet().appExit);
                }
            } else {
                navigate(-1);
            }
        };

        mobileBackbuttonEvents.addEventListener('mobileBackButtnPressed', backButtonPressed);

        return () => {
            mobileBackbuttonEvents.removeEventListener('mobileBackButtnPressed', backButtonPressed);
        };
    }, [navigate, location.pathname, suggestionShown, t, navigationHistory]);


    useEffect(() => {
        if (!isMobile) return () => {};
        let handler = null;
        const add = async () => {
            handler = await platformGet().onAppBackButton(() => {
                mobileBackbuttonEvents.dispatchEvent(new CustomEvent('mobileBackButtnPressed'));
            });
        };
        add();
        return () => {
            if (handler) handler.remove();
        };
    }, []);

    return children;
};
