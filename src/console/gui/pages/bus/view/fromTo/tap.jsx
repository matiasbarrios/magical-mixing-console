// Requirements
import { useMemo } from 'react';
import { Text } from '@radix-ui/themes';
import { useBusToTap } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { DropdownSelect } from '../../../../components/base/dropdownSelect';
import { LetterIconButtonLabel } from '../../../../components/base/letterIconButton';


// Internal
const tapNameShortEn = {
    Input: 'Input',
    'Pre level': 'Pre level',
    'Post level': 'Post level',
    'Pre equalizer': 'Pre eq',
    'Post equalizer': 'Post eq',
    'Same level': 'Same level',
    'Pre equalizer + mute': 'Pre eq + mute',
    'Post equalizer + mute': 'Post eq + mute',
    'Pre level + mute': 'Pre level + mute',
    'Pre level meter': 'Pre level meter',
    'Post level meter': 'Post level meter',
};


const useTapName = (name) => {
    const { t, language } = useLanguage();

    return useMemo(() => {
        if (!name) return { full: '', short: '' };
        const full = t(name);
        const translatedShort = language === 'es' ? t(name, 'short') : undefined;
        const short = translatedShort || tapNameShortEn[name] || full;
        return { full, short };
    }, [t, language, name]);
};


const TapMenu = ({ options, value, t }) => (
    <DropdownSelect.Content>
        <DropdownSelect.Label>
            <Text size="2">{ t('Tap') }</Text>
        </DropdownSelect.Label>
        {options.map(o => (
            <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                <Text size="2">{ t(o.name) }</Text>
            </DropdownSelect.Option>
        ))}
    </DropdownSelect.Content>
);


// Exported
export const TapDropdown = ({
    busIdFrom, busIdTo, showValue, abbreviate = false, size: sizeProp,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;
    const textSizeFinal = sizeProp ?? textSize;

    const {
        has, value, set, options,
    } = useBusToTap(busIdFrom, busIdTo);

    const option = useMemo(() => options.find(o => o.id === value), [options, value]);
    const { full: tapName, short: tapNameShort } = useTapName(option?.name);
    const tapNameDisplay = abbreviate ? tapNameShort : tapName;

    if (!has) return null;

    const menu = <TapMenu options={options} value={value} t={t} />;

    if (showValue) {
        return (
            <DropdownSelect.Root set={set}>
                <DropdownSelect.Trigger
                    square
                    size={size}
                    variant="soft"
                    color="gray"
                    className="mmc-btn-nowrap"
                >
                    <Text size={textSizeFinal} color="gray" weight="regular" wrap="nowrap">
                        { tapNameDisplay }
                    </Text>
                </DropdownSelect.Trigger>
                { menu }
            </DropdownSelect.Root>
        );
    }

    return (
        <DropdownSelect.Root set={set}>
            <DropdownSelect.Trigger variant="soft" color="gray">
                <LetterIconButtonLabel letter="T" textSize={textSizeFinal} />
            </DropdownSelect.Trigger>
            { menu }
        </DropdownSelect.Root>
    );
};


export default ({ busIdFrom, busIdTo }) => (
    <TapDropdown busIdFrom={busIdFrom} busIdTo={busIdTo} />
);
