// Requirements
import { useCallback } from 'react';
import {
    Button, Dialog, Separator, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { FallbackBusMgUnassignAllOf, FallbackMgName } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import { Alert } from '../../../components/base/alert';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { useUiSize } from '../../../components/theme';
import { NameEdit } from './name';
import { IconSelect } from './icon';


// Internal
const UnassignAllBusesInner = ({ unassignAllOf, onReset }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const doUnassign = useCallback(() => {
        unassignAllOf();
        onReset();
    }, [unassignAllOf, onReset]);

    return (
        <Alert
            onAccept={doUnassign}
            accept={t('Unassign all')}
            title={t('Unassign all buses?')}
            description={t('Removes all bus assignments from this mute group. This cannot be undone.')}
        >
            {doOpen => (
                <Button size={textSize} variant="ghost" color="red" onClick={doOpen} disabled={disabled}>
                    { t('Unassign all') }
                </Button>
            )}
        </Alert>
    );
};


const UnassignAllBuses = ({ mgId, onReset }) => (
    <FallbackBusMgUnassignAllOf mgId={mgId}>
        {({ unassignAllOf }) => (
            <UnassignAllBusesInner unassignAllOf={unassignAllOf} onReset={onReset} />
        )}
    </FallbackBusMgUnassignAllOf>
);


const MgEditDialog = ({
    mgId, open, onOpenChange, has, value, set, defaultName,
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
                    <IconSelect mgId={mgId} onSelected={onIconSelected} />
                    <NameEdit mgId={mgId} onEnter={dialogClose} />
                </LabelControlTable.List>
                <Separator size="4" my="4" />
                <UnassignAllBuses mgId={mgId} onReset={dialogClose} />
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export default ({ mgId, open, onOpenChange }) => (
    <FallbackMgName mgId={mgId}>
        {props => (
            <MgEditDialog
                mgId={mgId}
                open={open}
                onOpenChange={onOpenChange}
                {...props}
            />
        )}
    </FallbackMgName>
);
