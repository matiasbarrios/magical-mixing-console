// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Button, Dialog, Flex, Separator } from '@radix-ui/themes';
import {
    useBusName, useBusOptions, useBusReset, useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { Alert } from '../../../components/base/alert';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { useFallbackBusIcon, useFallbackBusColor } from '../../../components/fallback';
import { useUiSize } from '../../../components/theme';
import { formatBusIdentifierShort, NameEdit } from './name';
import { ColorSelect } from './color';
import { IconSelect } from './icon';
import MoveTo from './moveTo';


// Internal
const ClearBusFooter = ({ busId, onClear, busy }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const { reset } = useBusReset(busId);
    const { set: setIcon } = useFallbackBusIcon(busId);
    const { set: setColor } = useFallbackBusColor(busId);

    const doClear = useCallback(async () => {
        await reset();
        setIcon(null);
        setColor(null);
        onClear();
    }, [reset, setIcon, setColor, onClear]);

    return (
        <Flex justify="end" width="100%">
            <Alert
                onAccept={doClear}
                accept={t('Restore bus')}
                title={t('Restore this bus?')}
                description={t('Restore this bus description')}
            >
                {doOpen => (
                    <Button
                        size={textSize}
                        variant="ghost"
                        color="red"
                        onClick={doOpen}
                        disabled={disabled || busy}
                    >
                        { t('Restore this bus') }
                    </Button>
                )}
            </Alert>
        </Flex>
    );
};


// Exported
export default ({ busId, open, onOpenChange }) => {
    const { t } = useLanguage();
    const [moveBusy, setMoveBusy] = useState(false);
    const { has, value, set } = useBusName(busId);
    const { get } = useBusOptions();
    const bus = useMemo(() => get(busId), [busId, get]);
    const title = useMemo(() => (
        bus ? formatBusIdentifierShort(bus.type, bus.number) : null
    ), [bus]);

    const onIconSelected = useCallback((newIcon, oldIcon) => {
        if (newIcon?.id === 'none') return;
        // If no name set, or equal to the last icon, suggest the same as the icon
        if (value && value !== t(oldIcon?.name)) return;
        if (has) set(t(newIcon.name));
    }, [has, value, set, t]);

    const dialogClose = useCallback(() => { onOpenChange(false); }, [onOpenChange]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { title }
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <IconSelect busId={busId} onSelected={onIconSelected} />
                    <ColorSelect busId={busId} />
                    <NameEdit busId={busId} onEnter={dialogClose} />
                    <MoveTo busId={busId} onMoved={dialogClose} onBusy={setMoveBusy} />
                </LabelControlTable.List>
                <Separator size="4" my="4" />
                <ClearBusFooter busId={busId} onClear={dialogClose} busy={moveBusy} />
            </Dialog.Content>
        </Dialog.Root>
    );
};
