// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Button, Flex, IconButton,
} from '@radix-ui/themes';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import {
    useDevice, useSceneActive, useSceneErase, useSceneLoad, useSceneSave,
} from '@magical-mixing/mixers-react';
import { Alert } from '../../components/base/alert';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { ICON_STYLE } from '../../helpers/values';
import ViewScene from './view/openScene';
import LoadDialog from './loadDialog';
import SaveDeviceDialog from './saveDeviceDialog';
import Edit from './view/edit';
import { useSceneFinalName } from './view/name';


// Exported
export default ({ sceneId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const name = useSceneFinalName(sceneId);
    const { has: activeHas, value: activeValue } = useSceneActive(sceneId);
    const { erase } = useSceneErase(sceneId);
    const { load } = useSceneLoad(sceneId);
    const { save } = useSceneSave(sceneId);

    const occupied = useMemo(() => (activeHas && activeValue)
        || !activeHas, [activeHas, activeValue]);

    const doLoad = useCallback(() => {
        load();
    }, [load]);

    const doSave = useCallback((sceneName) => {
        save(sceneName);
    }, [save]);

    const [loadOpened, setLoadOpened] = useState(false);
    const [saveOpened, setSaveOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false);
    const loadShow = useCallback(() => setLoadOpened(true), []);
    const saveShow = useCallback(() => setSaveOpened(true), []);
    const editShow = useCallback(() => setEditOpened(true), []);

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
                <Flex flexShrink="0">
                    <ViewScene sceneId={sceneId} />
                </Flex>
                <Flex flexGrow="1" minWidth="0" />
                <Flex
                    flexShrink="0"
                    align="center"
                    gapX="1"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    {occupied && (
                        <Button
                            size={textSize}
                            variant="soft"
                            color="gray"
                            disabled={disabled}
                            onClick={loadShow}
                        >
                            { t('Load') }
                        </Button>
                    )}
                    <Button
                        size={textSize}
                        variant="soft"
                        color="gray"
                        disabled={disabled}
                        onClick={saveShow}
                    >
                        { t('Save') }
                    </Button>
                    {occupied && (
                        <IconButton
                            size={textSize}
                            variant="soft"
                            radius="full"
                            color="gray"
                            disabled={disabled}
                            onClick={editShow}
                            aria-label={t('Rename')}
                        >
                            <Pencil1Icon style={ICON_STYLE} />
                        </IconButton>
                    )}
                    {occupied && (
                        <Alert onAccept={erase} title={`${t('Erase')} ${name}`} accept={t('Erase')}>
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
                    )}
                </Flex>
            </Flex>
            {loadOpened && (
                <LoadDialog
                    open={loadOpened}
                    onOpenChange={setLoadOpened}
                    name={name}
                    onAccept={doLoad}
                />
            )}
            {saveOpened && (
                <SaveDeviceDialog
                    open={saveOpened}
                    onOpenChange={setSaveOpened}
                    defaultName={name}
                    onAccept={doSave}
                />
            )}
            {editOpened && (
                <Edit
                    sceneId={sceneId}
                    open={editOpened}
                    onOpenChange={setEditOpened}
                />
            )}
        </>
    );
};
