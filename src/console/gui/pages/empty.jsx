// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../components/language';
import Link from '../components/base/link';


// Exported
export default () => {
    const { t } = useLanguage();

    return (
        <Flex direction="column" align="center" justify="center" gap="3" py="9">
            <Text size="2" color="gray" align="center">
                { t('The page you requested does not exist.') }
            </Text>
            <Link to="/" variant="soft" color="blue">
                { t('Go to home') }
            </Link>
        </Flex>
    );
};
