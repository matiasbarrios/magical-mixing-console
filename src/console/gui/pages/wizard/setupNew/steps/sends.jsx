// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useBusOptions, useBusToOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import ApplyToggle from '../../../../components/base/applyToggle';
import { BusIconNameLabeled } from '../../../bus/view/name';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';


// Internal
const SendRow = ({ busId, checked, onCheckedChange }) => {
    const { textSize } = useUiSize();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    <BusIconNameLabeled busId={busId} size={textSize} />
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%">
                    <ApplyToggle checked={checked} onCheckedChange={onCheckedChange} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ busId, sends, onSendsChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { mainOne } = useBusOptions();
    const { options: toOptions } = useBusToOptions(busId);

    const auxBuses = useMemo(() => toOptions.filter(o => o.type === 'secondary'),
        [toOptions]);

    const setMain = useCallback((main) => {
        onSendsChange({ ...sends, main });
    }, [onSendsChange, sends]);

    const setAux = useCallback(auxBusId => (enabled) => {
        onSendsChange({
            ...sends,
            aux: { ...sends.aux, [auxBusId]: enabled },
        });
    }, [onSendsChange, sends]);

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { t('Where to send?') }
            </Text>
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {mainOne && (
                    <SendRow
                        busId={mainOne.id}
                        checked={sends.main}
                        onCheckedChange={setMain}
                    />
                )}
                {auxBuses.map(bus => (
                    <SendRow
                        key={bus.id}
                        busId={bus.id}
                        checked={!!sends.aux[bus.id]}
                        onCheckedChange={setAux(bus.id)}
                    />
                ))}
            </LabelControlTable.List>
        </Flex>
    );
};
