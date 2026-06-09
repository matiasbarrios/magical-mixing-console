// Requirements
import { useCallback } from 'react';
import {
    Button, Dialog, Separator, Text,
} from '@radix-ui/themes';
import {
    useDevice, useInputBusAssignmentsReset, useInputName, useOutputResetAllWithSource,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { Alert } from '../../../components/base/alert';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { NameEdit, useInputNameTranslated } from './name';


// Internal
const UnassignAllInner = ({ inputId, onReset }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset: resetBuses } = useInputBusAssignmentsReset(inputId);
    const { reset: resetOutputs } = useOutputResetAllWithSource('input', inputId);

    const doUnassign = useCallback(async () => {
        await resetBuses();
        await resetOutputs();
        onReset();
    }, [resetBuses, resetOutputs, onReset]);

    return (
        <Alert
            onAccept={doUnassign}
            accept={t('Unassign all')}
            title={t('Unassign all assignments?')}
            description={t('Removes all bus and output assignments from this input. This cannot be undone.')}
        >
            {doOpen => (
                <Button size={textSize} variant="ghost" color="red" onClick={doOpen} disabled={disabled}>
                    { t('Unassign all') }
                </Button>
            )}
        </Alert>
    );
};


// Exported
export const useInputEdit = (inputId) => {
    const { has: hasName } = useInputName(inputId);
    return { has: hasName };
};


export default ({ inputId, open, onOpenChange }) => {
    const { name } = useInputNameTranslated(inputId);

    const dialogClose = useCallback(() => { onOpenChange(false); }, [onOpenChange]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    <Text>{ name }</Text>
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <NameEdit inputId={inputId} onEnter={dialogClose} />
                </LabelControlTable.List>
                <Separator size="4" my="4" />
                <UnassignAllInner inputId={inputId} onReset={dialogClose} />
            </Dialog.Content>
        </Dialog.Root>
    );
};
