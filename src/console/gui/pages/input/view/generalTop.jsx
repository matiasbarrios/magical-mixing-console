// Requirements
import { Flex } from '@radix-ui/themes';
import { useInputGain, useInputPhantom } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import EditButton from './editButton';
import Phantom from './phantom';
import Gain from './gain';


// Exported
export default ({ inputId }) => {
    const { t } = useLanguage();
    const { has: gainHas } = useInputGain(inputId);
    const { has: phantomHas } = useInputPhantom(inputId);

    return (
        <Flex align="center" gapX="1" width="100%" minWidth="0" wrap="nowrap">
            <EditButton inputId={inputId} />
            {gainHas && (
                <Flex flexGrow="1" minWidth="0" width="100%">
                    <Gain inputId={inputId} minWidth="0" fullWidth label={t('Gain')} />
                </Flex>
            )}
            {phantomHas && (
                <Flex flexShrink="0">
                    <Phantom inputId={inputId} />
                </Flex>
            )}
        </Flex>
    );
};
