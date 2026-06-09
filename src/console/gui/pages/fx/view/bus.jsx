// Requirements
import { useFxBus } from '@magical-mixing/mixers-react';
import { Flex, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import { useSelectOptions } from '../../../components/base/selectOptions';
import { Label, LabelControlTable, LABEL_WIDTH } from '../../../components/base/labelControlTable';
import { BusIconNameLabeled, BusIconNameLinkLabeled } from '../../bus/view/name';
import { DropdownSelect } from '../../../components/base/dropdownSelect';


// Internal
const stopDropdownOpen = (e) => {
    e.stopPropagation();
};


const NullOption = ({ option, selectedOptionId, controlSize = '2' }) => {
    const { translateOption } = useLanguage();
    const name = translateOption(option);
    return (
        <DropdownSelect.Option selected={selectedOptionId === option.id} id={option.id}>
            <Text size={controlSize}>{ name }</Text>
        </DropdownSelect.Option>
    );
};


const BusOption = ({ option, selectedOptionId, controlSize = '2' }) => (
    <DropdownSelect.Option selected={selectedOptionId === option.id} id={option.id}>
        <BusIconNameLabeled busId={option.id} size={controlSize} />
    </DropdownSelect.Option>
);


const BusSelectLabel = ({
    option, t, translateOption, inDropdown = false, controlSize = '2',
}) => {
    if (!option || option.id === null) {
        const name = option ? translateOption(option) : t('Unassigned');
        return <Text size={controlSize} wrap="nowrap">{ name }</Text>;
    }
    if (!inDropdown) {
        return <BusIconNameLinkLabeled busId={option.id} size={controlSize} variant="ghost" />;
    }
    return (
        <span onPointerDown={stopDropdownOpen}>
            <BusIconNameLabeled busId={option.id} size={controlSize} />
        </span>
    );
};


const FxBus = ({ fxId, controlSize = '2' }) => {
    const { has, value, get } = useFxBus(fxId);
    const option = useMemo(() => get(value), [get, value]);

    if (!has || !option) return null;

    return <BusIconNameLinkLabeled busId={option.id} size={controlSize} variant="ghost" />;
};


const BusControl = ({
    t, translateOption, selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    controlSize = '2',
}) => {
    const displayValue = useMemo(() => (
        <BusSelectLabel
            option={selectedOption}
            t={t}
            translateOption={translateOption}
            inDropdown={!hideOptions}
            controlSize={controlSize}
        />
    ), [selectedOption, t, translateOption, hideOptions, controlSize]);

    if (hideOptions) {
        return (
            <Flex align="center" justify="end" width="100%" minWidth="0">
                { displayValue }
            </Flex>
        );
    }

    return (
        <Flex align="center" justify="end" width="100%" minWidth="0">
            <DropdownSelect.Root set={onChange}>
                <DropdownSelect.Trigger square size={controlSize} variant="soft" color="gray">
                    { displayValue }
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    <DropdownSelect.Label>{ t('Bus') }</DropdownSelect.Label>
                    {nullOptions.map(o => (
                        <NullOption
                            key={o.id}
                            option={o}
                            selectedOptionId={selected}
                            controlSize={controlSize}
                        />
                    ))}
                    {otherOptions.map(o => (
                        <BusOption
                            key={o.id}
                            option={o}
                            selectedOptionId={selected}
                            controlSize={controlSize}
                        />
                    ))}
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};


const BusSelect = ({ fxId, controlSize = '2' }) => {
    const { t, translateOption } = useLanguage();
    const fxBus = useFxBus(fxId);

    const {
        selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    } = useSelectOptions(fxBus);

    if (!fxBus.has || selected === undefined) return null;

    return (
        <BusControl
            t={t}
            translateOption={translateOption}
            selected={selected}
            selectedOption={selectedOption}
            onChange={onChange}
            nullOptions={nullOptions}
            otherOptions={otherOptions}
            hideOptions={hideOptions}
            controlSize={controlSize}
        />
    );
};


export default ({ fxId, controlSize = '2' }) => {
    const { t, translateOption } = useLanguage();
    const fxBus = useFxBus(fxId);

    const {
        selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    } = useSelectOptions(fxBus);

    if (!fxBus.has || selected === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Effect bus') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <BusControl
                    t={t}
                    translateOption={translateOption}
                    selected={selected}
                    selectedOption={selectedOption}
                    onChange={onChange}
                    nullOptions={nullOptions}
                    otherOptions={otherOptions}
                    hideOptions={hideOptions}
                    controlSize={controlSize}
                />
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};

export { BusSelect, FxBus };
