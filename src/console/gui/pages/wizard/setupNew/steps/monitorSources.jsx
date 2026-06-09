// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import ApplyToggle from '../../../../components/base/applyToggle';
import { BusIconNameLabeled } from '../../../bus/view/name';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';


// Internal
const SourceRow = ({ busId, enabled, onToggle }) => {
    const { textSize } = useUiSize();
    const onCheckedChange = useCallback((checked) => {
        onToggle(busId, checked);
    }, [busId, onToggle]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    <BusIconNameLabeled busId={busId} size={textSize} />
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%">
                    <ApplyToggle checked={enabled} onCheckedChange={onCheckedChange} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ monitorSources, onMonitorSourcesChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { ofType } = useBusOptions();

    const channels = useMemo(() => ofType('channel'), [ofType]);

    const onToggle = useCallback((channelBusId, enabled) => {
        onMonitorSourcesChange({
            ...monitorSources,
            [channelBusId]: enabled,
        });
    }, [monitorSources, onMonitorSourcesChange]);

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { t('Which channels feed this monitor mix?') }
            </Text>
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {channels.map(bus => (
                    <SourceRow
                        key={bus.id}
                        busId={bus.id}
                        enabled={!!monitorSources[bus.id]}
                        onToggle={onToggle}
                    />
                ))}
            </LabelControlTable.List>
        </Flex>
    );
};
