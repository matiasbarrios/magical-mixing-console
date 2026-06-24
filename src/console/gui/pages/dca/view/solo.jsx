// Requirements
import { useCallback, useMemo } from 'react';
import { IconButton } from '@radix-ui/themes';
import { useBusOptions, useBusToOnMonitorSetMany, useDevice } from '@magical-mixing/mixers-react';
import { Power } from 'lucide-react';
import { useLanguage } from '../../../components/language';
import { ICON_STYLE } from '../../../helpers/values';
import { useUiSize } from '../../../components/theme';
import { LetterIconButton } from '../../../components/base/letterIconButton';
import { FallbackBusDcaOn, FallbackDcaSolo, useFallbackBusDca } from '../../../components/fallback';


// Internal
const DcaBusesOnEvaluateHasAndOn = ({ busId, dcaId, children }) => {
    const { has } = useFallbackBusDca(busId);
    if (!has) return children(false);
    return (
        <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
            {({ has: hasOn, value: valueOn }) => children(hasOn && valueOn)}
        </FallbackBusDcaOn>
    );
};


const DcaBusesOnEvaluate = ({
    dcaId, options, currentIndex = 0, busesOnIds = [], children,
}) => {
    if (currentIndex === options.length) {
        return children(busesOnIds);
    }

    const { id: busId } = options[currentIndex];

    return (
        <DcaBusesOnEvaluateHasAndOn busId={busId} dcaId={dcaId}>
            {hasAndOn => (
                <DcaBusesOnEvaluate
                    dcaId={dcaId}
                    options={options}
                    currentIndex={currentIndex + 1}
                    busesOnIds={!hasAndOn ? busesOnIds : [...busesOnIds, busId]}
                >
                    {children}
                </DcaBusesOnEvaluate>
            )}
        </DcaBusesOnEvaluateHasAndOn>
    );
};


const DcaBusesOn = ({ dcaId, children }) => {
    const { options } = useBusOptions();
    return (
        <DcaBusesOnEvaluate dcaId={dcaId} options={options}>
            {busesOnIds => children(busesOnIds)}
        </DcaBusesOnEvaluate>
    );
};


const SoloBusesSet = ({ busesOnIds, children }) => {
    const { set } = useBusToOnMonitorSetMany(busesOnIds);

    const setBusesToOn = useCallback((value, toggle) => () => {
        set(value);
        toggle();
    }, [set]);

    return children(setBusesToOn);
};


// Exported
const Solo = ({
    dcaId, has, value, toggle, asOn, dense = false,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const color = useMemo(() => {
        if (asOn) return (!value ? 'red' : 'gray');
        return value ? 'yellow' : 'gray';
    }, [value, asOn]);

    if (!has) return null;

    const renderButton = (onClick) => {
        if (asOn) {
            return (
                <IconButton
                    size={textSize}
                    variant="soft"
                    radius="full"
                    color={color}
                    disabled={disabled}
                    onClick={onClick}
                >
                    <Power style={ICON_STYLE} />
                </IconButton>
            );
        }

        return (
            <LetterIconButton
                letter="S"
                color={color}
                disabled={disabled}
                onClick={onClick}
                aria-label={t('Solo on')}
                aria-pressed={value}
                dense={dense}
                focusRoam="solo"
            />
        );
    };

    return (
        <DcaBusesOn dcaId={dcaId}>
            {busesOnIds => (
                <SoloBusesSet busesOnIds={busesOnIds}>
                    {setBusesToOn => renderButton(setBusesToOn(!value, toggle))}
                </SoloBusesSet>
            )}
        </DcaBusesOn>
    );
};


export default ({ dcaId, asOn, dense = false }) => (
    <FallbackDcaSolo dcaId={dcaId}>
        {({ has, value, toggle }) => (
            <Solo
                dcaId={dcaId}
                has={has}
                value={value}
                toggle={toggle}
                asOn={asOn}
                dense={dense}
            />
        )}
    </FallbackDcaSolo>
);
