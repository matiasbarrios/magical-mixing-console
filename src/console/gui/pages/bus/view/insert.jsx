// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    useDevice,
    useFxInsertHas,
    useFxType,
    useFxInsertOn,
    useBusInsert,
    useBusInsertFx,
    useBusInsertOn,
} from '@magical-mixing/mixers-react';
import {
    AlertDialog, Button, Flex, Text,
} from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ICON_STYLE } from '../../../helpers/values';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';
import { useLanguage } from '../../../components/language';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { useSelectOptions } from '../../../components/base/selectOptions';
import { DropdownSelect, useDropdownSelect } from '../../../components/base/dropdownSelect';
import Parameters from '../../fx/view/parameters';
import Type from '../../fx/view/type';
import { useUiSize } from '../../../components/theme';


// Internal
const InsertModeHint = ({ fxId }) => {
    const { t } = useLanguage();
    const { has: insertHas } = useFxInsertHas(fxId);
    const { has, value } = useFxInsertOn(fxId);

    const showWarning = useMemo(() => insertHas && has && value === false, [
        insertHas, has, value,
    ]);

    if (!showWarning) return null;

    return (
        <Flex align="center" gapX="1">
            <Text size="2" color="amber"><ExclamationTriangleIcon style={ICON_STYLE} /></Text>
            <Text size="2" color="amber" wrap="nowrap">
                { t('This FX is not in insert mode') }
            </Text>
        </Flex>
    );
};


const FxNameWithInsert = ({
    fxId, optionId, nameAndType, selected, onAssign,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { has, value, set: setInsertOn } = useFxInsertOn(fxId);
    const { onValueChange, setOpened } = useDropdownSelect();

    const [confirmOpen, setConfirmOpen] = useState(false);

    const insertUndetermined = useMemo(() => has && value === undefined, [has, value]);
    const isInserted = useMemo(() => !has || value, [has, value]);

    const doAssign = useCallback(() => {
        onAssign(optionId);
        setOpened(false);
    }, [onAssign, optionId, setOpened]);

    const doConfirm = useCallback(() => {
        setInsertOn(true);
        doAssign();
        setConfirmOpen(false);
    }, [setInsertOn, doAssign]);

    const onSelect = useMemo(() => {
        if (isInserted) return onValueChange(optionId);
        return (e) => {
            e.preventDefault();
            setConfirmOpen(true);
        };
    }, [isInserted, onValueChange, optionId]);

    return (
        <>
            <DropdownSelect.Option
                selected={selected === optionId}
                id={optionId}
                onSelect={onSelect}
            >
                <Flex align="center" justify="between" gapX="3" flexGrow="1">
                    <Text size="2" color="gray" wrap="nowrap">{ nameAndType }</Text>
                    {!isInserted && !insertUndetermined && (
                        <Flex align="center" gapX="1">
                            <Text size="2" color="amber"><ExclamationTriangleIcon style={ICON_STYLE} /></Text>
                            <Text size="2" color="amber" wrap="nowrap">{ t('Not in insert mode') }</Text>
                        </Flex>
                    )}
                </Flex>
            </DropdownSelect.Option>
            <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>
                        { t('Switch to insert mode?') }
                    </AlertDialog.Title>
                    <AlertDialog.Description size={textSize}>
                        { t('Assigning this FX as an insert on this bus will unassign it from its effect bus.') }
                    </AlertDialog.Description>
                    <Flex justify="end" gapX="3" mt="4">
                        <AlertDialog.Cancel>
                            <Button size={textSize} variant="soft" color="gray">
                                { t('Cancel') }
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button
                                size={textSize}
                                variant="soft"
                                color="amber"
                                onClick={doConfirm}
                                disabled={disabled}
                            >
                                { t('Confirm') }
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    );
};


const FxName = ({
    fxId, optionName, optionId, selected, onAssign,
}) => {
    const { translateTry } = useLanguage();
    const { has: insertHas } = useFxInsertHas(fxId);
    const { has: hasType, value: typeId, options: typeOptions } = useFxType(fxId);

    const optionNameTranslated = useMemo(() => translateTry(optionName), [
        optionName, translateTry,
    ]);

    const type = useMemo(() => {
        if (!hasType) return '';
        return typeOptions.find(o => o.id === typeId)?.name || '';
    }, [hasType, typeId, typeOptions]);

    const nameAndType = useMemo(() => `${optionNameTranslated}${type ? ` | ${type}` : ''}`, [
        optionNameTranslated, type,
    ]);

    if (!insertHas) {
        return (
            <DropdownSelect.Option selected={selected === optionId} id={optionId}>
                <Text size="2" color="gray" wrap="nowrap">{ nameAndType }</Text>
            </DropdownSelect.Option>
        );
    }

    return (
        <FxNameWithInsert
            fxId={fxId}
            optionId={optionId}
            nameAndType={nameAndType}
            selected={selected}
            onAssign={onAssign}
        />
    );
};


const NullOption = ({ option, selected }) => {
    const { translateOption } = useLanguage();
    const name = translateOption(option);
    return (
        <DropdownSelect.Option selected={selected === option.id} id={option.id}>
            <Text size="2" color="gray" wrap="nowrap">{ name }</Text>
        </DropdownSelect.Option>
    );
};


const FxOption = ({ option, selected, onAssign }) => {
    const { t } = useLanguage();
    if (option.fxId === null) {
        return (
            <DropdownSelect.Option selected={selected === option.id} id={option.id}>
                <Text size="2" color="gray" wrap="nowrap">{ t(option.name) }</Text>
            </DropdownSelect.Option>
        );
    }
    return (
        <FxName
            fxId={option.fxId}
            optionName={option.name}
            optionId={option.id}
            selected={selected}
            onAssign={onAssign}
        />
    );
};


const FxInsertSelect = ({ busId }) => {
    const { t, translateTry } = useLanguage();
    const { textSize } = useUiSize();
    const busInsertFx = useBusInsertFx(busId);

    const {
        selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    } = useSelectOptions(busInsertFx);

    const onAssign = useCallback((optionId) => {
        onChange(optionId);
    }, [onChange]);

    const displayValue = useMemo(() => {
        if (!selectedOption) return '';
        if (selectedOption.fxId === null) return t(selectedOption.name);
        return translateTry(selectedOption.name);
    }, [selectedOption, t, translateTry]);

    if (!busInsertFx.has || busInsertFx.value === undefined) return null;

    if (hideOptions) {
        return (
            <Button size={textSize} variant="soft" color="gray" disabled>
                <Text size="1" wrap="nowrap">{ displayValue }</Text>
            </Button>
        );
    }

    return (
        <DropdownSelect.Root set={onChange}>
            <DropdownSelect.Trigger square size={textSize} variant="soft" color="gray">
                <Text size="1" wrap="nowrap">{ displayValue }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Fx insert') }</DropdownSelect.Label>
                {nullOptions.map(o => (
                    <NullOption
                        key={o.id}
                        option={o}
                        selected={selected}
                    />
                ))}
                {otherOptions.map(o => (
                    <FxOption
                        key={o.id}
                        option={o}
                        selected={selected}
                        onAssign={onAssign}
                    />
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const StatusRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, toggle } = useBusInsertOn(busId);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Status') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <ActiveToggleButton active={value} onClick={toggle} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const EffectRow = ({ busId }) => {
    const { t } = useLanguage();
    const { value, get } = useBusInsertFx(busId);
    const option = useMemo(() => get(value), [get, value]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('FX') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex direction="column" align="end" gap="1" width="100%" minWidth="0">
                    <Flex align="center" justify="end" width="100%" minWidth="0">
                        <FxInsertSelect busId={busId} />
                    </Flex>
                    {!!option?.fxId && <InsertModeHint fxId={option.fxId} />}
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const FxType = ({ busId, controlSize }) => {
    const { has, value, get } = useBusInsertFx(busId);
    const option = useMemo(() => get(value), [get, value]);
    if (!has || !option || option.fxId === null) return null;
    return <Type fxId={option.fxId} controlSize={controlSize} />;
};


const ParametersIFHas = ({ busId, controlSize }) => {
    const { has, value, get } = useBusInsertFx(busId);
    const option = useMemo(() => get(value), [get, value]);

    if (!has || !option || option.fxId === null) return null;

    return <Parameters fxId={option.fxId} controlSize={controlSize} />;
};


const Insert = ({ busId }) => {
    const { textSize: controlSize } = useUiSize();

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            <StatusRow busId={busId} />
            <EffectRow busId={busId} />
            <FxType busId={busId} controlSize={controlSize} />
            <ParametersIFHas busId={busId} controlSize={controlSize} />
        </LabelControlTable.List>
    );
};


// Exported
export default ({ busId }) => {
    const { has } = useBusInsert(busId);
    const { has: hasInsertFx } = useBusInsertFx(busId);

    if (!has || !hasInsertFx) return null;

    return <Insert busId={busId} />;
};
