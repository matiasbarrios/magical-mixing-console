// Requirements
import { useFxInsertLeft, useFxInsertRight } from '@magical-mixing/mixers-react';
import {
    Flex, Text,
} from '@radix-ui/themes';
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import { useSelectOptions } from '../../../components/base/selectOptions';
import { BusIconNameLabeled, BusIconNameLinkLabeled } from '../../bus/view/name';
import { Label, LabelControlTable, LABEL_WIDTH } from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';


// Internal
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
    option, t, translateOption, controlSize = '2',
}) => {
    if (!option || option.id === null) {
        const name = option ? translateOption(option) : t('Unassigned');
        return <Text size={controlSize} wrap="nowrap">{ name }</Text>;
    }
    return <BusIconNameLabeled busId={option.id} size={controlSize} />;
};


const InsertSideControl = ({
    t, translateOption, selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    controlSize = '2', inline = false,
}) => {
    const displayValue = useMemo(() => (
        <BusSelectLabel
            option={selectedOption}
            t={t}
            translateOption={translateOption}
            controlSize={controlSize}
        />
    ), [selectedOption, t, translateOption, controlSize]);

    if (hideOptions) {
        if (inline) return displayValue;
        return (
            <Flex align="center" justify="end" width="100%" minWidth="0">
                { displayValue }
            </Flex>
        );
    }

    const select = (
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
    );

    if (inline) return select;

    return (
        <Flex align="center" justify="end" width="100%" minWidth="0">
            { select }
        </Flex>
    );
};


const InsertSideSelect = ({ side, controlSize = '2', inline = false }) => {
    const { t, translateOption } = useLanguage();

    const {
        selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    } = useSelectOptions(side);

    if (!side.has || selected === undefined) return null;

    return (
        <InsertSideControl
            t={t}
            translateOption={translateOption}
            selected={selected}
            selectedOption={selectedOption}
            onChange={onChange}
            nullOptions={nullOptions}
            otherOptions={otherOptions}
            hideOptions={hideOptions}
            controlSize={controlSize}
            inline={inline}
        />
    );
};


const InsertSide = ({ title, side, controlSize = '2' }) => {
    const { t } = useLanguage();

    if (!side.has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t(title) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <InsertSideSelect side={side} controlSize={controlSize} />
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export const FxInsert = ({ fxId, controlSize = '2' }) => {
    const { t } = useLanguage();
    const { has: leftHas, value: leftValue, options: leftOptions } = useFxInsertLeft(fxId);
    const { has: rightHas, value: rightValue, options: rightOptions } = useFxInsertRight(fxId);

    const left = useMemo(() => leftOptions.find(o => o.id === leftValue), [leftOptions, leftValue]);
    const right = useMemo(() => rightOptions
        .find(o => o.id === rightValue), [rightOptions, rightValue]);

    return (
        <Flex align="center" gapX="1" minWidth="0">
            {leftHas && left && left.id !== null ? (
                <BusIconNameLinkLabeled busId={left.id} size={controlSize} variant="ghost" />
            ) : (
                <Text size={controlSize} color="gray" as="span">
                    { t('Unassigned') }
                </Text>
            )}
            <Text size={controlSize} color="gray" as="span">+</Text>
            {rightHas && right && right.id !== null ? (
                <BusIconNameLinkLabeled busId={right.id} size={controlSize} variant="ghost" />
            ) : (
                <Text size={controlSize} color="gray" as="span">
                    { t('Unassigned') }
                </Text>
            )}
        </Flex>
    );
};


export const InsertRoutingSelect = ({ fxId, controlSize = '2', inline = false }) => {
    const left = useFxInsertLeft(fxId);
    const right = useFxInsertRight(fxId);

    if (!left.has && !right.has) return null;

    return (
        <Flex align="center" gapX="1" minWidth="0" wrap="nowrap">
            <InsertSideSelect side={left} controlSize={controlSize} inline={inline} />
            <Text size={controlSize} color="gray" as="span" className="mmc-shrink-0">+</Text>
            <InsertSideSelect side={right} controlSize={controlSize} inline={inline} />
        </Flex>
    );
};


export default ({ fxId, controlSize = '2' }) => {
    const { t } = useLanguage();
    const left = useFxInsertLeft(fxId);
    const right = useFxInsertRight(fxId);

    return (
        <>
            <InsertSide title={t('Left')} side={left} controlSize={controlSize} />
            <InsertSide title={t('Right')} side={right} controlSize={controlSize} />
        </>
    );
};
