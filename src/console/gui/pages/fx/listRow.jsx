// Requirements
import { useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useFxInsertHas, useFxInsertOn } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ViewFx from './view/openFx';
import { FxInsert } from './view/insert';
import { FxBus } from './view/bus';
import { useFxTypeName } from './view/type';


// Internal
const RowMeta = ({ fxId, insertHas, controlSize }) => {
    const { t } = useLanguage();
    const { has: onHas, value: onValue } = useFxInsertOn(fxId);
    const inserted = useMemo(() => onHas && onValue, [onHas, onValue]);
    const { name: typeName } = useFxTypeName(fxId);

    const modeLabel = useMemo(() => {
        if (!insertHas || !onHas || onValue === undefined) return null;
        return onValue ? t('Insert') : t('In effect bus');
    }, [insertHas, onHas, onValue, t]);

    return (
        <Flex align="center" gapX="2" flexShrink="0" wrap="nowrap" minWidth="0">
            {modeLabel && (
                <Text size={controlSize} color="gray" wrap="nowrap">
                    { modeLabel }
                </Text>
            )}
            {inserted ? (
                <FxInsert fxId={fxId} controlSize={controlSize} />
            ) : (
                <FxBus fxId={fxId} controlSize={controlSize} />
            )}
            {typeName && (
                <Text size={controlSize} color="gray" wrap="nowrap">
                    { typeName }
                </Text>
            )}
        </Flex>
    );
};


// Exported
export default ({ fxId }) => {
    const { has: insertHas } = useFxInsertHas(fxId);
    const { textSize: controlSize } = useUiSize();

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <ViewFx fxId={fxId} />
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <RowMeta fxId={fxId} insertHas={insertHas} controlSize={controlSize} />
        </Flex>
    );
};
