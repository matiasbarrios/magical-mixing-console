// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useVault, useVaultName } from '../../../components/vault';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { DropdownMenuContent } from '../../../components/base/dropdownMenuContent';
import { useUiSize } from '../../../components/theme';


// Internal
const VaultMenuItem = ({ vaultId, onSelect }) => {
    const { vaultName } = useVaultName(vaultId);

    return (
        <DropdownMenu.Item onSelect={onSelect(vaultId)}>
            <Text size="2">{ vaultName }</Text>
        </DropdownMenu.Item>
    );
};


// Exported
export default ({ vaultId, vaultType, color = 'gray' }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { vaults } = useVault(vaultType);
    const { vaultName } = useVaultName(vaultId);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const others = useMemo(() => vaults.filter(v => v.vaultId !== vaultId),
        [vaults, vaultId]);

    const onSelect = useCallback(id => () => navigate(`/vault/${id}`), [navigate]);
    const goToList = useCallback(() => navigate(`/vault/list/${vaultType}`), [navigate, vaultType]);

    const hasOthers = others.length > 0;

    const label = (
        <Text size={textSize} color={color} wrap="nowrap">
            { vaultName }
        </Text>
    );

    if (!hasOthers) {
        return (
            <Flex align="center" mx="2">
                { label }
            </Flex>
        );
    }

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                variant="ghost"
                color={color}
                onClick={toggleOpened}
            >
                { label }
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                {others.map(v => (
                    <VaultMenuItem key={v.vaultId} vaultId={v.vaultId} onSelect={onSelect} />
                ))}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={goToList} disabled={disabled}>
                    { t('List') }
                </DropdownMenu.Item>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
