// Requirements
import { useChanges } from '@magical-mixing/mixers-react';
import {
    ApplyProgressDialog, formatProgressEta, useProgressEta,
} from '../base/applyProgressDialog';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Internal
// Bulk applies (device reset, bus reset, scene load) schedule dozens or hundreds of
// changes; presets and parametric resets stay below this and skip the dialog.
const CHANGES_PROGRESS_THRESHOLD = 50;


export const useChangesApplyProgress = ({ threshold = CHANGES_PROGRESS_THRESHOLD } = {}) => {
    const {
        changesRemaining, changesTotal, batchTotal, syncPending, awaitingDesk,
    } = useChanges();

    const changesDone = batchTotal - changesRemaining;
    const total = batchTotal + syncPending;
    const completed = changesDone;
    const open = batchTotal >= threshold && (
        changesTotal > 0 || awaitingDesk || syncPending > 0
    );

    return {
        open,
        total,
        completed,
    };
};


export const ChangesProgressDialog = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { open, total, completed } = useChangesApplyProgress();
    const secondsRemaining = useProgressEta({ open, total, completed });
    const eta = secondsRemaining !== null ? formatProgressEta(secondsRemaining) : undefined;

    return (
        <ApplyProgressDialog
            open={open}
            title={t('Applying changes')}
            total={total}
            completed={completed}
            eta={eta}
            textSize={textSize}
        />
    );
};
