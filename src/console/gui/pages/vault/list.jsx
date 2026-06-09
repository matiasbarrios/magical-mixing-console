// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import {
    Dialog, Flex, IconButton,
} from '@radix-ui/themes';
import { useParams } from 'react-router';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { ICON_STYLE } from '../../helpers/values';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { NameEditRow } from '../../components/base/nameEditRow';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import ListFilterEmpty from '../../components/layout/list/filterEmpty';
import { useVault, useVaultName } from '../../components/vault';
import Link from '../../components/base/link';
import { Alert } from '../../components/base/alert';
import DialogHeader from '../../components/base/dialogHeader';
import { LabelControlTable, LABEL_CONTROL_CLASS } from '../../components/base/labelControlTable';


// Internal
const useParsedParams = () => {
    const { vaultType } = useParams();
    return { vaultType };
};


const VaultNameEdit = ({
    vaultType, vaultId, open, onOpenChange,
}) => {
    const { t } = useLanguage();
    const { removeNonValidNameCharacters } = useVault(vaultType);
    const { vaultName, setVaultName } = useVaultName(vaultId);

    const doSetVaultName = useCallback(async (name) => {
        if (!name.trim()) return;
        await setVaultName(name);
    }, [setVaultName]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Edit name') }
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <NameEditRow
                        id="vault-name"
                        label={t('Name')}
                        placeholder={t('Name')}
                        value={vaultName}
                        set={doSetVaultName}
                        onChange={removeNonValidNameCharacters}
                    />
                </LabelControlTable.List>
            </Dialog.Content>
        </Dialog.Root>
    );
};


const VaultRow = ({
    vaultId, vaultName, disabled, onEdit, confirmErase,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0" minWidth="0">
                <Link size={textSize} variant="ghost" color="gray" mx="1.5" to={`/vault/${vaultId}`}>
                    { vaultName }
                </Link>
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <IconButton
                    size={textSize}
                    variant="soft"
                    radius="full"
                    color="gray"
                    onClick={() => onEdit(vaultId)}
                    disabled={disabled}
                    aria-label={t('Rename')}
                >
                    <Pencil1Icon style={ICON_STYLE} />
                </IconButton>
                <Alert
                    onAccept={confirmErase.handler}
                    title={confirmErase.title}
                    accept={confirmErase.acceptLabel}
                >
                    {doOpen => (
                        <IconButton
                            size={textSize}
                            variant="soft"
                            radius="full"
                            color="gray"
                            disabled={disabled}
                            onClick={doOpen}
                            aria-label={t('Erase')}
                        >
                            <TrashIcon style={ICON_STYLE} />
                        </IconButton>
                    )}
                </Alert>
            </Flex>
        </Flex>
    );
};


const List = ({ vaultType }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { vaults, vaultErase } = useVault(vaultType);

    const [filterBy, setFilterBy] = useState('');

    const filtered = useMemo(() => vaults.filter(v => v.vaultName
        .toLowerCase().includes(filterBy.toLowerCase())), [vaults, filterBy]);

    const sectionName = useMemo(() => {
        if (vaultType === 'preset-compressor') return t('Compressor presets');
        if (vaultType === 'preset-gate') return t('Gate presets');
        if (vaultType === 'preset-equalizer') return t('Equalizer presets');
        return t('Vaults');
    }, [vaultType, t]);

    useListHeaderTrail(sectionName);

    const [vaultIdEditing, setVaultIdEditing] = useState(null);

    const confirmVaultErase = useCallback(vaultId => async () => {
        await vaultErase(vaultId);
    }, [vaultErase]);

    return (
        <>
            <ListPageShell>
                <ListFilterBar>
                    <ListFilterTitle>
                        <TextFieldErasable
                            variant="surface"
                            placeholder={t('Name')}
                            value={filterBy}
                            set={setFilterBy}
                            debounceTime={250}
                            width="100%"
                        />
                    </ListFilterTitle>
                    <ListFilterActions />
                </ListFilterBar>
                <ListStack>
                    {filtered.map(v => (
                        <VaultRow
                            key={v.vaultId}
                            vaultId={v.vaultId}
                            vaultName={v.vaultName}
                            disabled={disabled}
                            onEdit={setVaultIdEditing}
                            confirmErase={{
                                title: `${t('Erase')} ${v.vaultName}`,
                                acceptLabel: t('Erase'),
                                handler: confirmVaultErase(v.vaultId),
                            }}
                        />
                    ))}
                    <ListFilterEmpty show={!!filterBy.trim() && filtered.length === 0} />
                </ListStack>
            </ListPageShell>
            {!!vaultIdEditing && (
                <VaultNameEdit
                    vaultType={vaultType}
                    vaultId={vaultIdEditing}
                    open={!!vaultIdEditing}
                    onOpenChange={() => setVaultIdEditing(null)}
                />
            )}
        </>
    );
};


// Exported
export default () => {
    const { vaultType } = useParsedParams();
    if (!vaultType) return null;
    return <List vaultType={vaultType} />;
};
