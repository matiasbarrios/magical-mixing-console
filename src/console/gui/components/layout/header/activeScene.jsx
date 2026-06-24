// Requirements
import {
    useCallback, useEffect, useState,
} from 'react';
import { DropdownMenu, Text } from '@radix-ui/themes';
import {
    useDevice, useSceneHas, useSceneSave,
} from '@magical-mixing/mixers-react';
import { useActiveDeviceScene } from '../../activeScene';
import { useLanguage } from '../../language';
import { useSceneFinalName } from '../../../pages/scene/view/name';
import Edit from '../../../pages/scene/view/edit';
import { DropdownMenuTrigger } from '../../base/dropdownMenuTrigger';
import { DropdownMenuContent } from '../../base/dropdownMenuContent';


// Internal
const SceneSaveContent = ({ sceneId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const name = useSceneFinalName(sceneId);
    const { save } = useSceneSave(sceneId);

    const [opened, setOpened] = useState(false);
    const [renameOpened, setRenameOpened] = useState(false);
    const [awaitingInteraction, setAwaitingInteraction] = useState(false);

    useEffect(() => {
        setAwaitingInteraction(false);
    }, [sceneId]);

    useEffect(() => {
        if (!awaitingInteraction) return undefined;

        const onInteraction = () => {
            setAwaitingInteraction(false);
        };

        document.addEventListener('pointerdown', onInteraction, true);

        return () => {
            document.removeEventListener('pointerdown', onInteraction, true);
        };
    }, [awaitingInteraction]);

    const doSave = useCallback(() => {
        if (disabled) return;
        save(name);
        setAwaitingInteraction(true);
        setOpened(false);
    }, [disabled, save, name]);

    const doRenameShow = useCallback(() => {
        setOpened(false);
        setRenameOpened(true);
    }, []);

    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <>
            <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                <DropdownMenuTrigger
                    square
                    variant="ghost"
                    color="gray"
                    aria-label={name}
                    onClick={toggleOpened}
                >
                    <Text size="2" truncate>
                        { name }
                    </Text>
                    {!awaitingInteraction && (
                        <Text size="2" color="gray" aria-hidden>
                            *
                        </Text>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent size="2">
                    <DropdownMenu.Item onSelect={doSave} disabled={disabled}>
                        { t('Save') }
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={doRenameShow} disabled={disabled}>
                        { t('Rename') }
                    </DropdownMenu.Item>
                </DropdownMenuContent>
            </DropdownMenu.Root>
            {renameOpened && (
                <Edit
                    sceneId={sceneId}
                    open={renameOpened}
                    onOpenChange={setRenameOpened}
                />
            )}
        </>
    );
};


// Exported
export default () => {
    const { isOnline, isHalted } = useDevice();
    const { has } = useSceneHas();
    const { sceneId } = useActiveDeviceScene();

    if (!has || sceneId == null || !isOnline || isHalted) return null;

    return <SceneSaveContent sceneId={sceneId} />;
};
