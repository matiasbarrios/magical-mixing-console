// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusStereoLink, useBusToLevel, useBusToOn, useBusToPan, useBusToTap,
} from '@magical-mixing/mixers-react';
import { useScreen } from '../../../../../../components/base/screen';
import { useUiSize } from '../../../../../../components/theme';
import { useLanguage } from '../../../../../../components/language';
import { TapDropdown } from '../../tap';
import Pan from '../../pan';
import Level from '../../level';
import DisableOnOrLevelAbove from '../../disableOnOrLevelAbove';
import { DestinationBusNameArea } from '../openTo';


// Internal
const CenteredRow = ({ children }) => (
    <Flex justify="center" align="center" width="100%" flexShrink="0" minWidth="0">
        { children }
    </Flex>
);


const ColumnInner = ({ busIdFrom, busIdTo, linkDestination }) => {
    const { t } = useLanguage();
    const { xs, sm } = useScreen();
    const { meterSliderTrackSizePx, knobSizePx } = useUiSize();

    const { has: tapHas } = useBusToTap(busIdFrom, busIdTo);
    const { has: onHas, value: on } = useBusToOn(busIdFrom, busIdTo);
    const { has: panHas } = useBusToPan(busIdFrom, busIdTo);
    const { has: levelHas } = useBusToLevel(busIdFrom, busIdTo);

    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const extended = useMemo(() => (!onHas || on) && (panHas || levelHas),
        [onHas, on, panHas, levelHas]);

    const showFader = levelHas && extended;

    const showStereoPan = extended && stereoLinked && stereoLinkPair && panHas;

    const columnWidth = useMemo(() => {
        let sidePadding = 27;
        let minWidth = 51;
        let stereoGap = 12;

        if (xs) {
            sidePadding = 15;
            minWidth = 44;
            stereoGap = 6;
        } else if (sm) {
            sidePadding = 20;
            minWidth = 48;
            stereoGap = 8;
        }

        const base = Math.max(minWidth, meterSliderTrackSizePx + sidePadding);
        if (showStereoPan) {
            return Math.max(base, knobSizePx * 2 + stereoGap);
        }
        return base;
    }, [meterSliderTrackSizePx, knobSizePx, showStereoPan, xs, sm]);

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
            <DisableOnOrLevelAbove
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
                ariaLabel={t('Remove from sends')}
            />
            {showFader ? (
                <Flex
                    flexGrow="1"
                    align="center"
                    justify="center"
                    minHeight="0"
                    width="100%"
                >
                    <Level
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                        busIdStereoLinked={stereoLinked ? stereoLinkPair : undefined}
                        isVertical
                        minWidth="0"
                    />
                </Flex>
            ) : (
                <Flex flexGrow="1" minHeight="0" />
            )}
            <Flex direction="column" align="center" gapY="1" flexShrink="0" width="100%" minWidth="0">
                {tapHas && (
                    <CenteredRow>
                        <TapDropdown
                            busIdFrom={busIdFrom}
                            busIdTo={busIdTo}
                            iconTrigger
                        />
                    </CenteredRow>
                )}
                {extended && panHas && (
                    <CenteredRow>
                        <Flex align="center" justify="center" gapX="1">
                            <Pan busIdFrom={busIdFrom} busIdTo={busIdTo} />
                            {showStereoPan && (
                                <Pan
                                    busIdFrom={stereoLinkPair}
                                    busIdTo={busIdTo}
                                />
                            )}
                        </Flex>
                    </CenteredRow>
                )}
                <CenteredRow>
                    <DestinationBusNameArea
                        busIdTo={busIdTo}
                        truncate
                        showIdentifier={!!linkDestination}
                    />
                </CenteredRow>
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busIdFrom, busIdTo, linkDestination }) => (
    <ColumnInner
        busIdFrom={busIdFrom}
        busIdTo={busIdTo}
        linkDestination={linkDestination}
    />
);
