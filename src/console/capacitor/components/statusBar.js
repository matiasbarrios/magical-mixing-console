// Requirements
import { SystemBars, SystemBarsStyle } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';


// Internal
const systemBarsStyle = isDark => (
    isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light
);


// Exported
export const statusBarSetBackgroundColor = async (color) => {
    await StatusBar.setBackgroundColor({ color });
};


export const statusBarSetStyle = async (isDark) => {
    await SystemBars.setStyle({ style: systemBarsStyle(isDark) });
};
