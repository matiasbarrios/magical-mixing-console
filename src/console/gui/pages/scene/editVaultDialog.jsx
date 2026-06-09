// Requirements
import { useCallback } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { useVault, useVaultName } from '../../components/vault';
import DialogHeader from '../../components/base/dialogHeader';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../components/base/labelControlTable';


// Exported
export default ({
    vaultType, vaultId, open, onOpenChange,
}) => {
    const { t } = useLanguage();
    const { removeNonValidNameCharacters } = useVault(vaultType);
    const { vaultName, setVaultName } = useVaultName(vaultId);

    const dialogClose = useCallback(() => onOpenChange(false), [onOpenChange]);

    const doSetVaultName = useCallback(async (name) => {
        if (!name.trim()) return;
        await setVaultName(name);
    }, [setVaultName]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Edit name') }
                </DialogHeader>
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <LabelControlTable.Row>
                        <LabelControlTable.Cell width={LABEL_WIDTH}>
                            <Label>
                                { t('Name') }
                            </Label>
                        </LabelControlTable.Cell>
                        <LabelControlTable.Cell>
                            <Flex align="center" justify="end" width="100%" minWidth="0">
                                <TextFieldErasable
                                    id="vault-name"
                                    placeholder={t('Name')}
                                    value={vaultName}
                                    set={doSetVaultName}
                                    onChange={removeNonValidNameCharacters}
                                    onEnter={dialogClose}
                                    width="100%" maxWidth="16rem"
                                />
                            </Flex>
                        </LabelControlTable.Cell>
                    </LabelControlTable.Row>
                </LabelControlTable.List>
            </Dialog.Content>
        </Dialog.Root>
    );
};
