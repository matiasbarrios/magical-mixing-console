// Requirements
import { BusLayoutPrompt } from './busLayout';


// Exported
export const BootstrapProvider = ({ children }) => (
    <>
        {children}
        <BusLayoutPrompt />
    </>
);
