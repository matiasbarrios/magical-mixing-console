// Requirements
import { useCallback, useState } from 'react';
import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ConditionalScrollY from '../../components/base/conditionalScrollY';
import DialogHeader from '../../components/base/dialogHeader';
import { MainSoundChecklist } from './checklist';


// Constants
const dialogStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85dvh',
};


// Internal
const TroubleshootingDialog = ({ open, onOpenChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const [topic, setTopic] = useState(null);

    const handleOpenChange = useCallback((next) => {
        if (!next) setTopic(null);
        onOpenChange(next);
    }, [onOpenChange]);

    const openMain = useCallback(() => setTopic('main'), []);

    const title = topic
        ? t("Can't get sound on Main")
        : t('Troubleshooting');

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            {open && (
                <Dialog.Content
                    aria-describedby={undefined}
                    maxWidth="560px"
                    style={dialogStyle}
                >
                    <DialogHeader mb="3">{ title }</DialogHeader>
                    <Flex direction="column" gap="3" flexGrow="1" minHeight="0">
                        {!topic && (
                            <Flex align="center" justify="between" gap="3">
                                <Text size={textSize}>{ t("Can't get sound on Main") }</Text>
                                <Button
                                    variant="soft"
                                    color="gray"
                                    size={textSize}
                                    onClick={openMain}
                                >
                                    { t('Diagnose') }
                                </Button>
                            </Flex>
                        )}
                        {topic === 'main' && (
                            <ConditionalScrollY gapY="3">
                                <MainSoundChecklist />
                            </ConditionalScrollY>
                        )}
                    </Flex>
                </Dialog.Content>
            )}
        </Dialog.Root>
    );
};


// Exported
export default TroubleshootingDialog;
