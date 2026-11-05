// Requirements
import { Box, Flex, Text } from '@radix-ui/themes';
import {
    useBusInputId, useBusInputTrimPost, useBusInputVolume, useBusOptions, useBusToMeter,
    useInputGainPost, useOutputOptions, useOutputVolume,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { Meter } from '../../components/base/meterSlider';
import { minus60To0ToDecimal } from '../../helpers/values';


// Internal
const MeterBar = ({ value }) => {
    if (value === undefined) return null;

    return (
        <Box width="100%" height="12px" position="relative">
            <Meter flush value={value} valueToDecimal={minus60To0ToDecimal} />
        </Box>
    );
};


const MeterRead = ({ label, value }) => (
    <Flex direction="column" gap="1" minWidth="0">
        <Text size="1" color="gray">{ label }</Text>
        <MeterBar value={value} />
    </Flex>
);


const InputVolumeMeter = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusInputVolume(busId);

    if (!has) return null;

    return <MeterRead label={t('Input meter')} value={value} />;
};


const InputGainMeter = ({ inputId }) => {
    const { t } = useLanguage();
    const { has, value } = useInputGainPost(inputId);

    if (!has) return null;

    return <MeterRead label={t('Input meter')} value={value} />;
};


const InputTrimMeter = ({ busId, inputId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusInputTrimPost(busId, inputId);

    if (!has) return null;

    return <MeterRead label={t('Input meter')} value={value} />;
};


const InputMeters = ({ busId, inputId }) => (
    <>
        <InputVolumeMeter busId={busId} />
        {inputId != null && <InputGainMeter inputId={inputId} />}
        {inputId != null && <InputTrimMeter busId={busId} inputId={inputId} />}
    </>
);


const SendMeter = ({ busId, mainId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusToMeter(busId, mainId);

    if (!has) return null;

    return <MeterRead label={t('Level to Main')} value={value} />;
};


const OutputMeter = ({ outputId }) => {
    const { t } = useLanguage();
    const { has, value } = useOutputVolume(outputId);

    if (!has) return null;

    return <MeterRead label={t('Main output meter')} value={value} />;
};


const Meters = ({ busId }) => {
    const { t } = useLanguage();
    const { mainOne } = useBusOptions();
    const { options } = useOutputOptions();
    const { has, value } = useBusInputId(busId);
    const outputId = options.find(option => option.type === 'main')?.id;
    const inputId = has ? value : undefined;
    const mainId = mainOne?.id;

    return (
        <Flex direction="column" gap="2">
            <Text size="1" color="gray">
                { t('If the input meter does not move, the mixer is not receiving the source') }
            </Text>
            <InputMeters busId={busId} inputId={inputId} />
            {mainId != null && <SendMeter busId={busId} mainId={mainId} />}
            {outputId != null && <OutputMeter outputId={outputId} />}
        </Flex>
    );
};


// Exported
export { Meters };
