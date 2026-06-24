// Requirements
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import ConditionalScrollY from '../../components/base/conditionalScrollY';
import { LabelControlTable, LABEL_CONTROL_CLASS } from '../../components/base/labelControlTable';
import { useLanguage } from '../../components/language';
import { EntityTabsShell, useEntityTabs } from '../../components/layout/entity/tabs';
import HeaderTabBar from '../../components/layout/entity/headerTabBar';
import EntityViewShell from '../../components/layout/entity/shell';
import { useEntityHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import { useHeaderTrailCenter } from '../../components/layout/headerTrail/hooks/useHeaderTrailCenter';
import { useVault } from '../../components/vault';
import Values from './view/values';


// Internal
const useParsedParams = () => {
    const { vaultId } = useParams();
    return { vaultId };
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

    const headerTabPicker = useMemo(() => (
        tabs.length > 0
            ? (
                <HeaderTabBar
                    tabs={tabs}
                    active={tabActive}
                    onChange={onTabChange}
                />
            )
            : null
    ), [tabs, tabActive, onTabChange]);

    useHeaderTrailCenter(headerTabPicker);

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
                tabPanelMt="3"
                hideTabBar
            >
                {tabActive === 'values' && (
                    <ConditionalScrollY>
                        {!!vaultContent && (
                            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                                <Values content={vaultContent} />
                            </LabelControlTable.List>
                        )}
                    </ConditionalScrollY>
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
