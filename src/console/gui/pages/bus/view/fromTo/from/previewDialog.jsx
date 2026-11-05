// Requirements
import {
    createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { Dialog, Flex, Separator, Text } from '@radix-ui/themes';
import DialogHeader from '../../../../../components/base/dialogHeader';
import { useScreen } from '../../../../../components/base/screen';
import { useLanguage } from '../../../../../components/language';
import { useEntityViewLayout, useUiSize } from '../../../../../components/theme';
import { BusIconNameLabeled } from '../../name';
import EqualizerView from '../../equalizer';
import CompressorView from '../../compressor';
import GateView from '../../gate';
import InputView from '../../input';
import To from '../to';


// Variables
const ProcessingPreviewContext = createContext(null);

const SECTION_LABEL_KEYS = {
    input: 'Input',
    eq: 'Equalizer',
    compressor: 'Compressor',
    gate: 'Gate',
    sends: 'Sends',
};

const DIALOG_MAX_WIDTH_SMALL = '720px';
const DIALOG_MAX_WIDTH_LARGE = '960px';
const DIALOG_CONTENT_HEIGHT_SMALL_PX = 280;
const DIALOG_CONTENT_HEIGHT_LARGE_PX = 480;


// Internal
const usePreviewDialogSize = () => {
    const { md, lg, xl } = useScreen();
    const isLarge = md || lg || xl;

    return useMemo(() => ({
        maxWidth: isLarge ? DIALOG_MAX_WIDTH_LARGE : DIALOG_MAX_WIDTH_SMALL,
        contentHeightPx: isLarge ? DIALOG_CONTENT_HEIGHT_LARGE_PX : DIALOG_CONTENT_HEIGHT_SMALL_PX,
        isNarrow: !isLarge,
    }), [isLarge]);
};


const SendsPreviewContent = ({ busId }) => {
    const { isVertical } = useEntityViewLayout();

    return (
        <Flex
            direction="column"
            flexGrow="1"
            minHeight="0"
            width="100%"
            height={isVertical ? '100%' : undefined}
            overflow={isVertical ? 'hidden' : undefined}
        >
            <To busId={busId} linkDestination={false} />
        </Flex>
    );
};


const PreviewContent = ({ section, busId }) => {
    if (section === 'input') return <InputView busId={busId} />;
    if (section === 'eq') return <EqualizerView busId={busId} />;
    if (section === 'compressor') return <CompressorView busId={busId} />;
    if (section === 'gate') return <GateView busId={busId} />;
    if (section === 'sends') return <SendsPreviewContent busId={busId} />;
    return null;
};


const PreviewDialog = ({
    busId, open, onOpenChange, section, sectionLabelKey, children,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { maxWidth, contentHeightPx, isNarrow } = usePreviewDialogSize();
    const sectionLabel = useMemo(() => t(sectionLabelKey), [t, sectionLabelKey]);
    const autoHeight = section === 'input';
    const fillViewport = isNarrow && (section === 'eq' || section === 'sends');

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content
                aria-describedby={undefined}
                className={fillViewport ? 'mmc-preview-dialog mmc-preview-dialog-fill' : 'mmc-preview-dialog'}
                p="2"
                maxWidth={maxWidth}
                width="100%"
            >
                <Flex flexShrink="0">
                    <DialogHeader mb="1">
                        <Flex align="center" gap="1" minWidth="0">
                            <BusIconNameLabeled busId={busId} />
                            <Separator orientation="vertical" size="1" />
                            <Text size={textSize} color="gray" weight="regular">{ sectionLabel }</Text>
                        </Flex>
                    </DialogHeader>
                </Flex>
                {open && (
                    <Flex
                        direction="column"
                        flexGrow={fillViewport ? '1' : '0'}
                        flexShrink="1"
                        height={autoHeight || fillViewport ? undefined : `${contentHeightPx}px`}
                        maxHeight={autoHeight || fillViewport ? undefined : `${contentHeightPx}px`}
                        minHeight="0"
                        overflow={fillViewport ? 'hidden' : 'auto'}
                        width="100%"
                        style={fillViewport ? { minHeight: '10rem' } : undefined}
                    >
                        { children }
                    </Flex>
                )}
            </Dialog.Content>
        </Dialog.Root>
    );
};


const PreviewDialogHost = ({ apiRef }) => {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);

    const openPreview = useCallback(({ busId, section }) => {
        setPreview({ busId, section });
        setOpen(true);
    }, []);

    const closePreview = useCallback(() => {
        setOpen(false);
        setPreview(null);
    }, []);

    const handleOpenChange = useCallback((nextOpen) => {
        if (nextOpen) setOpen(true);
        else closePreview();
    }, [closePreview]);

    useLayoutEffect(() => {
        apiRef.current = { openPreview, closePreview };
    }, [apiRef, openPreview, closePreview]);

    const sectionLabelKey = preview ? SECTION_LABEL_KEYS[preview.section] : null;

    if (!preview) return null;

    return (
        <PreviewDialog
            busId={preview.busId}
            open={open}
            onOpenChange={handleOpenChange}
            section={preview.section}
            sectionLabelKey={sectionLabelKey}
        >
            <PreviewContent section={preview.section} busId={preview.busId} />
        </PreviewDialog>
    );
};


// Exported
export const ProcessingPreviewProvider = ({ children }) => {
    const hostApiRef = useRef({
        openPreview: () => {},
        closePreview: () => {},
    });

    const value = useMemo(() => ({
        openPreview: args => hostApiRef.current.openPreview(args),
        closePreview: () => hostApiRef.current.closePreview(),
    }), []);

    return (
        <ProcessingPreviewContext.Provider value={value}>
            { children }
            <PreviewDialogHost apiRef={hostApiRef} />
        </ProcessingPreviewContext.Provider>
    );
};


export const useProcessingPreview = () => {
    const context = useContext(ProcessingPreviewContext);
    if (!context) {
        throw new Error('useProcessingPreview must be used within ProcessingPreviewProvider');
    }
    return context;
};
