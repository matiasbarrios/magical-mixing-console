// Requirements
import { useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../../components/language';
import TextFieldErasable from '../../../../components/base/textFieldErasable';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { useUiSize } from '../../../../components/theme';
import { getSetupType } from '../options';


// Exported
export default ({
    flow, setupTypeId, busId, who, onWhoChange,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const setupType = useMemo(() => getSetupType(setupTypeId), [setupTypeId]);

    if (!setupType || busId === null) return null;

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { flow === 'monitor'
                    ? t('For whom is it? (optional)')
                    : t('Who is it? (optional)') }
            </Text>
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                <LabelControlTable.Row>
                    <LabelControlTable.Cell width={LABEL_WIDTH}>
                        <Label>
                            { t('Name') }
                        </Label>
                    </LabelControlTable.Cell>
                    <LabelControlTable.Cell>
                        <Flex align="center" justify="end" width="100%" minWidth="0">
                            <TextFieldErasable
                                id="setup-who"
                                value={who}
                                set={onWhoChange}
                                debounceTime={0}
                                width="100%" maxWidth="16rem"
                            />
                        </Flex>
                    </LabelControlTable.Cell>
                </LabelControlTable.Row>
            </LabelControlTable.List>
        </Flex>
    );
};
