// Requirements
import { useCallback } from 'react';
import {
    Button, Flex,
} from '@radix-ui/themes';
import {
    useDevice, useSceneScope, useSceneScopeOnAll,
} from '@magical-mixing/mixers-react';
import ListStack from '../../../components/layout/list/stack';
import ListPageShell from '../../../components/layout/list/shell';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import ScopeRow from './scopeRow';


// Internal
const ScopeFooter = ({ sceneId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { set } = useSceneScopeOnAll(sceneId);
    const onAll = useCallback(() => set(true), [set]);
    const onNone = useCallback(() => set(false), [set]);

    return (
        <Flex align="center" justify="end" gap="1">
            <Button size={textSize} variant="soft" color="gray" disabled={disabled} onClick={onAll}>
                { t('All') }
            </Button>
            <Button size={textSize} variant="soft" color="gray" disabled={disabled} onClick={onNone}>
                { t('None') }
            </Button>
        </Flex>
    );
};


// Exported
export default ({ sceneId }) => {
    const { has, options } = useSceneScope(sceneId);

    if (!has) return null;

    return (
        <ListPageShell>
            <ListStack>
                {options.map(i => (
                    <ScopeRow
                        key={i.id}
                        sceneId={sceneId}
                        element={i}
                    />
                ))}
            </ListStack>
            <ScopeFooter sceneId={sceneId} />
        </ListPageShell>
    );
};
