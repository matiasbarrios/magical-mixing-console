// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useBusLevel } from '@magical-mixing/mixers-react';
import { useScreen } from '../../../../../components/base/screen';
import { useUiSize } from '../../../../../components/theme';
import { SourceBusNameArea, SourceIcon } from '../../../../bus/view/fromTo/from/openFrom';
import Level from '../../../../bus/view/level';
import { BusActions, UnassignBus } from '../shared';


// Internal
const CenteredRow = ({ children }) => (
    <Flex justify="center" align="center" width="100%" flexShrink="0" minWidth="0">
        { children }
    </Flex>
);


const ColumnInner = ({ busId, onHas, on, set }) => {
    const { xs, sm, isXSLandscape } = useScreen();
    const { meterSliderTrackSizePx } = useUiSize();
    const { has: levelHas } = useBusLevel(busId);

    const showFader = useMemo(() => on && levelHas, [on, levelHas]);

    const columnWidth = useMemo(() => {
        let sidePadding = 27;
        let minWidth = 51;

        if (xs) {
            sidePadding = 15;
            minWidth = 44;
        } else if (sm) {
            sidePadding = 20;
            minWidth = 48;
        }

        return Math.max(minWidth, meterSliderTrackSizePx + sidePadding);
    }, [meterSliderTrackSizePx, xs, sm]);

    return (
        <Flex
            direction="column"
            align="center"
            flexShrink="0"
            width={`${columnWidth}px`}
            minWidth={`${columnWidth}px`}
            height="100%"
            gapY="1"
        >
            <CenteredRow>
                <UnassignBus set={set} />
            </CenteredRow>
            {showFader ? (
                <Flex
                    flexGrow="1"
                    align="center"
                    justify="center"
                    minHeight="0"
                    width="100%"
                >
                    <Level
                        busId={busId}
                        isVertical
                        minWidth="0"
                    />
                </Flex>
            ) : (
                <Flex flexGrow="1" minHeight="0" />
            )}
            <Flex direction="column" align="center" gapY="2" flexShrink="0" width="100%" minWidth="0">
                <CenteredRow>
                    <BusActions
                        busId={busId}
                        onHas={onHas}
                        on={on}
                        set={set}
                        stacked
                    />
                </CenteredRow>
                {!showFader && (
                    <CenteredRow>
                        <SourceIcon busIdFrom={busId} />
                    </CenteredRow>
                )}
                <CenteredRow>
                    <SourceBusNameArea
                        busIdFrom={busId}
                        truncate
                        showIdentifier={!isXSLandscape}
                    />
                </CenteredRow>
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId, onHas, on, set }) => (
    <ColumnInner busId={busId} onHas={onHas} on={on} set={set} />
);
