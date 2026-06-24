// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Button, Dialog, Flex,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { useFallbackDcaColor } from '../../../components/fallback';
import { useUiSize } from '../../../components/theme';


// Internal
const useColorName = () => {
    const { t } = useLanguage();
    return useCallback(o => (o.id === 'gray' ? t('Default') : t(o.name)), [t]);
};


const buttonColor = id => (id === 'gray' ? 'gray' : id);


const ColorPickerDialog = ({
    open, onOpenChange, options, selectValue, onSelect,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const colorName = useColorName();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined} maxWidth="360px">
                <Dialog.Title size={textSize} mb="3">
                    { t('Color') }
                </Dialog.Title>
                <Flex gap="2" wrap="wrap" justify="center">
                    {options.map(o => (
                        <Button
                            key={o.id}
                            size={textSize}
                            variant={selectValue === o.id ? 'solid' : 'soft'}
                            color={buttonColor(o.id)}
                            disabled={disabled}
                            onClick={() => onSelect(o.id)}
                        >
                            { colorName(o) }
                        </Button>
                    ))}
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export const ColorSelect = ({ dcaId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const [pickerOpen, setPickerOpen] = useState(false);
    const {
        has, value, set, options,
    } = useFallbackDcaColor(dcaId);
    const colorName = useColorName();

    const selectValue = value ?? 'gray';

    const selected = useMemo(() => options.find(o => o.id === selectValue),
        [options, selectValue]);

    const onSelect = useCallback((v) => {
        set(v === 'gray' ? null : v);
        setPickerOpen(false);
    }, [set]);

    const openPicker = useCallback(() => setPickerOpen(true), []);

    if (!has || value === undefined) return null;

    return (
        <>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Color') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%" minWidth="0">
                        <Button
                            size={textSize}
                            variant="soft"
                            color={buttonColor(selectValue)}
                            disabled={disabled}
                            onClick={openPicker}
                        >
                            {selected && colorName(selected)}
                        </Button>
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            <ColorPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                options={options}
                selectValue={selectValue}
                onSelect={onSelect}
            />
        </>
    );
};
