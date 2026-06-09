// Requirements
import { useCallback } from 'react';
import {
    Button, Dialog, Flex,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import DialogHeader from '../../components/base/dialogHeader';


// Exported
export default ({
    open, onOpenChange, name, onAccept,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const doLoad = useCallback(() => {
        onAccept();
        onOpenChange(false);
    }, [onAccept, onOpenChange]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { `${t('Load')} ${name}` }
                </DialogHeader>
                <Dialog.Description size={textSize} mb="4">
                    { t('Are you sure?') }
                </Dialog.Description>
                <Flex justify="end">
                    <Button
                        size={textSize}
                        variant="soft"
                        color="blue"
                        onClick={doLoad}
                        disabled={disabled}
                    >
                        { t('Load') }
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
