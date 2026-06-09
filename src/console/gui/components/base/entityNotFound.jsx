// Requirements
import {
    Callout, Container, Flex, Text,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';
import Link from './link';


// Exported
export default ({ listTo }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    return (
        <Container>
            <Flex direction="column" gap="3" py="6" align="start">
                <Callout.Root color="gray">
                    <Callout.Icon>
                        <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>
                        <Flex direction="column" gap="1">
                            <Text weight="medium">
                                { t('Not found') }
                            </Text>
                            <Text size={textSize}>
                                { t('This item was not found or is no longer available.') }
                            </Text>
                        </Flex>
                    </Callout.Text>
                </Callout.Root>
                <Link to={listTo} variant="soft" color="blue">
                    { t('Back to list') }
                </Link>
            </Flex>
        </Container>
    );
};
