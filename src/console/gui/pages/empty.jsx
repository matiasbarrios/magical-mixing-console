// Requirements
import {
    Callout, Container, Flex, Text,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../components/language';
import { useUiSize } from '../components/theme';
import Link from '../components/base/link';


// Exported
export default () => {
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
                                { t('Page not found') }
                            </Text>
                            <Text size={textSize}>
                                { t('The page you requested does not exist.') }
                            </Text>
                        </Flex>
                    </Callout.Text>
                </Callout.Root>
                <Link to="/" variant="soft" color="blue">
                    { t('Go to home') }
                </Link>
            </Flex>
        </Container>
    );
};
