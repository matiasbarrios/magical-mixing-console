// Requirements
import {
    Flex, Separator, Text,
} from '@radix-ui/themes';
import { useOutputTap, useOutputTapOptions } from '@magical-mixing/mixers-react';
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { LetterIconButtonLabel } from '../../../components/base/letterIconButton';


// Internal
const tapNameShortEn = {
    Analog: 'Analog',
    'Analog + mute': 'Analog + mute',
    Input: 'Input',
    'Input + mute': 'Input + mute',
    'Pre equalizer': 'Pre eq',
    'Post equalizer': 'Post eq',
    'Pre equalizer + mute': 'Pre eq + mute',
    'Post equalizer + mute': 'Post eq + mute',
    'Pre level': 'Pre level',
    'Pre level + mute': 'Pre level + mute',
    'Post level': 'Post level',
};


const useTapNameDisplay = (name, abbreviate) => {
    const { t, language } = useLanguage();

    return useMemo(() => {
        if (!name) return '';
        const full = t(name);
        if (!abbreviate) return full;
        if (language === 'es') return t(name, 'short') || full;
        return tapNameShortEn[name] || full;
    }, [t, language, name, abbreviate]);
};


// Exported
export const useTapName = (outputId) => {
    const { t } = useLanguage();
    const { has, value } = useOutputTap(outputId);
    const { get } = useOutputTapOptions();

    const name = useMemo(() => t(has ? get(value)?.name : ''), [has, value, get, t]);

    return { has, name };
};


export const TapDropdown = ({
    outputId, showValue, label, fillWidth, abbreviate = false, size: sizeProp,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;
    const textSizeFinal = sizeProp ?? textSize;

    const { has, value, set } = useOutputTap(outputId);
    const { options, get } = useOutputTapOptions();

    const option = useMemo(() => get(value), [get, value]);
    const tapName = useTapNameDisplay(option?.name, abbreviate);

    if (!has) return null;

    const menu = (
        <DropdownSelect.Content>
            <DropdownSelect.Label>{ t('Tap') }</DropdownSelect.Label>
            {options.map(o => (
                <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                    <Text size="2">{ t(o.name) }</Text>
                </DropdownSelect.Option>
            ))}
        </DropdownSelect.Content>
    );

    if (label) {
        return (
            <DropdownSelect.Root set={set}>
                <DropdownSelect.Trigger
                    square
                    size={size}
                    variant="soft"
                    color="gray"
                    className="mmc-btn-nowrap"
                    style={fillWidth ? { width: '100%' } : undefined}
                >
                    <Flex align="center" gapX="1" wrap="nowrap">
                        <Text size="1" color="gray" weight="regular" wrap="nowrap">{ label }</Text>
                        {!!tapName && (
                            <>
                                <Separator orientation="vertical" />
                                <Text size="1" color="gray" weight="regular" wrap="nowrap">{ tapName }</Text>
                            </>
                        )}
                    </Flex>
                </DropdownSelect.Trigger>
                { menu }
            </DropdownSelect.Root>
        );
    }

    return (
        <DropdownSelect.Root set={set}>
            {!showValue && (
                <DropdownSelect.Trigger variant="soft" color="gray">
                    <LetterIconButtonLabel letter="T" textSize={textSizeFinal} />
                </DropdownSelect.Trigger>
            )}
            {showValue && (
                <DropdownSelect.Trigger
                    square
                    size={size}
                    variant="soft"
                    color="gray"
                    className="mmc-btn-nowrap"
                >
                    <Text size={textSizeFinal} color="gray" weight="regular" wrap="nowrap">
                        { tapName }
                    </Text>
                </DropdownSelect.Trigger>
            )}
            { menu }
        </DropdownSelect.Root>
    );
};


export const TapViewSelect = ({ outputId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const { has, value, set } = useOutputTap(outputId);
    const { options, get } = useOutputTapOptions();

    const option = useMemo(() => get(value), [get, value]);
    const tapName = useMemo(() => t(option?.name || ''), [option, t]);

    if (!has || value === undefined) return null;

    return (
        <DropdownSelect.Root set={set}>
            <DropdownSelect.Trigger square variant="soft" color="gray">
                <Text size={textSize} wrap="nowrap">{ tapName }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Tap') }</DropdownSelect.Label>
                {options.map(o => (
                    <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                        <Text size="2">{ t(o.name) }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};
