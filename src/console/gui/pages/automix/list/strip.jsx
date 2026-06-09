// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useAutomixOptions } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { useUiSize } from '../../../components/theme';
import On from './on';
import Lock from './lock';


// Internal
const GroupSegment = ({ element }) => {
    const { textSize } = useUiSize();

    return (
        <Flex
            align="center"
            justify="center"
            gapX="2"
            px="2"
            py="1"
        >
            <Text size={textSize} weight="medium" color="gray">
                { element.name }
            </Text>
            <Flex align="center" gapX="1" flexShrink="0">
                <On automixId={element.id} />
                <Lock automixId={element.id} />
            </Flex>
        </Flex>
    );
};


// Exported
export default () => {
    const { noneOption, options } = useAutomixOptions();

    const optionsFinal = useMemo(() => options
        .filter(o => o.id !== noneOption.id), [noneOption, options]);

    return (
        <Flex align="center" justify="center" gapX="2" width="100%" minWidth="0">
            {optionsFinal.map(o => (
                <GroupSegment key={o.id} element={o} />
            ))}
        </Flex>
    );
};
