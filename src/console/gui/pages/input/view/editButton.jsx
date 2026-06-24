// Requirements
import { useCallback, useState } from 'react';
import { IconButton } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { EDIT_ROAM_ID, focusRoamAttrs } from '../../../helpers/hotkeys/focusRoam';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { ICON_STYLE } from '../../../helpers/values';
import Edit, { useInputEdit } from './edit';


// Exported
export default ({ inputId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { has: editHas } = useInputEdit(inputId);
    const [open, setOpen] = useState(false);
    const openEdit = useCallback(() => setOpen(true), []);

    if (!editHas) return null;

    return (
        <>
            <IconButton
                size={textSize}
                variant="soft"
                radius="full"
                color="gray"
                disabled={disabled}
                onClick={openEdit}
                aria-label={t('Edit')}
                {...focusRoamAttrs(EDIT_ROAM_ID)}
            >
                <Pencil1Icon style={ICON_STYLE} />
            </IconButton>
            {!!open && (
                <Edit inputId={inputId} open={open} onOpenChange={setOpen} />
            )}
        </>
    );
};
