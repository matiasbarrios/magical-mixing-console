// Requirements
import { useCallback, useMemo } from 'react';
import {
    Box, Flex, Text,
} from '@radix-ui/themes';
import { ICON_STYLE, ICON_SPACER } from '../../../helpers/values';
import { useLanguage } from '../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { FallbackMgIconUse, Icon } from '../../../components/fallback';
import { useUiSize } from '../../../components/theme';


// Constants
const menuContentStyle = {
    maxHeight: 'min(320px, var(--radix-dropdown-menu-content-available-height, 320px))',
    overflowY: 'auto',
};


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


const IconOption = ({ id, name, size = '2' }) => (
    <Flex align="center" gapX="2">
        {id !== 'none'
            ? <Icon id={id} style={ICON_STYLE} />
            : <Box {...ICON_SPACER} />}
        <Text size={size} wrap="nowrap">{ name }</Text>
    </Flex>
);


const IconSelectFinal = ({
    has, value, set, options, onSelected,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const optionsSorted = useSortedIconOptions(options);
    const selectValue = value ?? 'none';

    const selected = useMemo(() => optionsSorted.find(o => o.id === selectValue),
        [optionsSorted, selectValue]);

    const onChange = useCallback((v) => {
        const newIcon = options.find(o => o.id === v);
        const oldIcon = options.find(o => o.id === selectValue);
        set(v === 'none' ? null : v);
        if (onSelected && newIcon) onSelected(newIcon, oldIcon);
    }, [set, onSelected, options, selectValue]);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Icon') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={onChange} numeric={false}>
                        <DropdownSelect.Trigger square variant="soft" color="gray">
                            {selected && (
                                <IconOption
                                    id={selected.id}
                                    name={t(selected.name)}
                                    size={textSize}
                                />
                            )}
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content style={menuContentStyle}>
                            <DropdownSelect.Label>{ t('Icon') }</DropdownSelect.Label>
                            {optionsSorted.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={selectValue === o.id}
                                >
                                    <IconOption id={o.id} name={t(o.name)} />
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export const IconSelect = ({ mgId, onSelected }) => (
    <FallbackMgIconUse mgId={mgId}>
        {({
            has, value, set, options,
        }) => (
            <IconSelectFinal
                has={has}
                value={value}
                set={set}
                options={options}
                onSelected={onSelected}
            />
        )}
    </FallbackMgIconUse>
);
