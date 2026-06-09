// Requirements
import { Flex, Text } from '@radix-ui/themes';
import { useUiSize } from '../theme';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from './labelControlTable';
import TextFieldErasable from './textFieldErasable';


// Exported
export const NameEditRow = ({
    id,
    label,
    placeholder,
    value,
    set,
    onEnter,
    onChange,
    error,
    width = '100%',
    maxWidth = '16rem',
}) => {
    const { textSize } = useUiSize();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { label }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex direction="column" gapY="2" align="end" width="100%" minWidth="0">
                    <TextFieldErasable
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        set={set}
                        onEnter={onEnter}
                        onChange={onChange}
                        width={width}
                        maxWidth={maxWidth}
                    />
                    {!!error && <Text size={textSize} color="red">{ error }</Text>}
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};
