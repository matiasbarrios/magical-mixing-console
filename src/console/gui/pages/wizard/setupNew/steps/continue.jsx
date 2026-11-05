// Requirements
import { Button, Flex, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';


// Exported
export default ({
    name, disabled, onChannel, onMonitor,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const prompt = useMemo(() => name ? `${name}. ${t('What next?')}` : t('What next?'), [name, t]);

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray" wrap="pretty">
                { prompt }
            </Text>
            <Button
                size={textSize}
                variant="outline"
                color="gray"
                onClick={onChannel}
                disabled={disabled}
                style={{ width: '100%' }}
            >
                { t('Set up another channel') }
            </Button>
            <Button
                size={textSize}
                variant="outline"
                color="gray"
                onClick={onMonitor}
                disabled={disabled}
                style={{ width: '100%' }}
            >
                { t('Set up a monitor') }
            </Button>
        </Flex>
    );
};
