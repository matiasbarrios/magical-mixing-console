// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu, Text } from '@radix-ui/themes';
import { useDevice, useInputOptions } from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../components/language';
import { ucFirst } from '../../../helpers/format';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { DropdownMenuSubContent } from '../../../components/base/dropdownMenuContent';
import { useUiSize } from '../../../components/theme';
import { useInputNameTranslated } from './name';


// Internal
const InputMenuItem = ({ inputId, onSelect }) => {
    const { name } = useInputNameTranslated(inputId);

    return (
        <DropdownMenu.Item onSelect={onSelect(inputId)}>
            <Text size="2">{ name }</Text>
        </DropdownMenu.Item>
    );
};


const InputsPerType = ({ type, inputId, onSelect }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { options } = useInputOptions();

    const elements = useMemo(() => options
        .filter(o => o.type === type && o.id !== inputId), [options, type, inputId]);

    if (!elements.length) return null;

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={disabled}>
                { ucFirst(t(type)) }
            </DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                {elements.map(o => (
                    <InputMenuItem key={o.id} inputId={o.id} onSelect={onSelect} />
                ))}
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};


// Exported
export default ({ inputId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { textSize } = useUiSize();
    const { options, types } = useInputOptions();
    const { name } = useInputNameTranslated(inputId);

    const others = useMemo(() => options.filter(o => o.id !== inputId),
        [options, inputId]);

    const onSelect = useCallback(id => () => navigate(`/input/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/input/list'), [navigate]);

    const label = <Text size={textSize} color={color}>{ name }</Text>;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {types.map(type => (
                <InputsPerType key={type} type={type} inputId={inputId} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
