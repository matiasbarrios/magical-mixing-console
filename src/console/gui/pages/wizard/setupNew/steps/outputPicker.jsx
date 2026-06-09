// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Box, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { useBusAssignableOutputs } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { ICON_STYLE, ICON_SPACER } from '../../../../helpers/values';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { useUiSize } from '../../../../components/theme';
import { useOutputNameTranslated } from '../../../output/view/name';
import { DropdownMenuContent } from './../../../../components/base/dropdownMenuContent';


// Internal
const OutputMenuLabel = ({ outputId }) => {
    const { name } = useOutputNameTranslated(outputId);
    return name;
};


// Exported
export default ({ busId, outputId, onOutputChange }) => {
    const { t, translateOption } = useLanguage();
    const { textSize, menuContentSize } = useUiSize();
    const { outputs } = useBusAssignableOutputs(busId);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const selected = useMemo(() => outputs.find(o => o.id === outputId),
        [outputId, outputs]);

    const displayValue = useMemo(() => {
        if (selected) return translateOption(selected);
        return t('Output');
    }, [selected, t, translateOption]);

    const onSelect = useCallback(id => () => {
        onOutputChange(id);
    }, [onOutputChange]);

    if (!outputs.length) return null;

    return (
        <LabelControlTable.List>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Output') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%">
                        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                            <DropdownMenuTrigger
                                square
                                variant="soft"
                                color="gray"
                                onClick={toggleOpened}
                                className="mmc-btn-nowrap"
                            >
                                <Text size={textSize} color="gray" wrap="nowrap">
                                    { displayValue }
                                </Text>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent size={menuContentSize}>
                                <DropdownMenu.Label>
                                    <Flex align="center" gapX="1">
                                        <Box {...ICON_SPACER} />
                                        <Text size={textSize}>{ t('Output') }</Text>
                                    </Flex>
                                </DropdownMenu.Label>
                                {outputs.map((o) => {
                                    const isSelected = o.id === outputId;
                                    return (
                                        <DropdownMenu.Item
                                            key={o.id}
                                            onSelect={onSelect(o.id)}
                                        >
                                            <Flex align="center" gapX="1" flexGrow="1">
                                                {isSelected && <CheckIcon style={ICON_STYLE} />}
                                                {!isSelected && <Box {...ICON_SPACER} />}
                                                <Text size={textSize}>
                                                    <OutputMenuLabel outputId={o.id} />
                                                </Text>
                                            </Flex>
                                        </DropdownMenu.Item>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu.Root>
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
        </LabelControlTable.List>
    );
};
