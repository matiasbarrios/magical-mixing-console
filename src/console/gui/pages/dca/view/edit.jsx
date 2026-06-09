// Requirements
import { useCallback } from 'react';
import {
    Button, Dialog, Separator, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { FallbackBusDcaUnassignAllOf, FallbackDcaName } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { Alert } from '../../../components/base/alert';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { NameEdit } from './name';
import { ColorSelect } from './color';
import { IconSelect } from './icon';


// Internal
const UnassignAllBusesInner = ({ unassignAllOf, onReset }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const doUnassign = useCallback(() => {
        unassignAllOf();
        onReset();
    }, [unassignAllOf, onReset]);

    return (
        <Alert
            onAccept={doUnassign}
            accept={t('Unassign all')}
            title={t('Unassign all buses?')}
            description={t('Removes all bus assignments from this DCA. This cannot be undone.')}
        >
            {doOpen => (
                <Button size={textSize} variant="ghost" color="red" onClick={doOpen} disabled={disabled}>
                    { t('Unassign all') }
                </Button>
            )}
        </Alert>
    );
};


const UnassignAllBuses = ({ dcaId, onReset }) => (
    <FallbackBusDcaUnassignAllOf dcaId={dcaId}>
        {({ unassignAllOf }) => (
            <UnassignAllBusesInner unassignAllOf={unassignAllOf} onReset={onReset} />
        )}
    </FallbackBusDcaUnassignAllOf>
);


const DcaEditDialog = ({
    dcaId, open, onOpenChange, has, value, set, defaultName,
}) => {
    const { t } = useLanguage();

    const dialogClose = useCallback(() => { onOpenChange(false); }, [onOpenChange]);

    const onIconSelected = useCallback((newIcon, oldIcon) => {
        if (value && value !== t(oldIcon?.name)) return;
        if (has) set(t(newIcon.name));
    }, [has, value, set, t]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    <Text>{ defaultName }</Text>
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <IconSelect dcaId={dcaId} onSelected={onIconSelected} />
                    <ColorSelect dcaId={dcaId} />
                    <NameEdit dcaId={dcaId} onEnter={dialogClose} />
                </LabelControlTable.List>
                <Separator size="4" my="4" />
                <UnassignAllBuses dcaId={dcaId} onReset={dialogClose} />
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export default ({ dcaId, open, onOpenChange }) => (
    <FallbackDcaName dcaId={dcaId}>
        {props => (
            <DcaEditDialog
                dcaId={dcaId}
                open={open}
                onOpenChange={onOpenChange}
                {...props}
            />
        )}
    </FallbackDcaName>
);
