// Requirements
import { useCallback, useMemo } from 'react';
import {
    Box, Button, Flex, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { FreshStartDialog } from '../../../../components/base/freshStartDialog';
import { FallbackIcon } from '../../../../components/fallback/shared/icon';
import { useUiSize } from '../../../../components/theme';
import { useSetupWizard } from '../../context';
import { SETUP_TYPES } from '../options';


// Constants
const TYPE_ICON_SIZE = 24;

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-2)',
    width: '100%',
};


const buttonStyle = {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    gap: '2px',
    paddingTop: 'var(--space-2)',
    paddingBottom: 'var(--space-2)',
};


// Internal
const TypeOption = ({ type, selected, onSelect }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const onClick = useCallback(() => {
        onSelect(type.id);
    }, [onSelect, type.id]);

    const color = type.color || 'gray';

    return (
        <Button
            size={textSize}
            variant="ghost"
            color={color}
            onClick={onClick}
            style={{
                ...buttonStyle,
                ...(selected ? { boxShadow: '0 0 0 2px var(--accent-9)' } : {}),
            }}
        >
            <FallbackIcon
                has
                value={type.icon}
                width={TYPE_ICON_SIZE}
                height={TYPE_ICON_SIZE}
                color={color}
            />
            <Text size={textSize} weight={selected ? 'bold' : 'medium'} wrap="pretty">
                { t(type.nameKey) }
            </Text>
        </Button>
    );
};


const FreshStartOption = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const { runFreshStart } = useSetupWizard();

    const doFreshStart = useCallback(() => {
        runFreshStart({ closeWizardFirst: true });
    }, [runFreshStart]);

    return (
        <FreshStartDialog onAccept={doFreshStart}>
            {doOpen => (
                <Button
                    size={textSize}
                    variant="outline"
                    color="gray"
                    onClick={doOpen}
                    disabled={disabled}
                    style={{ width: '100%' }}
                >
                    { t('Start in a new place') }
                </Button>
            )}
        </FreshStartDialog>
    );
};


// Exported
export default ({ setupTypeId, onSelect }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const handleSelect = useCallback((id) => {
        onSelect(id);
    }, [onSelect]);

    const options = useMemo(() => SETUP_TYPES.map(type => (
        <TypeOption
            key={type.id}
            type={type}
            selected={setupTypeId === type.id}
            onSelect={handleSelect}
        />
    )), [setupTypeId, handleSelect]);

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { t('Pick what you want to set up') }
            </Text>
            <Box style={gridStyle}>
                { options }
            </Box>
            <FreshStartOption />
        </Flex>
    );
};
