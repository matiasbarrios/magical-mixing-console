// Requirements
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import Avatar from '../../../components/devices/avatar';


// Exported
export default ({
    foundVisible,
    devicesHas,
    onConnect,
}) => {
    const { t } = useLanguage();

    return (
        <Flex direction="column" align="stretch" gapY="4">
            <AnimatePresence mode="sync">
                {foundVisible.map(d => (
                    <motion.div
                        key={`${d.ip}:${d.port}`}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Flex align="center" justify="between" gapX="6">
                            <Flex align="center" gapX="3">
                                <Avatar
                                    model={d.model}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-2)',
                                        width: '56px',
                                        height: '56px',
                                    }}
                                />
                                <Box>
                                    <Text size="2" as="div" truncate>
                                        { `${d.brand} ${d.model}` }
                                    </Text>
                                    <Text size="2" as="div" color="gray" truncate>
                                        {`${d.ip} | ${d.name}`}
                                    </Text>
                                </Box>
                            </Flex>
                            <Box>
                                <Button
                                    size="2"
                                    variant="soft"
                                    data-mmc-device-endpoint={`${d.ip}:${d.port}`}
                                    onClick={() => onConnect(d)}
                                    disabled={devicesHas(d.ip, d.port)}
                                >
                                    { devicesHas(d.ip, d.port) ? t('Connected') : t('Connect') }
                                </Button>
                            </Box>
                        </Flex>
                    </motion.div>
                ))}
            </AnimatePresence>
        </Flex>
    );
};
