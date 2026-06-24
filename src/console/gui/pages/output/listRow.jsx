// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useOutputTap } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../components/language';
import ViewOutput from './view/openOutput';
import { SourceViewSelect } from './view/source';
import { TapDropdown } from './view/tap';
import Volume from './view/volume';


// Internal
const LevelTrackStart = ({ label }) => (
    <Text size="1" color="gray" wrap="nowrap">
        { label }
    </Text>
);


// Exported
export default ({ outputId, inlineSource = false }) => {
    const { t } = useLanguage();

    const { has: tapHas } = useOutputTap(outputId);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const levelTrackStart = useMemo(() => (
        <LevelTrackStart label={t('Level')} />
    ), [t]);

    const source = (
        <Flex
            flexShrink="0"
            minWidth={inlineSource ? '0' : undefined}
            onPointerDown={stopRowOpen}
            onClick={stopRowOpen}
        >
            <SourceViewSelect outputId={outputId} />
        </Flex>
    );

    const mainRow = (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <ViewOutput outputId={outputId} />
            </Flex>
            <Flex
                flexGrow="1"
                minWidth="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Volume outputId={outputId} minWidth="0" fullWidth trackStart={levelTrackStart} />
            </Flex>
            {inlineSource && source}
            {tapHas && (
                <Flex
                    flexShrink="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <TapDropdown outputId={outputId} showValue abbreviate />
                </Flex>
            )}
        </Flex>
    );

    if (inlineSource) {
        return (
            <Flex width="100%" minWidth="0">
                { mainRow }
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            gapY="1"
            width="100%"
            minWidth="0"
        >
            { mainRow }
            <Flex align="center" justify="end" gapX="1" wrap="wrap" minWidth="0" pl="2">
                { source }
            </Flex>
        </Flex>
    );
};
