// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { useLanguage } from '../../../components/language';
import { useHotkeys } from '../../../components/hotkeys/context';
import { HOTKEY_ACTION_IDS } from '../../../helpers/hotkeys/actions';
import HotkeyInput from './hotkeyInput';


// Internal
const HotkeyRow = ({ actionId, bindings, setBinding, resetBinding, actions }) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label wrap="pretty">
                    { t(actions[actionId].labelKey) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <HotkeyInput
                        binding={bindings[actionId]}
                        onChange={binding => setBinding(actionId, binding)}
                        onReset={() => resetBinding(actionId)}
                    />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ activeGroupKey }) => {
    const {
        bindings, setBinding, resetBinding, actions,
    } = useHotkeys();

    const actionIds = useMemo(() => HOTKEY_ACTION_IDS.filter((actionId) => {
        const groupKey = actions[actionId].groupKey ?? 'General';
        return groupKey === activeGroupKey;
    }), [actions, activeGroupKey]);

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            {actionIds.map(actionId => (
                <HotkeyRow
                    key={actionId}
                    actionId={actionId}
                    bindings={bindings}
                    setBinding={setBinding}
                    resetBinding={resetBinding}
                    actions={actions}
                />
            ))}
        </LabelControlTable.List>
    );
};
