// Requirements
import { Dialog } from '@radix-ui/themes';
import { useSceneOptions } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { NameEdit } from './name';


// Exported
export default ({ sceneId, open, onOpenChange }) => {
    const { t } = useLanguage();
    const { get } = useSceneOptions();
    const element = useMemo(() => get(sceneId), [get, sceneId]);

    if (!element) return null;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { `${t('Scene')} ${element.number}` }
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <NameEdit sceneId={sceneId} onEnter={() => onOpenChange(false)} />
                </LabelControlTable.List>
            </Dialog.Content>
        </Dialog.Root>
    );
};
