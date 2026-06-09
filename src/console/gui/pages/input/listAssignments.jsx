// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    useBusInputId, useBusOptions, useOutputOptions, useOutputSource,
} from '@magical-mixing/mixers-react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { BusIconName } from '../bus/view/name';
import { useOutputNameTranslated } from '../output/view/name';


// Variables
const AssignmentLineContext = createContext(null);


// Internal
const AssignmentLine = ({ label, children }) => {
    const { textSize } = useUiSize();
    const [visibleKeys, setVisibleKeys] = useState(() => new Set());

    const setItemVisible = useCallback((key, visible) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            if (visible) next.add(key);
            else next.delete(key);
            if (next.size === prev.size && [...next].every(k => prev.has(k))) return prev;
            return next;
        });
    }, []);

    const ctx = useMemo(() => ({ setItemVisible }), [setItemVisible]);

    return (
        <AssignmentLineContext.Provider value={ctx}>
            <Flex
                align="baseline"
                gapX="1"
                wrap="wrap"
                width="100%"
                display={visibleKeys.size > 0 ? 'flex' : 'none'}
            >
                <Text size={textSize} color="gray" as="span" className="mmc-shrink-0">
                    { `${label}:` }
                </Text>
                <Flex align="center" wrap="wrap" className="mmc-assignment-names" minWidth="0">
                    { children }
                </Flex>
            </Flex>
        </AssignmentLineContext.Provider>
    );
};


const useAssignmentVisible = (key, visible) => {
    const ctx = useContext(AssignmentLineContext);

    useEffect(() => {
        if (!ctx) return undefined;
        ctx.setItemVisible(key, visible);
        return () => ctx.setItemVisible(key, false);
    }, [ctx, key, visible]);
};


const AssignedBusName = ({ busId, inputId }) => {
    const { textSize } = useUiSize();
    const { has, value } = useBusInputId(busId);
    const visible = has && value === inputId;

    useAssignmentVisible(`bus-${busId}`, visible);

    if (!visible) return null;

    return (
        <Flex as="span" display="inline-flex">
            <BusIconName busId={busId} size={textSize} />
        </Flex>
    );
};


const AssignedOutputName = ({ outputId, inputId }) => {
    const { textSize } = useUiSize();
    const { name } = useOutputNameTranslated(outputId);
    const {
        has, value, options,
    } = useOutputSource(outputId);

    const sourceOption = useMemo(() => options
        .find(o => o.type === 'input' && o.externalId === inputId), [options, inputId]);

    const visible = has && sourceOption != null && value === sourceOption.id;

    useAssignmentVisible(`output-${outputId}`, visible);

    if (!visible) return null;

    return (
        <Text size={textSize} color="gray" as="span">
            { name }
        </Text>
    );
};


const AssignedBusesLine = ({ inputId }) => {
    const { t } = useLanguage();
    const { options } = useBusOptions();

    return (
        <AssignmentLine label={t('Buses')}>
            {options.map(o => (
                <AssignedBusName key={o.id} busId={o.id} inputId={inputId} />
            ))}
        </AssignmentLine>
    );
};


const AssignedOutputsLine = ({ inputId }) => {
    const { t } = useLanguage();
    const { options } = useOutputOptions();

    if (!options.length) return null;

    return (
        <AssignmentLine label={t('Outputs')}>
            {options.map(o => (
                <AssignedOutputName key={o.id} outputId={o.id} inputId={inputId} />
            ))}
        </AssignmentLine>
    );
};


// Exported
export default ({ inputId }) => (
    <Flex direction="column" gapY="1" width="100%">
        <AssignedBusesLine inputId={inputId} />
        <AssignedOutputsLine inputId={inputId} />
    </Flex>
);
