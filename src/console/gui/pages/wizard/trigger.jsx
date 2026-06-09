// Requirements
import { useCallback } from 'react';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { HeaderIconButton } from '../../components/layout/header/iconButton';
import { ICON_STYLE } from '../../helpers/values';
import { noPointerDown } from '../../helpers/behaviour';
import { useSetupWizard } from './context';


// Exported
export default () => {
    const { isOnline, isHalted, disabled } = useDevice();
    const { wizardOpen, openWizard, closeWizard } = useSetupWizard();

    const toggleOpen = useCallback(() => {
        if (wizardOpen) closeWizard();
        else openWizard();
    }, [wizardOpen, closeWizard, openWizard]);

    if (!isOnline || isHalted) return null;

    return (
        <HeaderIconButton
            variant="ghost"
            color="green"
            onPointerDown={noPointerDown}
            onClick={toggleOpen}
            disabled={disabled}
        >
            <MagicWandIcon style={ICON_STYLE} />
        </HeaderIconButton>
    );
};
