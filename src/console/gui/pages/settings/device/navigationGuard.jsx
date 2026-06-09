// Requirements
import { useCallback, useMemo } from 'react';
import { useBlocker } from 'react-router';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useUnsavedValues } from './unsavedContext';


// Constants
const settingsRoute = '/settings/device';


// Exported
export default () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { unsavedChanges } = useUnsavedValues();

    const shouldBlock = useCallback(({ currentLocation, nextLocation }) => (
        unsavedChanges
        && currentLocation.pathname === settingsRoute
        && currentLocation.pathname !== nextLocation.pathname
    ), [unsavedChanges]);

    const blocker = useBlocker(shouldBlock);

    const open = useMemo(() => blocker.state === 'blocked', [blocker.state]);

    const onOpenChange = useCallback((nextOpen) => {
        if (!nextOpen && blocker.state === 'blocked') {
            blocker.reset();
        }
    }, [blocker]);

    const onLeave = useCallback(() => {
        if (blocker.state === 'blocked') {
            blocker.proceed();
        }
    }, [blocker]);

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>{ t('Unsaved changes') }</AlertDialog.Title>
                <AlertDialog.Description size={textSize}>
                    { t('You have unsaved changes. If you leave now, they will be lost. Are you sure?') }
                </AlertDialog.Description>
                <Flex justify="end" gapX="3" mt="4">
                    <AlertDialog.Cancel>
                        <Button size={textSize} variant="soft" color="gray">
                            { t('Cancel') }
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button size={textSize} variant="soft" color="red" onClick={onLeave}>
                            { t('Leave without saving') }
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};
