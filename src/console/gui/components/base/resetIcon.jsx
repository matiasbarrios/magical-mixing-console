// Requirements
import { ReloadIcon } from '@radix-ui/react-icons';
import { ICON_STYLE } from '../../helpers/values';


// Exported
export default ({ style, ...props }) => (
    <ReloadIcon
        style={{ ...ICON_STYLE, transform: 'scaleX(-1)', ...style }}
        {...props}
    />
);
