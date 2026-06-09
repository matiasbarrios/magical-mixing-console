// Requirements
import { useCallback, useEffect, useMemo } from 'react';
import {
    Box, Button, Flex, Text,
} from '@radix-ui/themes';
import {
    useBusAssignableOutputs, useBusInputId, useBusOptions, useBusStereoLink,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useScreen } from '../../../../components/base/screen';
import { useUiSize } from '../../../../components/theme';
import { formatBusIdentifierShort } from '../../../bus/view/name';
import InputPicker from './inputPicker';
import OutputPicker from './outputPicker';


// Internal
const BusOption = ({ bus, selected, onSelect }) => {
    const { translateOption } = useLanguage();
    const { textSize } = useUiSize();

    const label = useMemo(() => {
        if (bus.type === 'secondary') {
            return formatBusIdentifierShort(bus.type, bus.number);
        }
        return translateOption(bus);
    }, [bus, translateOption]);

    const onClick = useCallback(() => {
        onSelect(bus.id);
    }, [bus.id, onSelect]);

    return (
        <Button
            size={textSize}
            variant="soft"
            color={selected ? 'blue' : 'gray'}
            onClick={onClick}
            style={{ width: '100%' }}
        >
            <Text size={textSize} wrap="nowrap">
                { label }
            </Text>
        </Button>
    );
};


// Exported
export default ({
    flow, busId, inputId, stereoLink, outputId,
    onSelect, onInputChange, onStereoLinkChange, onOutputChange,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { md, lg, xl } = useScreen();
    const { ofType, get } = useBusOptions();

    const gridStyle = useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: (md || lg || xl) ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        gap: 'var(--space-2)',
        width: '100%',
    }), [lg, md, xl]);
    const { has: hasInput, value: currentInputId } = useBusInputId(busId ?? 0);
    const { has: hasStereoLink, value: currentStereoLink } = useBusStereoLink(busId ?? 0);
    const { outputs: assignableOutputs, defaultOutputId } = useBusAssignableOutputs(busId);

    const buses = useMemo(() => {
        if (flow === 'monitor') return ofType('secondary');
        return [...ofType('channel'), ...ofType('line')];
    }, [flow, ofType]);

    useEffect(() => {
        if (busId === null) return;
        const bus = get(busId);
        if (flow === 'monitor' && bus?.type === 'secondary') {
            if (defaultOutputId !== null) {
                onOutputChange(defaultOutputId);
            } else if (assignableOutputs[0]) {
                onOutputChange(assignableOutputs[0].id);
            }
            return;
        }
        if (bus?.type === 'channel') {
            onInputChange(busId);
            return;
        }
        if (hasInput && currentInputId !== undefined) {
            onInputChange(currentInputId);
        }
        if (hasStereoLink && currentStereoLink !== undefined) {
            onStereoLinkChange(currentStereoLink);
        } else {
            onStereoLinkChange(false);
        }
    }, [
        assignableOutputs, busId, currentInputId, currentStereoLink, defaultOutputId, flow,
        get, hasInput, hasStereoLink, onInputChange, onOutputChange, onStereoLinkChange,
    ]);

    const handleSelect = useCallback((id) => {
        onSelect(id);
    }, [onSelect]);

    const options = useMemo(() => buses.map(bus => (
        <BusOption
            key={bus.id}
            bus={bus}
            selected={busId === bus.id}
            onSelect={handleSelect}
        />
    )), [buses, busId, handleSelect]);

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { flow === 'monitor' ? t('Which aux bus?') : t('Which bus?') }
            </Text>
            <Box style={gridStyle}>
                { options }
            </Box>
            {busId !== null && flow === 'monitor' && (
                <OutputPicker
                    busId={busId}
                    outputId={outputId}
                    onOutputChange={onOutputChange}
                />
            )}
            {busId !== null && flow !== 'monitor' && (
                <InputPicker
                    busId={busId}
                    inputId={inputId}
                    onInputChange={onInputChange}
                    stereoLink={stereoLink}
                    onStereoLinkChange={onStereoLinkChange}
                />
            )}
        </Flex>
    );
};
