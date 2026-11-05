// Requirements
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useUiSize } from '../../components/theme';
import { useReportBlocking } from './blocking';


// Internal
const rowStyle = blocking => ({
    borderRadius: 'var(--radius-2)',
    background: blocking ? 'var(--red-a3)' : undefined,
});


const CheckRow = ({
    id, label, value, detail, blocking = false, action, actionLabel, control, controlBelow = false,
}) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    useReportBlocking(id, blocking);

    return (
        <Flex direction="column" gap="1" py="2" px="2" style={rowStyle(blocking)}>
            <Flex align="center" justify="between" gap="3">
                <Flex direction="column" gap="1" minWidth="0" flexGrow="1">
                    <Text size={textSize} weight="medium">{ label }</Text>
                    {value != null && value !== '' && (
                        <Text size="1" color={blocking ? 'red' : 'gray'}>{ value }</Text>
                    )}
                </Flex>
                {!controlBelow && control}
                {action && actionLabel && (
                    <Button
                        size="1"
                        variant="soft"
                        color={blocking ? 'red' : 'gray'}
                        disabled={disabled}
                        onClick={action}
                        style={{ flexShrink: 0 }}
                    >
                        { actionLabel }
                    </Button>
                )}
            </Flex>
            {controlBelow && (
                <Box width="100%" minWidth="0">{ control }</Box>
            )}
            {detail && (
                <Text size="1" color="gray">{ detail }</Text>
            )}
        </Flex>
    );
};


// Exported
export { CheckRow };
