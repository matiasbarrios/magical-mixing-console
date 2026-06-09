// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useBusCompressorEnvelope } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { useLanguage } from '../../../../../components/language';
import { COMPRESSOR_INPUTS_WIDTH } from '../../../../../helpers/values';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, options, get,
    } = useBusCompressorEnvelope(busId);

    const option = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Type', undefined, true) }
            </Text>
            <DropdownSelect.Root set={set}>
                <DropdownSelect.Trigger square variant="soft" maxWidth={COMPRESSOR_INPUTS_WIDTH}>
                    { t(option?.name, undefined, true).substring(0, 3) }
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    {options.map(o => (
                        <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                            <Text size="2">{ t(o.name, undefined, true) }</Text>
                        </DropdownSelect.Option>
                    ))}
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};
