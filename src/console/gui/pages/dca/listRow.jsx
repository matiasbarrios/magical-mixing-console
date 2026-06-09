// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { ICON_STYLE } from '../../helpers/values';
import { useUiSize } from '../../components/theme';
import { DcaViewDca } from './view/openDca';
import { DcaIconName } from './view/name';
import Mute from './view/mute';
import Level from './view/level';


const LevelTrackStart = ({ dcaId, label }) => (
    <Flex align="center" gapX="1" wrap="nowrap">
        <DcaIconName dcaId={dcaId} size="1" hideIdentifier />
        <Text size="1" color="gray" wrap="nowrap">
            { label }
        </Text>
    </Flex>
);


// Exported
export default ({ dcaId, onEdit }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const edit = useCallback((e) => {
        e.stopPropagation();
        onEdit(dcaId);
    }, [onEdit, dcaId]);

    const levelTrackStart = useMemo(() => (
        <LevelTrackStart dcaId={dcaId} label={t('Level')} />
    ), [dcaId, t]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <DcaViewDca dcaId={dcaId} />
            </Flex>
            <Flex
                flexGrow="1"
                minWidth="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Level
                    dcaId={dcaId}
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
                <Mute dcaId={dcaId} dense />
                <IconButton
                    size={textSize}
                    variant="soft"
                    radius="full"
                    color="gray"
                    disabled={disabled}
                    onClick={edit}
                    aria-label={t('Edit')}
                >
                    <Pencil1Icon style={ICON_STYLE} />
                </IconButton>
            </Flex>
        </Flex>
    );
};
