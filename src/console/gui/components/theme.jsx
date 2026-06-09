// Requirements
import {
    createContext, useContext, useEffect, useMemo,
    useState,
} from 'react';
import { Theme } from '@radix-ui/themes';
import { useSettings } from './global/settings';


// Variables
const Context = createContext({});


// Internal
const useSystemTheme = () => {
    const getCurrentTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const [systemTheme, setSystemTheme] = useState(getCurrentTheme);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = e => setSystemTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return systemTheme;
};


// Exported
export const ThemeContext = ({ children }) => {
    const [theme, setTheme] = useSettings('theme', 'dark', true);
    const [textSize, setTextSize] = useSettings('text-size', '1');
    const [receptionShortcuts, setReceptionShortcuts] = useSettings('bus-reception-shortcuts', true);
    const systemTheme = useSystemTheme();

    const themeCurrent = useMemo(() => {
        if (theme === 'system') return systemTheme;
        return theme;
    }, [theme, systemTheme]);

    const state = useMemo(() => ({
        theme,
        themeCurrent,
        setTheme,
        textSize,
        setTextSize,
        receptionShortcuts,
        setReceptionShortcuts,
    }), [theme, themeCurrent, setTheme, textSize, setTextSize, receptionShortcuts, setReceptionShortcuts]);

    useEffect(() => {
        document.body.classList.toggle('dark', themeCurrent === 'dark');
    }, [themeCurrent]);

    useEffect(() => {
        const small = textSize !== '2';
        const iconSizePx = small ? '14' : '16';
        const quickFontPx = small ? '12' : '14';
        const chartFontPx = small ? '10' : '12';
        const chartThresholdLineHeight = small ? '12' : '14';
        const knobSizePx = small ? '22' : '32';
        const meterSliderSizePx = small ? '20' : '32';
        const meterSliderTrackSizePx = small ? '22' : '32';
        const footerHeightPx = small ? '36' : '44';
        document.documentElement.style.setProperty('--mmc-icon-size', `${iconSizePx}px`);
        document.documentElement.style.setProperty('--mmc-knob-size', `${knobSizePx}px`);
        document.documentElement.style.setProperty('--mmc-meter-slider-size', `${meterSliderSizePx}px`);
        document.documentElement.style.setProperty('--mmc-meter-slider-track-size',
            `${meterSliderTrackSizePx}px`);
        document.documentElement.style.setProperty('--mmc-quick-button-font-size', `${quickFontPx}px`);
        document.documentElement.style.setProperty('--mmc-chart-font-size', `${chartFontPx}px`);
        document.documentElement.style.setProperty('--mmc-chart-threshold-line-height',
            String(chartThresholdLineHeight));
        document.documentElement.style.setProperty('--mmc-footer-height', `${footerHeightPx}px`);
        document.documentElement.dataset.mmcTextSize = textSize;
    }, [textSize]);

    return (
        <Context.Provider value={state}>
            <Theme
                appearance={themeCurrent}
                hasBackground={false}
                className={`mmc-ui-text-size-${textSize}`}
            >
                {children}
            </Theme>
        </Context.Provider>
    );
};


export const useTheme = () => {
    const {
        theme, setTheme, themeCurrent, textSize, setTextSize,
        receptionShortcuts, setReceptionShortcuts,
    } = useContext(Context);

    return {
        theme,
        setTheme,
        themeCurrent,
        textSize,
        setTextSize,
        receptionShortcuts,
        setReceptionShortcuts,
    };
};


export const useUiSize = () => {
    const { textSize, setTextSize } = useTheme();

    return useMemo(() => {
        const iconSizePx = textSize === '2' ? '16' : '14';

        const small = textSize !== '2';

        return {
            textSize,
            setTextSize,
            iconSize: iconSizePx,
            iconSpacer: { width: `${iconSizePx}px`, height: `${iconSizePx}px` },
            menuContentSize: '2',
            knobSizePx: small ? 22 : 32,
            meterSliderSizePx: small ? 20 : 32,
            meterSliderTrackSizePx: small ? 22 : 32,
            footerHeightPx: small ? 36 : 44,
        };
    }, [textSize, setTextSize]);
};
