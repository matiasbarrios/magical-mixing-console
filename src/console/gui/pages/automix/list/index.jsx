// Requirements
import { useCallback } from 'react';
import { IconButton } from '@radix-ui/themes';
import {
    useAutomixReset, useBusAutomixResetAll, useDevice,
} from '@magical-mixing/mixers-react';
import ResetIcon from '../../../components/base/resetIcon';
import { useLanguage } from '../../../components/language';
import ListPageShell from '../../../components/layout/list/shell';
import { useListHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import { Alert } from '../../../components/base/alert';
import ListFooter from '../../../components/layout/list/footer';
import { useUiSize } from '../../../components/theme';
import Buses from './buses';
import Strip from './strip';


// Internal
const ResetAll = () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useAutomixReset();
    const { resetAll: busesAutomixResetAll } = useBusAutomixResetAll();

    const doReset = useCallback(async () => {
        await reset();
        await busesAutomixResetAll();
    }, [reset, busesAutomixResetAll]);

    return (
        <Alert onAccept={doReset} accept={t('Restore automix')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Restore automix')}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


// Exported
export default () => {
    const { t } = useLanguage();

    useListHeaderTrail(t('Automix'));

    return (
        <ListPageShell>
            <Strip />
            <Buses />
            <ListFooter reset={<ResetAll />} />
        </ListPageShell>
    );
};
