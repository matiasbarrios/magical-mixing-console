// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu, Text } from '@radix-ui/themes';
import { useDevice, useOutputOptions } from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../components/language';
import { ucFirst } from '../../../helpers/format';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { DropdownMenuSubContent } from '../../../components/base/dropdownMenuContent';
import { useUiSize } from '../../../components/theme';
import { useOutputNameTranslated } from './name';


// Internal
const OutputMenuItem = ({ outputId, onSelect }) => {
    const { name } = useOutputNameTranslated(outputId);

    return (
        <DropdownMenu.Item onSelect={onSelect(outputId)}>
            <Text size="2">{ name }</Text>
        </DropdownMenu.Item>
    );
};


const OutputsPerType = ({ type, outputId, onSelect }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { options } = useOutputOptions();

    const elements = useMemo(() => options
        .filter(o => o.type === type && o.id !== outputId), [options, type, outputId]);

    if (!elements.length) return null;

    if (elements.length === 1) {
        return <OutputMenuItem outputId={elements[0].id} onSelect={onSelect} />;
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={disabled}>
                { ucFirst(t(type)) }
            </DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                {elements.map(o => (
                    <OutputMenuItem key={o.id} outputId={o.id} onSelect={onSelect} />
                ))}
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};


// Exported
export default ({ outputId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { textSize } = useUiSize();
    const { options, types } = useOutputOptions();
    const { name } = useOutputNameTranslated(outputId);

    const others = useMemo(() => options.filter(o => o.id !== outputId),
        [options, outputId]);

    const onSelect = useCallback(id => () => navigate(`/output/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/output/list'), [navigate]);

    const label = <Text size={textSize} color={color}>{ name }</Text>;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {types.map(type => (
                <OutputsPerType key={type} type={type} outputId={outputId} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
