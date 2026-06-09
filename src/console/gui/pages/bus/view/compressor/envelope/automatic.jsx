// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useBusCompressorAutomatic } from '@magical-mixing/mixers-react';
import { useCallback } from 'react';
import { useLanguage } from '../../../../../components/language';
import { COMPRESSOR_INPUTS_WIDTH } from '../../../../../helpers/values';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusCompressorAutomatic(busId);

    const setBoolean = useCallback(v => set(!!v), [set]);

    if (!has || value === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Envelope', undefined, true) }
            </Text>
            <DropdownSelect.Root set={setBoolean}>
                <DropdownSelect.Trigger square variant="soft" maxWidth={COMPRESSOR_INPUTS_WIDTH}>
                    { t(value ? 'Auto' : 'Manual', undefined, true) }
                </DropdownSelect.Trigger>
                <DropdownSelect.Content>
                    <DropdownSelect.Option key="true" id={1} selected={value}>
                        <Text size="2">{ t('Automatic', undefined, true) }</Text>
                    </DropdownSelect.Option>
                    <DropdownSelect.Option key="false" id={0} selected={!value}>
                        <Text size="2">{ t('Manual', undefined, true) }</Text>
                    </DropdownSelect.Option>
                </DropdownSelect.Content>
            </DropdownSelect.Root>
        </Flex>
    );
};
