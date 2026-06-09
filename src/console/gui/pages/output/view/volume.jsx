// Requirements
import { Flex } from '@radix-ui/themes';
import { useOutputVolume } from '@magical-mixing/mixers-react';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import { minus60To0ToDecimal } from '../../../helpers/values';


// Exported
export default ({
    outputId, minWidth, fullWidth, trackStart,
}) => {
    const { has, value } = useOutputVolume(outputId);

    if (has === false) return null;

    return (
        <Flex
            align="center"
            flexGrow="1"
            minWidth={minWidth}
            width={fullWidth ? '100%' : undefined}
        >
            <MeterSlider
                meter={(
                    <Meter
                        value={value}
                        valueToDecimal={minus60To0ToDecimal}
                        valuesShow
                    />
                )}
                trackStart={trackStart}
            />
        </Flex>
    );
};
