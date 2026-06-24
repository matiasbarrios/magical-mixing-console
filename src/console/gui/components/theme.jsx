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
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useSettings('theme', 'dark', true);
    const [textSize, setTextSize] = useSettings('text-size', '1');
    const [receptionShortcuts, setReceptionShortcuts] = useSettings('bus-reception-shortcuts', true);
    const [entityViewLayout, setEntityViewLayout] = useSettings('entity-view-layout', 'vertical');
    const [headerWizardWandShown, setHeaderWizardWandShown] = useSettings('header-wizard-wand-shown', true);
    const [headerNavigation, setHeaderNavigation] = useSettings('header-navigation', false);
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
        entityViewLayout,
        setEntityViewLayout,
        headerWizardWandShown,
        setHeaderWizardWandShown,
        headerNavigation,
        setHeaderNavigation,
    }), [theme, themeCurrent, setTheme, textSize, setTextSize, receptionShortcuts, setReceptionShortcuts,
        entityViewLayout, setEntityViewLayout, headerWizardWandShown, setHeaderWizardWandShown,
        headerNavigation, setHeaderNavigation]);

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
                accentColor="blue"
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
        entityViewLayout, setEntityViewLayout,
        headerWizardWandShown, setHeaderWizardWandShown,
        headerNavigation, setHeaderNavigation,
    } = useContext(Context);

    return {
        theme,
        setTheme,
        themeCurrent,
        textSize,
        setTextSize,
        receptionShortcuts,
        setReceptionShortcuts,
        entityViewLayout,
        setEntityViewLayout,
        headerWizardWandShown,
        setHeaderWizardWandShown,
        headerNavigation,
        setHeaderNavigation,
    };
};


export const useEntityViewLayout = () => {
    const { entityViewLayout, setEntityViewLayout } = useTheme();

    return useMemo(() => ({
        entityViewLayout,
        setEntityViewLayout,
        isVertical: entityViewLayout === 'vertical',
        isHorizontal: entityViewLayout === 'horizontal',
    }), [entityViewLayout, setEntityViewLayout]);
};


export const useUiSize = () => {
    const { textSize, setTextSize } = useTheme();

    return useMemo(() => {
        const iconSizePx = textSize === '2' ? '16' : '14';

        const small = textSize !== '2';

        return {
            textSize,
            setTextSize,
            subTextFontSize: small ? 'var(--mmc-chart-font-size)' : 'var(--font-size-1)',
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
