// Requirements
import {
    useCallback, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
    useBusOptions, useBusToLevel, useBusToOptions, useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { useFallbackBusesSorted } from '../../../../../components/fallback';
import { minus90To10ToDecimal } from '../../../../../helpers/values';
import { PREVIEW_SENDS_ROAM_ID } from '../../../../../helpers/hotkeys/focusRoam';
import { MINI_PREVIEW_CHART_STYLE, MiniPreviewContainer } from './miniPreviewContainer';
import { useProcessingPreview } from './previewDialog';


// Same yellow as the EQ and gate mini charts.
const SEND_LEVEL_COLOR = '#FFE629';

const SEND_BAR_GAP_PX = 1;
const SEND_BAR_MAX_HEIGHT_PX = 3;

const SEND_BARS_STYLE = {
    position: 'absolute',
    inset: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
};

const sendTrackStyle = (heightPx, marginTop) => ({
    position: 'relative',
    flex: '0 0 auto',
    height: heightPx,
    marginTop,
    width: '100%',
    borderRadius: 1,
    backgroundColor: 'var(--gray-a6)',
    overflow: 'hidden',
});


// Internal
const sendFillStyle = ratio => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${ratio * 100}%`,
    backgroundColor: SEND_LEVEL_COLOR,
});


const useEqualBarLayout = (count) => {
    const ref = useRef(null);
    const [layout, setLayout] = useState({ height: 1, pad: 0 });

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || count < 1) return undefined;

        const measure = () => {
            const available = el.clientHeight;
            if (available <= 0) return;
            const gaps = SEND_BAR_GAP_PX * (count - 1);
            const raw = Math.floor((available - gaps) / count);
            const height = Math.max(1, Math.min(SEND_BAR_MAX_HEIGHT_PX, raw));
            const used = height * count + gaps;
            const pad = Math.max(0, Math.floor((available - used) / 2));
            setLayout(prev => (
                prev.height === height && prev.pad === pad ? prev : { height, pad }
            ));
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [count]);

    return { ref, height: layout.height, pad: layout.pad };
};


const SendLevelBar = ({
    busIdFrom, busIdTo, heightPx, marginTop,
}) => {
    const { has, value } = useBusToLevel(busIdFrom, busIdTo);

    const ratio = useMemo(() => {
        if (!has || value === undefined) return 0;
        return Math.min(1, Math.max(0, minus90To10ToDecimal(value)));
    }, [has, value]);

    if (has === false) return null;

    return (
        <div style={sendTrackStyle(heightPx, marginTop)} aria-hidden>
            <div style={sendFillStyle(ratio)} />
        </div>
    );
};


const SendLevelBars = ({ busIdFrom, busIds }) => {
    const { ref, height, pad } = useEqualBarLayout(busIds.length);

    return (
        <div ref={ref} style={SEND_BARS_STYLE}>
            {pad > 0 && <div style={{ height: pad, flexShrink: 0 }} aria-hidden />}
            {busIds.map((busIdTo, index) => (
                <SendLevelBar
                    key={busIdTo}
                    busIdFrom={busIdFrom}
                    busIdTo={busIdTo}
                    heightPx={height}
                    marginTop={index === 0 ? 0 : SEND_BAR_GAP_PX}
                />
            ))}
        </div>
    );
};


const levelSendBusIds = (sortedBuses, busesTo, get) => sortedBuses
    .filter(s => busesTo.some(b => b.id === s.id))
    .filter((s) => {
        const type = get(s.id)?.type;
        return type === 'secondary' || type === 'effect';
    })
    .map(s => s.id);


const Preview = ({ busIdFrom }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { openPreview } = useProcessingPreview();
    const { get } = useBusOptions();
    const { options: busesTo } = useBusToOptions(busIdFrom);
    const { sortedBuses } = useFallbackBusesSorted();

    const busIds = useMemo(() => levelSendBusIds(sortedBuses, busesTo, get),
        [sortedBuses, busesTo, get]);

    const onOpen = useCallback((e) => {
        e.stopPropagation();
        openPreview({ busId: busIdFrom, section: 'sends' });
    }, [busIdFrom, openPreview]);

    return (
        <MiniPreviewContainer
            aria-label={t('Sends')}
            onClick={onOpen}
            disabled={disabled}
            opacity={disabled ? 0.5 : 1}
            focusRoam={PREVIEW_SENDS_ROAM_ID}
        >
            <div style={MINI_PREVIEW_CHART_STYLE}>
                <SendLevelBars busIdFrom={busIdFrom} busIds={busIds} />
            </div>
        </MiniPreviewContainer>
    );
};


// Exported
export default Preview;
