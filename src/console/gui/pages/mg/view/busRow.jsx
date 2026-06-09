// Requirements
import { useCallback } from 'react';
import { Flex, IconButton } from '@radix-ui/themes';
import { MinusIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { FallbackBusMgOn } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { BusIconNameLink } from '../../bus/view/name';
import Mute from '../../bus/view/mute';
import { ICON_STYLE } from '../../../helpers/values';


// Internal
const UnassignBus = ({ set }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={() => set(false)}
            disabled={disabled}
            aria-label={t('Unassign bus')}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const BusRowInner = ({
    busId, onHas, on, set,
}) => {
    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <BusIconNameLink busId={busId} size="1" variant="ghost" />
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                {onHas && on && <Mute busId={busId} />}
                {onHas && <UnassignBus set={set} />}
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId, mgId }) => (
    <FallbackBusMgOn busId={busId} mgId={mgId}>
        {({ has: onHas, value: on, set }) => (
            <BusRowInner busId={busId} onHas={onHas} on={on} set={set} />
        )}
    </FallbackBusMgOn>
);
