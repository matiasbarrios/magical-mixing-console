// Requirements
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import { EntityTabsShell, TabPanelScrollable, useEntityTabs } from '../../components/layout/entity/tabs';
import EntityViewShell from '../../components/layout/entity/shell';
import { useEntityHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import { useVault } from '../../components/vault';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../components/base/labelControlTable';
import { fromCamelCaseToUCFirst } from '../../helpers/format';


// Internal
const useParsedParams = () => {
    const { vaultId } = useParams();
    return { vaultId };
};


const ValueRow = ({ label, value }) => {
    const { t } = useLanguage();

    const displayValue = useMemo(() => {
        if (typeof value === 'boolean') return value ? t('Yes') : t('No');
        return value;
    }, [value, t]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { label }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <Text size="1" color="gray" wrap="nowrap">{ displayValue }</Text>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const Content = ({ content }) => {
    const keys = useMemo(() => Object.keys(content), [content]);

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            {keys.map(key => (
                <ValueRow
                    key={key}
                    label={fromCamelCaseToUCFirst(key)}
                    value={content[key]}
                />
            ))}
        </LabelControlTable.List>
    );
};


const Vault = ({ vault }) => {
    const { t } = useLanguage();
    const { vaultId, vaultType } = vault;
    const { vaults, vaultLoad } = useVault(vaultType);
    const tabs = useMemo(() => [
        { id: 'values', label: t('Values') },
    ], [t]);

    const { tabActive, onTabChange } = useEntityTabs({
        tabs,
        settingsKey: 'vault-view-tab',
        defaultTab: 'values',
    });

    const [vaultContent, setVaultContent] = useState(null);

    useEffect(() => {
        const loadVault = async () => {
            const contents = await vaultLoad(vaultId);
            setVaultContent(contents);
        };
        loadVault();
    }, [vaultLoad, vaultId]);

    const previous = useMemo(() => {
        const index = vaults.findIndex(d => d.vaultId === vaultId);
        return index > 0 ? vaults[index - 1] : null;
    }, [vaults, vaultId]);

    const next = useMemo(() => {
        const index = vaults.findIndex(d => d.vaultId === vaultId);
        return index < vaults.length - 1 ? vaults[index + 1] : null;
    }, [vaults, vaultId]);

    const instance = useMemo(() => ({
        vaultId,
        vaultType,
    }), [vaultId, vaultType]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/vault/${previous.vaultId}`,
        next: next && `/vault/${next.vaultId}`,
    });

    return (
        <EntityViewShell>
            <EntityTabsShell
                tabs={tabs}
                tabActive={tabActive}
                onTabChange={onTabChange}
            >
                {tabActive === 'values' && (
                    <TabPanelScrollable>
                        {!!vaultContent && <Content content={vaultContent} />}
                    </TabPanelScrollable>
                )}
            </EntityTabsShell>
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { vaultId } = useParsedParams();
    const { vaults } = useVault();
    const vault = useMemo(() => vaults.find(v => v.vaultId === vaultId), [vaults, vaultId]);

    if (!vault) return null;

    return <Vault vault={vault} />;
};
