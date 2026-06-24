// Requirements
import { motion } from 'motion/react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';


// Exported
export default () => {
    const { t } = useLanguage();

    return (
        <motion.div
            key="waiting-for-network"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Flex align="center" justify="between" gapX="2">
                <Text size="2">{ t('Waiting for a network connection') }</Text>
                <Spinner />
            </Flex>
        </motion.div>
    );
};
