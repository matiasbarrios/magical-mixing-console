// Requirements
import { Box, Flex, Link, Text } from '@radix-ui/themes';
import { GitHubLogoIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../../../components/language';
import { useScreen } from '../../../components/base/screen';


// Exported
export default () => {
    const { t } = useLanguage();
    const { isXSLandscape } = useScreen();

    return (
        <Box
            style={{
                position: 'fixed',
                bottom: 'var(--mmc-safe-bottom)',
                left: 'var(--mmc-safe-left)',
                right: 'var(--mmc-safe-right)',
                textAlign: 'center',
            }}
            mb="4"
            px="3"
        >
            <Flex direction="column" align="center" gapY="2">
                <Flex
                    direction={isXSLandscape ? 'row' : 'column'}
                    align="center"
                    justify="center"
                    gapX={isXSLandscape ? '2' : undefined}
                    gapY={isXSLandscape ? undefined : '1'}
                >
                    <Link
                        href="https://github.com/matiasbarrios/magical-mixing-console"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubLogoIcon style={{ color: 'var(--gray-12)', width: '32px', height: '32px', flexShrink: 0 }} />
                    </Link>
                    <Flex align="center" justify="center" gapX="1">
                        <Text size="2">
                            { t('This is an open source project made with') }
                        </Text>
                        <HeartFilledIcon style={{ width: '14px', height: '14px', color: 'var(--red-9)', flexShrink: 0 }} />
                        <Text size="2">
                            <Link
                                href="https://github.com/matiasbarrios/magical-mixing-console"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                { t('Join it') }
                            </Link>
                        </Text>
                    </Flex>
                </Flex>
                <Text size="1">
                    { t('By using this software, you agree to our') }
                    {' '}
                    <Link href="https://magicalmixingconsole.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                        { t('Privacy Policy') }
                    </Link>
                    {' '}
                    { t('and') }
                    {' '}
                    <Link href="https://magicalmixingconsole.com/terms-of-use" target="_blank" rel="noopener noreferrer">
                        { t('Terms of Use') }
                    </Link>
                    .
                </Text>
            </Flex>
        </Box>
    );
};
