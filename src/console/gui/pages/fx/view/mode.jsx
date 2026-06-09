// Requirements
import { useFxInsertHas, useFxInsertOn } from '@magical-mixing/mixers-react';
import { Flex, Text } from '@radix-ui/themes';
import { useCallback } from 'react';
import { useLanguage } from '../../../components/language';
import { Label, LabelControlTable, LABEL_WIDTH } from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { useUiSize } from '../../../components/theme';


// Internal
const ModeSelect = ({ fxId, controlSize: controlSizeProp }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const controlSize = controlSizeProp ?? textSize;
    const { has: onHas, value: onValue, set: onSet } = useFxInsertOn(fxId);

    const setBoolean = useCallback(v => onSet(!!v), [onSet]);

    if (!onHas || onValue === undefined) return null;

    return (
        <DropdownSelect.Root set={setBoolean}>
            <DropdownSelect.Trigger square size={controlSize} variant="soft" color="gray">
                <Text size={controlSize} wrap="nowrap">
                    { onValue ? t('Insert') : t('In effect bus') }
                </Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Option key="false" id={0} selected={!onValue}>
                    <Text size="2">{ t('In effect bus') }</Text>
                </DropdownSelect.Option>
                <DropdownSelect.Option key="true" id={1} selected={onValue}>
                    <Text size="2">{ t('Insert') }</Text>
                </DropdownSelect.Option>
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const Mode = ({ fxId, controlSize }) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Mode') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
                    <ModeSelect fxId={fxId} controlSize={controlSize} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ fxId, controlSize: controlSizeProp }) => {
    const { has } = useFxInsertHas(fxId);
    const { textSize } = useUiSize();
    const controlSize = controlSizeProp ?? textSize;
    if (!has) return null;
    return <Mode fxId={fxId} controlSize={controlSize} />;
};

export { ModeSelect };
