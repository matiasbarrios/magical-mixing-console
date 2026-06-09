// Requirements
import { hasCall } from '../../helpers/feature';


// Exported
export const configurationReset = (configuration) => {
    hasCall(configuration, [], configuration.reset);
};
