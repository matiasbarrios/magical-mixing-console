// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useBusGateSidechainType } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { useLanguage } from '../../../../../components/language';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';
import { GATE_INPUTS_WIDTH } from '../../../../../helpers/values';


// Exported
export default ({ busId }) => {
    const { t, translateTry } = useLanguage();

    const {
        has, value, set, options, get,
    } = useBusGateSidechainType(busId);

    const option = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Type', undefined, true) }
            </Text>
            <DropdownSelect.Root set={set}>
                <DropdownSelect.Trigger square variant="soft" maxWidth={GATE_INPUTS_WIDTH}>
                    {translateTry(option.name)}
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    {options.map(o => (
                        <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                            <Text size="2">{ translateTry(o.name) }</Text>
                        </DropdownSelect.Option>
                    ))}
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};
