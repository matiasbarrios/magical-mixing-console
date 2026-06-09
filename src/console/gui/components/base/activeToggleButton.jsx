// Requirements
import { Button, Text } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Internal
const useToggleLabel = (active, labels) => {
    const { t } = useLanguage();

    if (labels === 'onOff') {
        return active ? t('On', 'short') : t('Off', 'short');
    }

    return active ? t('Active', 'singular') : t('Inactive', 'singular');
};


// Exported
export const ActiveToggleButton = ({
    active, onClick, disabled: disabledProp, size: sizeProp, inactiveColor = 'gray', labels = 'activeInactive',
}) => {
    const { disabled: deviceDisabled } = useDevice();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;
    const disabled = disabledProp ?? deviceDisabled;
    const label = useToggleLabel(active, labels);

    return (
        <Button
            size={size}
            variant="soft"
            color={active ? 'blue' : inactiveColor}
            onClick={onClick}
            disabled={disabled}
        >
            <Text size={size}>
                { label }
            </Text>
        </Button>
    );
};
