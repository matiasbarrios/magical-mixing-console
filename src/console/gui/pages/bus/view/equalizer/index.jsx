// Requirements
import { Flex, Skeleton } from '@radix-ui/themes';
import { useBusEqualizer, useBusEqualizerMode } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import Parametric from './parametric';
import Graphic from './graphic';
import True from './true';
import Options from './options';
import { EqualizerProvider } from './context';


const graphicAreaStyle = {
    minWidth: 0,
    position: 'relative',
};

const Equalizer = ({ busId }) => {
    const { has: modeHas, is: modeIs } = useBusEqualizerMode(busId);

    // If it doesent have mode (which indicates which type of equalizer
    // is available), all will be tried, only one should be shown
    const isParametric = useMemo(() => !modeHas || modeIs('Parametric'), [modeIs, modeHas]);
    const isGraphic = useMemo(() => !modeHas || modeIs('Graphic'), [modeIs, modeHas]);
    const isTrue = useMemo(() => !modeHas || modeIs('True'), [modeIs, modeHas]);

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" minWidth="0" width="100%" height="100%" gapY="2">
            <Flex
                direction="column"
                flexGrow="1"
                minHeight="0"
                minWidth="0"
                width="100%"
                overflow="hidden"
                style={graphicAreaStyle}
            >
                {!isParametric && !isGraphic && !isTrue && (
                    <Skeleton width="100%" height="100%" />
                )}
                {isParametric && <Parametric busId={busId} height="100%" />}
                {isGraphic && <Graphic busId={busId} height="100%" />}
                {isTrue && <True busId={busId} height="100%" />}
            </Flex>
            <Flex align="start" flexShrink="0" py="1" width="100%" overflow="visible">
                <Options busId={busId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId }) => {
    const { has } = useBusEqualizer(busId);
    if (!has) return null;
    return (
        <EqualizerProvider>
            <Equalizer busId={busId} />
        </EqualizerProvider>
    );
};
