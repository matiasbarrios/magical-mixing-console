// Requirements
import { Flex } from '@radix-ui/themes';
import { useOutputVolume } from '@magical-mixing/mixers-react';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import { minus60To0ToDecimal } from '../../../helpers/values';


// Exported
export default ({
    outputId, minWidth, fullWidth, trackStart, isVertical = false,
}) => {
    const { has, value } = useOutputVolume(outputId);

    if (has === false) return null;

    return (
        <Flex
            align="center"
            direction={isVertical ? 'column' : 'row'}
            flexGrow="1"
            minWidth={isVertical ? '0' : minWidth}
            width={fullWidth ? '100%' : undefined}
            height={isVertical ? '100%' : undefined}
            minHeight={isVertical ? '0' : undefined}
        >
            <Flex
                flexGrow="1"
                align="center"
                justify="center"
                minWidth={isVertical ? undefined : '0'}
                minHeight={isVertical ? '0' : undefined}
                width="100%"
            >
                <MeterSlider
                    meter={(
                        <Meter
                            value={value}
                            valueToDecimal={minus60To0ToDecimal}
                            valuesShow
                            isVertical={isVertical}
                        />
                    )}
                    trackStart={isVertical ? undefined : trackStart}
                    isVertical={isVertical}
                />
            </Flex>
        </Flex>
    );
};
