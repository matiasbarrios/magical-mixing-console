// Requirements
import {
    useBusInput, useBusInputId, useBusInputTrim, useDevice, useBusInputVolume,
    useBusInputTrimPost, useInputGain, useInputPhantom,
} from '@magical-mixing/mixers-react';
import {
    Box, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { useCallback, useMemo, useState } from 'react';
import { scaleLinear } from 'd3';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import {
    minus60To0ToDecimal, ONE, ICON_STYLE, ICON_SPACER,
} from '../../../helpers/values';
import Phantom from '../../input/view/phantom';
import Gain from '../../input/view/gain';
import { useInputNameTranslated } from '../../input/view/name';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const VolumeMeter = ({ busId }) => {
    const { value } = useBusInputVolume(busId);
    return (
        <Meter value={value} valueToDecimal={minus60To0ToDecimal} valuesShow />
    );
};


const Volume = ({ busId, label }) => {
    const { has } = useBusInputVolume(busId);

    if (!has) return null;

    return (
        <Flex align="center" flexGrow="1" minWidth="0">
            <MeterSlider meter={<VolumeMeter busId={busId} />} trackStart={label} />
        </Flex>
    );
};


const TrimPostMeter = ({ busId, inputId }) => {
    const { has, value } = useBusInputTrimPost(busId, inputId);
    if (!has) return null;
    return (
        <Meter
            value={value}
            valueToDecimal={minus60To0ToDecimal}
            valuesShow
        />
    );
};


const Trim = ({ busId, inputId, label }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { name } = useInputNameTranslated(inputId);
    const {
        has, value, set, minimum, maximum,
    } = useBusInputTrim(busId, inputId);

    const gainToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToGain = useMemo(() => gainToDecimal.invert, [gainToDecimal]);

    if (!has) return null;

    const ariaLabel = `${t('Trim')}: ${name}`;

    return (
        <Flex align="center" flexGrow="1" minWidth="0">
            <MeterSlider
                value={value}
                set={set}
                minimum={minimum}
                maximum={maximum}
                valueToDecimal={gainToDecimal}
                decimalToValue={decimalToGain}
                ariaLabel={ariaLabel}
                disabled={disabled}
                valueShowAlways
                trackStart={label}
                meter={<TrimPostMeter busId={busId} inputId={inputId} />}
            />
        </Flex>
    );
};


const InputName = ({ input }) => {
    const { translateOption } = useLanguage();
    const name = useMemo(() => translateOption(input), [input, translateOption]);
    return <Text size="2">{ name }</Text>;
};


const InputSelect = ({ busId }) => {
    const {
        value, set, options, get,
    } = useBusInputId(busId);
    const { t, translateOption } = useLanguage();
    const { disabled } = useDevice();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const selected = useMemo(() => (value !== undefined && value !== null ? get(value) : undefined),
        [get, value]);

    const displayValue = useMemo(() => {
        if (selected) return translateOption(selected);
        if (value === null) {
            const nullOption = options.find(o => o.id === null);
            if (nullOption) return translateOption(nullOption);
        }
        return '';
    }, [selected, value, options, translateOption]);

    const onSelect = useCallback(inputId => () => {
        if (disabled) return;
        set(inputId);
    }, [disabled, set]);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                variant="soft"
                color="gray"
                onClick={toggleOpened}
                className="mmc-btn-nowrap"
            >
                <Text size="1" color="gray" weight="regular" wrap="nowrap">
                    { displayValue }
                </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>
                    <Flex align="center" gapX="1">
                        <Box {...ICON_SPACER} />
                        <Text size="2">{ t('Input') }</Text>
                    </Flex>
                </DropdownMenu.Label>
                {options.map((o) => {
                    const selectedOption = o.id === value;
                    return (
                        <DropdownMenu.Item key={o.id === null ? 'null' : String(o.id)} onSelect={onSelect(o.id)}>
                            <Flex align="center" gapX="1" flexGrow="1">
                                {selectedOption && (
                                    <CheckIcon style={ICON_STYLE} />
                                )}
                                {!selectedOption && <Box {...ICON_SPACER} />}
                                <InputName input={o} />
                            </Flex>
                        </DropdownMenu.Item>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const InputSelectRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has } = useBusInputId(busId);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Input') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <InputSelect busId={busId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const InputSelectRows = ({ busId }) => {
    const { has } = useBusInputId(busId);

    if (!has) return null;

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            <InputSelectRow busId={busId} />
        </LabelControlTable.List>
    );
};


const GainWithPhantom = ({ inputId }) => {
    const { t } = useLanguage();
    const { has: gainHas } = useInputGain(inputId);
    const { has: phantomHas } = useInputPhantom(inputId);

    if (!gainHas && !phantomHas) return null;

    return (
        <Flex my="2" align="center" gapX="1" width="100%" minWidth="0">
            <Flex align="center" flexGrow="1" minWidth="0">
                <Gain inputId={inputId} minWidth="0" fullWidth label={t('Gain')} />
            </Flex>
            <Flex align="center" flexShrink="0">
                <Phantom inputId={inputId} />
            </Flex>
        </Flex>
    );
};


const InputLayout = ({ sliders }) => (
    <Flex
        align={{ initial: 'stretch', sm: 'center' }}
        gapX="1"
        gapY="2"
        flexGrow="1"
        minWidth="0"
        width={{ initial: '100%', sm: 'auto' }}
        direction={{ initial: 'column', sm: 'row' }}
    >
        { sliders }
    </Flex>
);


const VolumeSlider = ({ busId }) => {
    const { t } = useLanguage();
    const { has: volumeHas } = useBusInputVolume(busId);

    if (!volumeHas) return null;

    return (
        <InputLayout sliders={<Volume busId={busId} label={t('Volume')} />} />
    );
};


const TrimVolumeSliders = ({ busId, inputId }) => {
    const { t } = useLanguage();
    const { has: trimHas, value: trimValue } = useBusInputTrim(busId, inputId);
    const { has: volumeHas } = useBusInputVolume(busId);

    const trimHasValue = useMemo(() => trimHas && trimValue !== undefined, [trimHas, trimValue]);

    if (!trimHasValue && !volumeHas) return null;

    return (
        <InputLayout
            sliders={(
                <>
                    {trimHasValue && (
                        <Trim busId={busId} inputId={inputId} label={t('Trim')} />
                    )}
                    {volumeHas && (
                        <Volume busId={busId} label={t('Volume')} />
                    )}
                </>
            )}
        />
    );
};


const InputElement = ({ busId, input }) => (
    <Flex direction="column" gap="2" width="100%">
        <GainWithPhantom inputId={input.id} />
        <InputSelectRows busId={busId} />
        <TrimVolumeSliders busId={busId} inputId={input.id} />
    </Flex>
);


const Input = ({ busId }) => {
    const { textSize } = useUiSize();
    const { has, value, get } = useBusInputId(busId);

    const input = useMemo(() => (value !== undefined && value !== null ? get(value) : undefined),
        [get, value]);

    if (!has) return null;

    if (value === undefined) {
        return (
            <Text size={textSize} color="gray">
                &nbsp;
            </Text>
        );
    }

    if (value === null) {
        return (
            <Flex direction="column" gap="2" width="100%">
                <InputSelectRows busId={busId} />
                <VolumeSlider busId={busId} />
            </Flex>
        );
    }

    return <InputElement busId={busId} input={input} />;
};


// Exported
export { InputSelect };

export default ({ busId }) => {
    const { has } = useBusInput(busId);
    if (!has) return null;
    return <Input busId={busId} />;
};
