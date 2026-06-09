// Requirements
import {
    Button, Dialog, Flex,
} from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useFallbackMgOptions } from '../../../components/fallback';
import TextFieldErasable from '../../../components/base/textFieldErasable';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';


// Exported
export default ({ open, close }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { add } = useFallbackMgOptions();

    const [value, setValue] = useState('');

    const doAdd = useCallback(() => {
        add(value);
        close();
    }, [add, close, value]);

    return (
        <Dialog.Root open={open} onOpenChange={close}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Add a new mute group') }
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
                                <Flex align="center" justify="end" width="100%" minWidth="0">
                                    <TextFieldErasable
                                        id="mg-name"
                                        placeholder={t('Name')}
                                        value={value}
                                        set={setValue}
                                        onEnter={doAdd}
                                        debounceTime={50}
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
                            onClick={doAdd}
                            disabled={disabled || !value.trim()}
                        >
                            { t('Add') }
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
