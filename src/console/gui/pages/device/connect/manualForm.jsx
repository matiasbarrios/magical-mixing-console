// Requirements
import { motion } from 'motion/react';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';


// Exported
export default ({
    ip,
    port,
    ipError,
    portError,
    connecting,
    notFoundManually,
    onSetIP,
    onSetPort,
    onConnect,
    onEnterKey,
}) => {
    const { t } = useLanguage();

    return (
        <motion.div
            key="connect-manually"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Flex direction="column" gapY="5">
                <Flex direction="column" gapY="4">
                    <Flex direction="column" gapY="1">
                        <Text size="2" as="label" weight="medium">
                            <Text size="2">{ t('Destination') }</Text>
                            <TextField.Root
                                size="2"
                                variant="surface"
                                placeholder={t('IP address')}
                                value={ip}
                                onChange={onSetIP}
                                onKeyDown={onEnterKey}
                                disabled={connecting}
                            />
                        </Text>
                        {!!ipError && <Text size="2" color="red">{ ipError }</Text>}
                    </Flex>
                    <Flex direction="column" gapY="1">
                        <Text size="2" as="label" weight="medium">
                            <Text size="2">{ t('Port') }</Text>
                            <TextField.Root
                                size="2"
                                variant="surface"
                                placeholder={t('Port number')}
                                value={port}
                                onChange={onSetPort}
                                onKeyDown={onEnterKey}
                                disabled={connecting}
                            />
                        </Text>
                        {!!portError && <Text size="2" color="red">{ portError }</Text>}
                    </Flex>
                </Flex>
                <Flex align="center" justify="end" gapX="3">
                    {notFoundManually && <Text size="2" color="red">{ t('Not found') }</Text> }
                    <Button size="2" variant="soft" onClick={onConnect} disabled={connecting}>
                        { connecting ? t('Connecting') : '' }
                        { !connecting ? t('Connect') : '' }
                    </Button>
                </Flex>
            </Flex>
        </motion.div>
    );
};
