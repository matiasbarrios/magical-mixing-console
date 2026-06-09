// Requirements
import { useMemo } from 'react';
import { useBusStereoLink, useDevice } from '@magical-mixing/mixers-react';
import {
    Button, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { Link2Icon } from '@radix-ui/react-icons';
import { ICON_STYLE } from '../../../helpers/values';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';


// Exported
export default ({ busId }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const {
        has, value, toggle, side,
    } = useBusStereoLink(busId);

    const sideShortLabel = useMemo(() => (side === 'L' ? t('Left') : t('Right')),
        [side, t]);

    const sideAriaLabel = useMemo(() => (side === 'L' ? t('Left') : t('Right')),
        [side, t]);

    const ariaLabel = value ? `${t('Stereo link')}: ${sideAriaLabel}` : t('Stereo link');
    const commonProps = {
        size: textSize,
        variant: 'soft',
        radius: 'full',
        color: value ? 'blue' : 'gray',
        disabled,
        onClick: toggle,
        'aria-label': ariaLabel,
    };

    if (!has) return null;

    if (!value) {
        return (
            <IconButton {...commonProps}>
                <Link2Icon style={ICON_STYLE} />
            </IconButton>
        );
    }

    return (
        <Button
            {...commonProps}
            className="mmc-btn-nowrap"
        >
            <Flex align="center" gapX="1" wrap="nowrap">
                <Link2Icon style={ICON_STYLE} />
                <Text size="1" wrap="nowrap">{ sideShortLabel }</Text>
            </Flex>
        </Button>
    );
};
