// Requirements
import { Circle, CircleSlash2 } from 'lucide-react';
import { useBusPolarity, useDevice } from '@magical-mixing/mixers-react';
import { IconButton } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { ICON_STYLE } from '../../../helpers/values';


// Exported
export default ({ busId }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { has, value, toggle } = useBusPolarity(busId);

    if (!has) return null;

    return (
        <IconButton
            size={textSize}
            variant="soft"
            radius="full"
            color={value ? 'green' : 'gray'}
            disabled={disabled}
            onClick={toggle}
            aria-label={t('Polarity')}
        >
            {value
                ? <CircleSlash2 style={ICON_STYLE} />
                : <Circle style={ICON_STYLE} />}
        </IconButton>
    );
};
