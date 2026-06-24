// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import {
    Button, Dialog, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { SceneAppProvider, useDevice, useSceneApp } from '@magical-mixing/mixers-react';
import { ADD_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import { ICON_STYLE } from '../../helpers/values';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import ListFilterEmpty from '../../components/layout/list/filterEmpty';
import { useVault } from '../../components/vault';
import DialogHeader from '../../components/base/dialogHeader';
import {
    ApplyProgressDialog, formatProgressEta, useProgressEta,
} from '../../components/base/applyProgressDialog';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../components/base/labelControlTable';
import EditVaultDialog from './editVaultDialog';
import ListAppRow from './listAppRow';


// Internal
const CaptureDialog = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { running, captureTotal, captureCompleted } = useSceneApp();
    const secondsRemaining = useProgressEta({
        open: running,
        total: captureTotal,
        completed: captureCompleted,
    });
    const eta = secondsRemaining !== null ? formatProgressEta(secondsRemaining) : undefined;

    return (
        <ApplyProgressDialog
            open={running}
            title={t('Saving device state as scene')}
            total={captureTotal}
            completed={captureCompleted}
            eta={eta}
            textSize={textSize}
        />
    );
};


const SceneSave = ({ open, onOpenChange }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { capture } = useSceneApp();
    const { vaultSave, removeNonValidNameCharacters } = useVault('scene');

    const [sceneName, setSceneName] = useState('');
    const [error, setError] = useState(null);

    const onSceneNameSet = useCallback((name) => {
        setError(null);
        setSceneName(name);
    }, []);

    const sceneSave = useCallback(async () => {
        if (!sceneName.trim()) {
            setError(t('Name cannot be empty'));
            return;
        }
        onOpenChange(false);
        capture(async (values) => {
            await vaultSave(sceneName.trim(), values);
        });
    }, [onOpenChange, sceneName, capture, vaultSave, t]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Save device state as scene') }
                </DialogHeader>
                <Flex direction="column" gapY="3">
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <LabelControlTable.Row>
                            <LabelControlTable.Cell width={LABEL_WIDTH}>
                                <Label>
                                    { t('Name') }
                                </Label>
                            </LabelControlTable.Cell>
                            <LabelControlTable.Cell>
                                <Flex direction="column" gapY="2" align="end" width="100%" minWidth="0">
                                    <TextFieldErasable
                                        id="scene-name"
                                        placeholder={t('Scene name')}
                                        value={sceneName}
                                        set={onSceneNameSet}
                                        onChange={removeNonValidNameCharacters}
                                        onEnter={sceneSave}
                                        debounceTime={200}
                                        width="100%" maxWidth="16rem"
                                    />
                                    {!!error && <Text size={textSize} color="red">{ error }</Text>}
                                </Flex>
                            </LabelControlTable.Cell>
                        </LabelControlTable.Row>
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gapX="1">
                        <Button
                            size={textSize}
                            variant="soft"
                            color="blue"
                            onClick={sceneSave}
                            disabled={disabled || !sceneName.trim()}
                        >
                            { t('Save') }
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


const ListToolbarActions = ({ onAdd, disabled }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={onAdd}
            disabled={disabled}
            aria-label={t('Save as new')}
            {...focusRoamAttrs(ADD_ROAM_ID)}
        >
            <PlusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const List = () => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const {
        vaults, vaultErase, vaultLoad, vaultReplace,
    } = useVault('scene');
    const [loadError, setLoadError] = useState(null);
    const { capture, load, running } = useSceneApp();

    const [filterBy, setFilterBy] = useState('');

    const filtered = useMemo(() => vaults.filter(v => v.vaultName
        .toLowerCase().includes(filterBy.toLowerCase())), [vaults, filterBy]);

    useListHeaderTrail(t('App scenes'));

    const [sceneSaveOpen, setSceneSaveOpen] = useState(false);
    const doSceneSaveOpen = useCallback(() => {
        setSceneSaveOpen(true);
    }, []);

    const confirmVaultErase = useCallback(vaultId => async () => {
        await vaultErase(vaultId);
    }, [vaultErase]);

    const [vaultIdEditing, setVaultIdEditing] = useState(null);

    const [loading, setLoading] = useState(false);
    const doSceneLoad = useCallback(vaultId => async () => {
        setLoadError(null);
        setLoading(true);
        try {
            const v = await vaultLoad(vaultId);
            if (!v || typeof v !== 'object') {
                setLoadError(t('Could not read this scene. The file may be damaged. Save over it to replace it.'));
                setLoading(false);
                return;
            }
            load(v, () => { setLoading(false); });
        } catch (error) {
            console.error('Scene load failed', error);
            setLoadError(t('Could not load this scene.'));
            setLoading(false);
        }
    }, [vaultLoad, load, t]);

    const doSceneSaveOver = useCallback(vaultId => async () => {
        capture(async (values) => {
            await vaultReplace(vaultId, values);
        });
    }, [capture, vaultReplace]);

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
                    <ListFilterActions>
                        <ListToolbarActions onAdd={doSceneSaveOpen} disabled={disabled || running} />
                    </ListFilterActions>
                </ListFilterBar>
                {!!loadError && (
                    <Text size={textSize} color="red" mb="3">
                        { loadError }
                    </Text>
                )}
                <ListStack>
                    {filtered.map(v => (
                        <ListAppRow
                            key={v.vaultId}
                            vaultName={v.vaultName}
                            loading={loading}
                            saving={running}
                            onErase={confirmVaultErase(v.vaultId)}
                            onEdit={() => setVaultIdEditing(v.vaultId)}
                            onLoad={doSceneLoad(v.vaultId)}
                            onSaveOver={doSceneSaveOver(v.vaultId)}
                        />
                    ))}
                    <ListFilterEmpty show={!!filterBy.trim() && filtered.length === 0} />
                </ListStack>
            </ListPageShell>
            <SceneSave open={sceneSaveOpen} onOpenChange={setSceneSaveOpen} />
            <CaptureDialog />
            {!!vaultIdEditing && (
                <EditVaultDialog
                    vaultType="scene"
                    vaultId={vaultIdEditing}
                    open={!!vaultIdEditing}
                    onOpenChange={() => setVaultIdEditing(null)}
                />
            )}
        </>
    );
};


// Exported
export default () => (
    <SceneAppProvider>
        <List />
    </SceneAppProvider>
);
