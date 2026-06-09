// Requirements
import { useCallback } from 'react';
import { Flex } from '@radix-ui/themes';
import { useDevice, useSceneScopeOn } from '@magical-mixing/mixers-react';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';
import { useLanguage } from '../../../components/language';
import { Label } from '../../../components/base/labelControlTable';
import { ucFirst } from '../../../helpers/format';


// Internal
const useSceneScopeFinalName = (element) => {
    const { t } = useLanguage();
    let res = t(ucFirst(element.category));
    if (element.subcategory) res += ` | ${t(ucFirst(element.subcategory))}`;
    if (element.type) res += ` | ${t(ucFirst(element.type))} ${element.number}`;
    return res.trim();
};


// Exported
export default ({ sceneId, element }) => {
    const { disabled } = useDevice();
    const name = useSceneScopeFinalName(element);
    const { has: onHas, value: on, toggle } = useSceneScopeOn(sceneId, element.id);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0" minWidth="0">
                <Label>
                    { name }
                </Label>
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            {onHas && (
                <Flex
                    flexShrink="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <ActiveToggleButton active={on} onClick={toggle} disabled={disabled} labels="onOff" />
                </Flex>
            )}
        </Flex>
    );
};
