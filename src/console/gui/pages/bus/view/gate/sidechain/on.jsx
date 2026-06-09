// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useBusGateSidechain, useBusGateSidechainOn } from '@magical-mixing/mixers-react';
import { useCallback } from 'react';
import { useLanguage } from '../../../../../components/language';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';
import { GATE_INPUTS_WIDTH } from '../../../../../helpers/values';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    const { has } = useBusGateSidechain(busId);
    const {
        has: onHas,
        value: onValue,
        set: onSet,
    } = useBusGateSidechainOn(busId);

    const setBoolean = useCallback(v => onSet(!!v), [onSet]);

    if (!has || !onHas || onValue === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Sidechain', undefined, true) }
            </Text>
            <DropdownSelect.Root set={setBoolean}>
                <DropdownSelect.Trigger square variant="soft" maxWidth={GATE_INPUTS_WIDTH}>
                    { t(onValue ? 'On' : 'Off', 'short') }
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    <DropdownSelect.Option key="false" id={0} selected={!onValue}>
                        <Text size="2">{ t('Off', 'short') }</Text>
                    </DropdownSelect.Option>
                    <DropdownSelect.Option key="true" id={1} selected={onValue}>
                        <Text size="2">{ t('On', 'short') }</Text>
                    </DropdownSelect.Option>
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};
