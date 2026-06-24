// Requirements
import { ScreenProvider } from '../base/screen';
import { DevicesProvider } from '../devices/context';
import { LanguageProvider } from '../language';
import { ThemeProvider } from '../theme';
import { HotkeysProvider } from '../hotkeys/context';


// Exported
export default ({ children }) => (
    <ThemeProvider>
        <HotkeysProvider>
            <LanguageProvider>
                <DevicesProvider>
                    <ScreenProvider>
                        {children}
                    </ScreenProvider>
                </DevicesProvider>
            </LanguageProvider>
        </HotkeysProvider>
    </ThemeProvider>
);
