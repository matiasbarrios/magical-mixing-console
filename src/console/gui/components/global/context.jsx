// Requirements
import { DevicesContext } from '../devices/context';
import { LanguageContext } from '../language';
import { ThemeContext } from '../theme';
import { GlobalCalloutContext } from './callout';


// Exported
export default ({ children }) => (
    <ThemeContext>
        <LanguageContext>
            <GlobalCalloutContext>
                <DevicesContext>
                    {children}
                </DevicesContext>
            </GlobalCalloutContext>
        </LanguageContext>
    </ThemeContext>
);
