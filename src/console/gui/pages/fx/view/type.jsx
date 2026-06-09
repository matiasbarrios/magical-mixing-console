// Requirements
import { useMemo } from 'react';
import { useFxType } from '@magical-mixing/mixers-react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { Label, LabelControlTable, LABEL_WIDTH } from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { useUiSize } from '../../../components/theme';


// Internal
const useFxTypeName = (fxId) => {
    const { t } = useLanguage();
    const { has, value, get } = useFxType(fxId);
    const option = useMemo(() => get(value), [get, value]);

    if (!has || !option) return { name: null };

    return { name: t(option.name) };
};


const TypeSelect = ({
    value, set, options, get, categories, activeCategory, t, controlSize,
}) => {
    const option = useMemo(() => get(value), [get, value]);

    return (
        <DropdownSelect.Root set={set}>
            <DropdownSelect.Trigger square size={controlSize} variant="soft" color="gray">
                <Text size={controlSize} wrap="nowrap">{ option?.name }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                {categories.map(c => (
                    <DropdownSelect.Sub key={c}>
                        <DropdownSelect.SubTrigger>{ t(c) }</DropdownSelect.SubTrigger>
                        <DropdownSelect.SubContent>
                            {options.filter(o => o.category === c).map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={value === o.id}
                                    noWhiteSpace={activeCategory !== c}
                                >
                                    <Text size="2">{ o.name }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.SubContent>
                    </DropdownSelect.Sub>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const TypeSelectControl = ({ fxId, controlSize: controlSizeProp }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const controlSize = controlSizeProp ?? textSize;
    const {
        has, value, set, options, get,
    } = useFxType(fxId);

    const categories = useMemo(() => [...new Set(options.map(o => o.category))]
        .sort((a, b) => a.localeCompare(b)), [options]);

    const option = useMemo(() => get(value), [get, value]);

    const activeCategory = useMemo(() => option?.category, [option]);

    if (!has || value === undefined) return null;

    return (
        <TypeSelect
            value={value}
            set={set}
            options={options}
            get={get}
            categories={categories}
            activeCategory={activeCategory}
            t={t}
            controlSize={controlSize}
        />
    );
};


export default ({ fxId, label = 'Type', controlSize: controlSizeProp }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const controlSize = controlSizeProp ?? textSize;
    const select = <TypeSelectControl fxId={fxId} controlSize={controlSize} />;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t(label) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
                    { select }
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};

export { TypeSelectControl, useFxTypeName };
