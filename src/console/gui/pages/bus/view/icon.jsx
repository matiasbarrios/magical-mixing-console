// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Button, Dialog, Flex, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { Icon, useFallbackBusIcon } from '../../../components/fallback';
import { useUiSize } from '../../../components/theme';
import { ICON_STYLE } from '../../../helpers/values';


// Internal
const useSortedIconOptions = (options) => {
    const { t } = useLanguage();
    return useMemo(() => {
        const list = options ?? [];
        const none = list.find(o => o.id === 'none');
        const res = list.filter(o => o.id !== 'none');
        res.sort((a, b) => t(a.name).localeCompare(t(b.name)));
        if (none) res.unshift(none);
        return res;
    }, [options, t]);
};


const useIconName = () => {
    const { t } = useLanguage();
    return useCallback(o => t(o.name), [t]);
};


const IconButtonLabel = ({ id, name, size = '2' }) => (
    <Flex align="center" gapX="2">
        {id !== 'none' && <Icon id={id} style={ICON_STYLE} />}
        <Text size={size} wrap="nowrap">{ name }</Text>
    </Flex>
);


const IconPickerDialog = ({
    open, onOpenChange, options, selectValue, onSelect,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const iconName = useIconName();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined} maxWidth="360px">
                <Dialog.Title size={textSize} mb="3">
                    { t('Icon') }
                </Dialog.Title>
                <Flex gap="2" wrap="wrap" justify="center">
                    {options.map(o => (
                        <Button
                            key={o.id}
                            size={textSize}
                            variant={selectValue === o.id ? 'solid' : 'soft'}
                            color="gray"
                            disabled={disabled}
                            onClick={() => onSelect(o.id)}
                        >
                            <IconButtonLabel
                                id={o.id}
                                name={iconName(o)}
                                size={textSize}
                            />
                        </Button>
                    ))}
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export const IconSelect = ({ busId, onSelected }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const [pickerOpen, setPickerOpen] = useState(false);
    const {
        has, value, set, options,
    } = useFallbackBusIcon(busId);
    const iconName = useIconName();

    const optionsSorted = useSortedIconOptions(options);
    const selectValue = value ?? 'none';

    const selected = useMemo(() => optionsSorted.find(o => o.id === selectValue),
        [optionsSorted, selectValue]);

    const onSelect = useCallback((v) => {
        const newIcon = options.find(o => o.id === v);
        const oldIcon = options.find(o => o.id === selectValue);
        set(v === 'none' ? null : v);
        if (onSelected && newIcon) onSelected(newIcon, oldIcon);
        setPickerOpen(false);
    }, [set, onSelected, options, selectValue]);

    const openPicker = useCallback(() => setPickerOpen(true), []);

    if (!has) return null;

    return (
        <>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Icon') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%" minWidth="0">
                        <Button
                            size={textSize}
                            variant="soft"
                            color="gray"
                            disabled={disabled}
                            onClick={openPicker}
                        >
                            {selected && (
                                <IconButtonLabel
                                    id={selected.id}
                                    name={iconName(selected)}
                                    size={textSize}
                                />
                            )}
                        </Button>
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            <IconPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                options={optionsSorted}
                selectValue={selectValue}
                onSelect={onSelect}
            />
        </>
    );
};
