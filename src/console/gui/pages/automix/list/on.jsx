// Requirements
import { useMemo } from 'react';
import { Power } from 'lucide-react';
import { useAutomixOn, useDevice } from '@magical-mixing/mixers-react';
import { IconButton } from '@radix-ui/themes';
import { ICON_STYLE } from '../../../helpers/values';
import { useUiSize } from '../../../components/theme';


// Exported
export default ({ automixId }) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { has, value, toggle } = useAutomixOn(automixId);
    const color = useMemo(() => (value ? 'green' : 'gray'), [value]);
    if (!has) return null;
    return (
        <IconButton size={textSize} variant="soft" radius="full" color={color} disabled={disabled} onClick={toggle}>
            <Power style={ICON_STYLE} />
        </IconButton>
    );
};
