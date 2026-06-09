// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { DragHandleDots2Icon, Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { ICON_STYLE } from '../../helpers/values';
import { useUiSize } from '../../components/theme';
import {
    SourceIcon, SourceMute, SourceSolo, SourceViewBus,
} from './view/fromTo/openFrom';
import Level from './view/level';


// Constants
const dragButtonStyle = {
    cursor: 'grab',
};


const LevelTrackStart = ({ busId, label }) => (
    <Flex align="center" gapX="1" wrap="nowrap">
        <SourceIcon busIdFrom={busId} hideIdentifier size="1" />
        <Text size="1" color="gray" wrap="nowrap">
            { label }
        </Text>
    </Flex>
);


// Internal
const QuickActions = ({
    busId, disabled, onEdit, editLabel, textSize,
}) => (
    <Flex align="center" gapX="1" flexShrink="0">
        <SourceSolo busIdFrom={busId} />
        <SourceMute busIdFrom={busId} />
        <IconButton
            size={textSize}
            variant="soft"
            radius="full"
            color="gray"
            disabled={disabled}
            onClick={onEdit}
            aria-label={editLabel}
        >
            <Pencil1Icon style={ICON_STYLE} />
        </IconButton>
    </Flex>
);


const DragHandle = ({
    disabled, attributes, listeners, setActivatorNodeRef, textSize,
}) => (
    <IconButton
        size={textSize}
        variant="ghost"
        radius="full"
        color="gray"
        disabled={disabled}
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
        style={dragButtonStyle}
    >
        <DragHandleDots2Icon style={ICON_STYLE} />
    </IconButton>
);


// Exported
export default ({
    busId, onEdit, setNodeRef, sortableStyle, dragHandle,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const {
        attributes, listeners, setActivatorNodeRef,
    } = dragHandle;

    const edit = useCallback((e) => {
        e.stopPropagation();
        onEdit(busId);
    }, [onEdit, busId]);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const levelTrackStart = useMemo(() => (
        <LevelTrackStart busId={busId} label={t('Level')} />
    ), [busId, t]);

    return (
        <div ref={setNodeRef} style={sortableStyle}>
            <Flex
                align="center"
                gapX="1"
                width="100%"
                wrap="nowrap"
                minWidth="0"
            >
                <DragHandle
                    disabled={disabled}
                    attributes={attributes}
                    listeners={listeners}
                    setActivatorNodeRef={setActivatorNodeRef}
                    textSize={textSize}
                />
                <Flex
                    flexShrink="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <SourceViewBus busIdFrom={busId} />
                </Flex>
                <Flex
                    flexGrow="1"
                    minWidth="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <Level
                        busId={busId}
                        minWidth="0"
                        fullWidth
                        trackStart={levelTrackStart}
                        label=""
                    />
                </Flex>
                <Flex
                    align="center"
                    gapX="1"
                    flexShrink="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <QuickActions
                        busId={busId}
                        disabled={disabled}
                        onEdit={edit}
                        editLabel={t('Edit')}
                        textSize={textSize}
                    />
                </Flex>
            </Flex>
        </div>
    );
};
