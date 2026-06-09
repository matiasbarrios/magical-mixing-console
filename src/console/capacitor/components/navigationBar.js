// Requirements
import { Capacitor } from '@capacitor/core';
import { NavigationBar } from '@webnativellc/capacitor-navigation-bar';


// Exported
export const navigationBarSetColor = async ({ color, darkButtons }) => {
    if (Capacitor.getPlatform() !== 'android') return;

    await NavigationBar.setColor({ color, darkButtons });
};
