// Requirements
import { AlertDialog, Flex, Button } from '@radix-ui/themes';
import { useCallback, useMemo, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Exported
export const Alert = ({
    onAccept, children, title, description, cancel, accept, color = 'red',
}) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);
    const doOpen = useCallback((e) => {
        e.preventDefault();
        setOpen(true);
    }, []);

    const titleLabel = useMemo(() => title || t('Confirm'), [t, title]);
    const descriptionLabel = useMemo(() => description || t('Are you sure? This cannot be undone.'), [t, description]);
    const cancelLabel = useMemo(() => cancel || t('Cancel'), [t, cancel]);
    const acceptLabel = useMemo(() => accept || t('Confirm'), [t, accept]);

    return (
        <>
            <AlertDialog.Root open={open} onOpenChange={onClose}>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>{ titleLabel }</AlertDialog.Title>
                    <AlertDialog.Description size={textSize}>
                        { descriptionLabel }
                    </AlertDialog.Description>
                    <Flex justify="end" gapX="3" mt="4">
                        <AlertDialog.Cancel>
                            <Button size={textSize} variant="soft" color="gray">
                                { cancelLabel }
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button size={textSize} variant="soft" color={color} onClick={onAccept} disabled={disabled}>
                                { acceptLabel }
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
            { children(doOpen) }
        </>
    );
};
