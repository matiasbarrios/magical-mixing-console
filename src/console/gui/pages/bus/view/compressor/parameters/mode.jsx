// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useBusCompressorMode } from '@magical-mixing/mixers-react';
import { useCallback, useMemo } from 'react';
import { useLanguage } from '../../../../../components/language';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';
import { COMPRESSOR_INPUTS_WIDTH } from '../../../../../helpers/values';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();

    const {
        has, value, set, options, get,
    } = useBusCompressorMode(busId);

    const option = useMemo(() => get(value), [get, value]);

    const translateOption = useCallback((s) => {
        if (s === 'Compressor') return t('Compressor', undefined, true).substring(0, 4);
        return t(s, undefined, true).substring(0, 3);
    }, [t]);

    if (!has || value === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Mode', undefined, true) }
            </Text>
            <DropdownSelect.Root set={set}>
                <DropdownSelect.Trigger square variant="soft" maxWidth={COMPRESSOR_INPUTS_WIDTH}>
                    { translateOption(option.name) }
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
