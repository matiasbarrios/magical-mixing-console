// Requirements
import { useDevice, useOutputSource } from '@magical-mixing/mixers-react';
import {
    Flex, Separator, Text,
} from '@radix-ui/themes';
import { useMemo } from 'react';
import { useLanguage } from '../../../components/language';
import { BusIconNameLabeled, BusIconNameLinkLabeled } from '../../bus/view/name';
import { useInputNameTranslated } from '../../input/view/name';
import Link from '../../../components/base/link';
import { DropdownSelect } from '../../../components/base/dropdownSelect';


// Internal
const SourceDivider = () => (
    <Separator orientation="vertical" size="1" />
);


const BusName = ({
    size = '2', color = 'gray', busId, side, noLink,
}) => {
    const { t } = useLanguage();
    return (
        <Flex align="center" gapX="1" wrap="wrap">
            {!noLink && <BusIconNameLinkLabeled busId={busId} size={size} />}
            {!!noLink && <BusIconNameLabeled busId={busId} size={size} />}
            {side && (
                <>
                    <SourceDivider />
                    <Text size={size} color={color}>{ t(side) }</Text>
                </>
            )}
        </Flex>
    );
};


const InputName = ({
    size = '2', color = 'gray', inputId, side, noLink,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { name } = useInputNameTranslated(inputId);
    const label = (
        <Flex align="center" gapX="1">
            <Text size={size} color={color}>{ t('Input') }</Text>
            <SourceDivider />
            <Text size={size} color={color}>{ name }</Text>
        </Flex>
    );

    return (
        <Flex align="center" gapX="1" wrap="wrap">
            {!noLink && (
                <Link size={size} variant="ghost" color={color} to={`/input/${inputId}`} disabled={disabled}>
                    { label }
                </Link>
            )}
            {!!noLink && label}
            {side && (
                <>
                    <SourceDivider />
                    <Text size={size} color={color}>{ t(side) }</Text>
                </>
            )}
        </Flex>
    );
};


const FxName = ({
    size = '2', color = 'gray', fxId, side, noLink,
}) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const label = (
        <Flex align="center" gapX="1">
            <Text size={size} color={color}>{ t('FX') }</Text>
            <SourceDivider />
            <Text size={size} color={color}>{ fxId }</Text>
        </Flex>
    );

    return (
        <Flex align="center" gapX="1" wrap="wrap">
            {!noLink && (
                <Link size={size} variant="ghost" color={color} to={`/fx/${fxId}`} disabled={disabled}>
                    { label }
                </Link>
            )}
            {!!noLink && label}
            {side && (
                <>
                    <SourceDivider />
                    <Text size={size} color={color}>{ t(side) }</Text>
                </>
            )}
        </Flex>
    );
};


const SourceTranslated = ({ size = '2', outputId, noLink }) => {
    const { has, value, get } = useOutputSource(outputId);
    const e = get(value);

    if (!has || !e) return null;

    if (e.type === 'input') {
        return <InputName color="gray" size={size} inputId={e.externalId} side={e.side} noLink={noLink} />;
    }
    if (e.type === 'bus') {
        return <BusName color="gray" size={size} busId={e.externalId} side={e.side} noLink={noLink} />;
    }
    if (e.type === 'fx') {
        return <FxName color="gray" size={size} fxId={e.externalId} side={e.side} noLink={noLink} />;
    }

    return null;
};


export const SourceViewSelect = ({ outputId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, options,
    } = useOutputSource(outputId);

    const optionsFinal = useMemo(() => ['bus', 'input', 'fx']
        .map(type => options.filter(o => o.type === type))
        .filter(o => o)
        .flat(), [options]);

    const option = useMemo(() => optionsFinal.find(o => o.id === value), [optionsFinal, value]);

    if (!has || value === undefined || !option) return null;

    return (
        <DropdownSelect.Root set={set}>
            <DropdownSelect.Trigger square variant="soft" color="gray">
                { option.type === 'input' && <InputName inputId={option.externalId} side={option.side} noLink size="1" /> }
                { option.type === 'bus' && <BusName busId={option.externalId} side={option.side} noLink size="1" /> }
                { option.type === 'fx' && <FxName fxId={option.externalId} side={option.side} noLink size="1" /> }
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Source') }</DropdownSelect.Label>
                {optionsFinal.map(o => (
                    <DropdownSelect.Option key={o.id} selected={value === o.id} id={o.id}>
                        { o.type === 'input' && <InputName inputId={o.externalId} side={o.side} noLink /> }
                        { o.type === 'bus' && <BusName busId={o.externalId} side={o.side} noLink /> }
                        { o.type === 'fx' && <FxName fxId={o.externalId} side={o.side} noLink /> }
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


// Exported
export { SourceTranslated };
