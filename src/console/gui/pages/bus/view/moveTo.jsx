// Requirements
import { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    AlertDialog, Button, Flex, Text,
} from '@radix-ui/themes';
import {
    BUS_MOVE_CAPTURE_FAILED,
    BUS_MOVE_NOT_CHANNEL,
    BUS_MOVE_PREAMP,
    BUS_MOVE_STEREO_LINK,
    useBusMove,
    useBusOptions,
    useBusStereoLink,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { FallbackContext } from '../../../components/fallback/context';
import { useUiSize } from '../../../components/theme';
import { formatBusIdentifierShort } from './name';


// Constants
const MOVE_DESCRIPTION = 'Overwrites the destination channel and restores this one. Input assignment and outputs stay, so move the cable to the new input. Gain and phantom move with the channel.';

const MOVE_DESCRIPTION_BUS = 'Overwrites the destination bus, including who sends to it, and restores this one. Outputs stay.';

const READ_FAILED = 'Could not read this channel. Nothing was changed.';

const READ_FAILED_BUS = 'Could not read this bus. Nothing was changed.';

const PREAMP_FAILED = 'The destination input cannot take this channel\'s gain and phantom. Nothing was changed.';

const MOVABLE_TYPES = ['channel', 'secondary'];


// Internal
const fallbackKey = busId => `bus-${busId}`;


const MoveTargetOption = ({ option }) => {
    const { textSize } = useUiSize();
    const { has, value } = useBusStereoLink(option.id);
    const unavailable = has !== true || value === undefined || !!value;

    return (
        <DropdownSelect.Option id={option.id} disabled={unavailable} noWhiteSpace>
            <Text size={textSize}>
                { formatBusIdentifierShort(option.type, option.number) }
            </Text>
        </DropdownSelect.Option>
    );
};


// Exported
const MoveTo = ({ busId, onMoved, onBusy }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { get, ofType } = useBusOptions();
    const bus = useMemo(() => get(busId), [get, busId]);
    const { has: stereoHas, value: stereoValue } = useBusStereoLink(busId);
    const { move } = useBusMove(busId);
    const { icons, setIcons, colors, setColors } = useContext(FallbackContext);

    const [pendingId, setPendingId] = useState(null);
    const [moving, setMoving] = useState(false);
    const [error, setError] = useState(null);

    const targets = useMemo(() => {
        if (!bus || !MOVABLE_TYPES.includes(bus.type)) return [];
        return ofType(bus.type).filter(option => option.id !== busId);
    }, [bus, ofType, busId]);
    const pending = useMemo(() => targets.find(option => option.id === pendingId) || null,
        [targets, pendingId]);
    const isSecondary = bus?.type === 'secondary';
    const sourceLinked = !!(stereoHas && stereoValue);

    const setBusy = useCallback((busy) => {
        setMoving(busy);
        if (onBusy) onBusy(busy);
    }, [onBusy]);

    const onPick = useCallback((id) => {
        if (moving) return;
        setError(null);
        setPendingId(id);
    }, [moving]);

    const onConfirmOpenChange = useCallback((open) => {
        if (!open) setPendingId(null);
    }, []);

    const onAccept = useCallback(async () => {
        const destId = pendingId;
        if (destId === null || moving) return;

        setError(null);
        setBusy(true);
        try {
            const result = await move(destId);
            if (!result.ok) {
                setError(result.reason);
                return;
            }

            const fromKey = fallbackKey(busId);
            const toKey = fallbackKey(destId);
            setIcons({
                ...icons,
                [toKey]: icons[fromKey] ?? null,
                [fromKey]: null,
            });
            setColors({
                ...colors,
                [toKey]: colors[fromKey] ?? null,
                [fromKey]: null,
            });
            onMoved();
            navigate(`/bus/${destId}`);
        } catch (e) {
            console.error('Channel move', e.message);
            setError(BUS_MOVE_CAPTURE_FAILED);
        } finally {
            setBusy(false);
        }
    }, [
        pendingId, moving, setBusy, move, busId, icons, setIcons, colors, setColors,
        onMoved, navigate,
    ]);

    const errorText = useMemo(() => {
        if (error === BUS_MOVE_PREAMP) return t(PREAMP_FAILED);
        if (error === BUS_MOVE_STEREO_LINK) return t('Unlink to move');
        if (error === BUS_MOVE_CAPTURE_FAILED || error === BUS_MOVE_NOT_CHANNEL) {
            return t(isSecondary ? READ_FAILED_BUS : READ_FAILED);
        }
        return null;
    }, [error, isSecondary, t]);

    if (!bus || !MOVABLE_TYPES.includes(bus.type)) return null;
    if (stereoHas && stereoValue === undefined) return null;

    const pendingLabel = pending
        ? formatBusIdentifierShort(pending.type, pending.number)
        : '';

    return (
        <>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Move to') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%" minWidth="0">
                        {sourceLinked && (
                            <Text size={textSize} color="gray">
                                { t('Unlink to move') }
                            </Text>
                        )}
                        {!sourceLinked && (
                            <DropdownSelect.Root set={onPick}>
                                <DropdownSelect.Trigger
                                    square
                                    size={textSize}
                                    variant="soft"
                                    color="gray"
                                    disabled={disabled || moving}
                                >
                                    <Text size={textSize}>
                                        { moving ? t('Moving...') : t('Move to') }
                                    </Text>
                                </DropdownSelect.Trigger>
                                <DropdownSelect.Content>
                                    <DropdownSelect.Label>{ t('Move to') }</DropdownSelect.Label>
                                    {targets.map(option => (
                                        <MoveTargetOption key={option.id} option={option} />
                                    ))}
                                </DropdownSelect.Content>
                            </DropdownSelect.Root>
                        )}
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            {!!errorText && (
                <LabelControlTable.Row>
                    <LabelControlTable.Cell colSpan={2}>
                        <Text size={textSize} color="red">
                            { errorText }
                        </Text>
                    </LabelControlTable.Cell>
                </LabelControlTable.Row>
            )}
            <AlertDialog.Root open={pendingId !== null} onOpenChange={onConfirmOpenChange}>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>
                        { pendingLabel ? `${t('Move to')} ${pendingLabel}?` : t('Move to') }
                    </AlertDialog.Title>
                    <AlertDialog.Description size={textSize}>
                        { t(isSecondary ? MOVE_DESCRIPTION_BUS : MOVE_DESCRIPTION) }
                    </AlertDialog.Description>
                    <Flex justify="end" gapX="3" mt="4">
                        <AlertDialog.Cancel>
                            <Button size={textSize} variant="soft" color="gray">
                                { t('Cancel') }
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button
                                size={textSize}
                                variant="soft"
                                color="red"
                                onClick={onAccept}
                                disabled={disabled || moving}
                            >
                                { t(isSecondary ? 'Move bus' : 'Move channel') }
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    );
};


export default MoveTo;
