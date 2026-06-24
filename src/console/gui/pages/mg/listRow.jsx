// Requirements
import { useCallback } from 'react';
import { Flex, IconButton } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { EDIT_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import { useLanguage } from '../../components/language';
import { ICON_STYLE } from '../../helpers/values';
import { useUiSize } from '../../components/theme';
import ViewMg from './view/openMg';
import Mute from './view/mute';


// Exported
export default ({ mgId, onEdit }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const edit = useCallback((e) => {
        e.stopPropagation();
        onEdit(mgId);
    }, [onEdit, mgId]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <ViewMg mgId={mgId} />
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Mute mgId={mgId} dense />
                <IconButton
                    size={textSize}
                    variant="soft"
                    radius="full"
                    color="gray"
                    disabled={disabled}
                    onClick={edit}
                    aria-label={t('Edit')}
                    {...focusRoamAttrs(EDIT_ROAM_ID)}
                >
                    <Pencil1Icon style={ICON_STYLE} />
                </IconButton>
            </Flex>
        </Flex>
    );
};
