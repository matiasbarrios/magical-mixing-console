// Requirements
import { useCallback, useMemo } from 'react';
import {
    Box, Flex, Text,
} from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { FallbackDcaColor } from '../../../components/fallback';
import { useUiSize } from '../../../components/theme';


// Constants
const menuContentStyle = {
    maxHeight: 'min(320px, var(--radix-dropdown-menu-content-available-height, 320px))',
    overflowY: 'auto',
};

const colorSwatchStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '9999px',
    flexShrink: 0,
};


// Internal
const ColorSwatch = ({ id }) => (
    <Box
        {...(id !== 'gray' && { 'data-accent-color': id })}
        style={{
            ...colorSwatchStyle,
            ...(id === 'gray'
                ? { boxShadow: 'inset 0 0 0 1px var(--gray-a7)' }
                : { backgroundColor: 'var(--accent-9)' }),
        }}
    />
);


const ColorOption = ({ id, name, size = '2' }) => (
    <Flex align="center" gapX="2">
        <ColorSwatch id={id} />
        <Text size={size} wrap="nowrap">{ name }</Text>
    </Flex>
);


const useColorName = () => {
    const { t } = useLanguage();
    return useCallback(o => (o.id === 'gray' ? t('Default') : t(o.name)), [t]);
};


const ColorSelectFinal = ({
    has, value, set, options,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const colorName = useColorName();

    const selectValue = value ?? 'gray';

    const selected = useMemo(() => options.find(o => o.id === selectValue),
        [options, selectValue]);

    const onChange = useCallback((v) => {
        set(v === 'gray' ? null : v);
    }, [set]);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Color') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={onChange} numeric={false}>
                        <DropdownSelect.Trigger square variant="soft" color="gray">
                            {selected && (
                                <ColorOption
                                    id={selected.id}
                                    name={colorName(selected)}
                                    size={textSize}
                                />
                            )}
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content style={menuContentStyle}>
                            <DropdownSelect.Label>{ t('Color') }</DropdownSelect.Label>
                            {options.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={selectValue === o.id}
                                >
                                    <ColorOption id={o.id} name={colorName(o)} />
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
export const ColorSelect = ({ dcaId }) => (
    <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
        {({
            has, value, set, options,
        }) => <ColorSelectFinal has={has} value={value} set={set} options={options} />}
    </FallbackDcaColor>
);
