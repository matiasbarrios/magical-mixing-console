// Requirements
import { Flex, Text } from '@radix-ui/themes';


// Exported
export default ({ error, info }) => {
    if (!error && !info) return null;

    return (
        <Flex direction="column" align="center" gap="2" px="2">
            {!!error && (
                <Text size="2" color="red" align="center">
                    { error }
                </Text>
            )}
            {!!info && (
                <Text size="2" color="orange" align="center">
                    { info }
                </Text>
            )}
        </Flex>
    );
};
