// Requirements
import { useCallback, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import Mute from '../../../dca/view/mute';
import Solo from '../../../dca/view/solo';
import { DcaIconNameLink } from '../../../dca/view/name';
import Edit from '../edit';


// Exported
export const DcaFrom = ({ dcaId }) => {
    const [editOpened, setEditOpened] = useState(false);
    const openEdit = useCallback(() => setEditOpened(true), []);
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
                <DcaIconNameLink dcaId={dcaId} size="1" onContextMenu={openEdit} />
                {!!editOpened && <Edit dcaId={dcaId} open onOpenChange={setEditOpened} />}
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Solo dcaId={dcaId} dense />
                <Mute dcaId={dcaId} dense />
            </Flex>
        </Flex>
    );
};
