// Requirements
import { useCallback, useEffect, useState } from 'react';
import {
    Button, Dialog, Flex,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import DialogHeader from '../../components/base/dialogHeader';
import TextFieldErasable from '../../components/base/textFieldErasable';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../components/base/labelControlTable';


// Exported
export default ({
    open, onOpenChange, defaultName, onAccept,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const [sceneName, setSceneName] = useState(defaultName);

    useEffect(() => {
        if (open) setSceneName(defaultName);
    }, [open, defaultName]);

    const doSave = useCallback(() => {
        const trimmed = sceneName.trim();
        if (!trimmed) return;
        onAccept(trimmed);
        onOpenChange(false);
    }, [onAccept, onOpenChange, sceneName]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { `${t('Save here')} ${defaultName}` }
                </DialogHeader>
                <Flex direction="column" gapY="3">
                    <Dialog.Description size={textSize}>
                        { t('Current mixer state will replace this scene.') }
                    </Dialog.Description>
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <LabelControlTable.Row>
                            <LabelControlTable.Cell width={LABEL_WIDTH}>
                                <Label>
                                    { t('Name') }
                                </Label>
                            </LabelControlTable.Cell>
                            <LabelControlTable.Cell>
                                <Flex align="center" justify="end" width="100%" minWidth="0">
                                    <TextFieldErasable
                                        id="device-scene-name"
                                        placeholder={t('Scene name')}
                                        value={sceneName}
                                        set={setSceneName}
                                        onEnter={doSave}
                                        debounceTime={200}
                                        width="100%" maxWidth="16rem"
                                    />
                                </Flex>
                            </LabelControlTable.Cell>
                        </LabelControlTable.Row>
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gapX="1">
                        <Button
                            size={textSize}
                            variant="soft"
                            color="blue"
                            onClick={doSave}
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
