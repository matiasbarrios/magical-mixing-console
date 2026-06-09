// Requirements
import { useCallback, useState } from 'react';
import {
    Button, Flex, IconButton, Spinner, Text,
} from '@radix-ui/themes';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { ICON_STYLE } from '../../helpers/values';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { Alert } from '../../components/base/alert';
import LoadDialog from './loadDialog';
import SaveDialog from './saveDialog';


// Exported
export default ({
    vaultName,
    loading,
    saving,
    onErase,
    onEdit,
    onLoad,
    onSaveOver,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const [loadOpened, setLoadOpened] = useState(false);
    const [saveOpened, setSaveOpened] = useState(false);
    const loadShow = useCallback(() => setLoadOpened(true), []);
    const saveShow = useCallback(() => setSaveOpened(true), []);
    const busy = disabled || loading || saving;

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <>
            <Flex
                align="center"
                gapX="1"
                width="100%"
                wrap="nowrap"
                minWidth="0"
            >
                <Flex flexShrink="0" minWidth="0">
                    <Text size={textSize} color="gray">
                        { vaultName }
                    </Text>
                </Flex>
                <Flex flexGrow="1" minWidth="0" />
                <Flex
                    flexShrink="0"
                    align="center"
                    gapX="1"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <Button
                        size={textSize}
                        variant="soft"
                        color="gray"
                        disabled={busy}
                        onClick={loadShow}
                    >
                        {loading ? <Spinner size="2" /> : t('Load')}
                    </Button>
                    <Button
                        size={textSize}
                        variant="soft"
                        color="gray"
                        disabled={busy}
                        onClick={saveShow}
                    >
                        { t('Save') }
                    </Button>
                    <IconButton
                        size={textSize}
                        variant="soft"
                        radius="full"
                        color="gray"
                        disabled={busy}
                        onClick={onEdit}
                        aria-label={t('Rename')}
                    >
                        <Pencil1Icon style={ICON_STYLE} />
                    </IconButton>
                    {!loading && (
                        <Alert onAccept={onErase} title={`${t('Erase')} ${vaultName}`} accept={t('Erase')}>
                            {doOpen => (
                                <IconButton
                                    size={textSize}
                                    variant="soft"
                                    radius="full"
                                    color="gray"
                                    disabled={disabled || saving}
                                    onClick={doOpen}
                                    aria-label={t('Erase')}
                                >
                                    <TrashIcon style={ICON_STYLE} />
                                </IconButton>
                            )}
                        </Alert>
                    )}
                </Flex>
            </Flex>
            {loadOpened && (
                <LoadDialog
                    open={loadOpened}
                    onOpenChange={setLoadOpened}
                    name={vaultName}
                    onAccept={onLoad}
                />
            )}
            {saveOpened && (
                <SaveDialog
                    open={saveOpened}
                    onOpenChange={setSaveOpened}
                    name={vaultName}
                    onAccept={onSaveOver}
                />
            )}
        </>
    );
};
