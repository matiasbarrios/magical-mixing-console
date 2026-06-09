// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import {
    useAutomixHas, useAutomixOptions, useDcaHas, useDevice, useMgHas,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';
import { DcaIconNameLink } from '../../../../pages/dca/view/name';
import { MgIconNameLink } from '../../../../pages/mg/view/name';
import { useFallbackMgHas, useFallbackMgOptions, useFallbackDcaOptions } from '../../../fallback';


// Internal
const MgName = ({ mg }) => {
    const { disabled } = useDevice();
    return (
        <DropdownMenu.Item disabled={disabled}>
            <MgIconNameLink mgId={mg.id} variant="" />
        </DropdownMenu.Item>
    );
};


const Mg = () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useMgHas();
    const { options } = useFallbackMgOptions();

    if (!has) return null;

    if (options.length === 1) return <MgName mg={options[0]} />;
    return (
        <DropdownMenu.Item onSelect={() => navigate('/mg/list')} disabled={disabled}>
            { t('Mute groups') }
        </DropdownMenu.Item>
    );
};


const DcaName = ({ dca }) => {
    const { disabled } = useDevice();
    return (
        <DropdownMenu.Item disabled={disabled}>
            <DcaIconNameLink dcaId={dca.id} variant="" />
        </DropdownMenu.Item>
    );
};


const Dca = () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useDcaHas();
    const { options } = useFallbackDcaOptions();

    if (!has) return null;
    if (!options.length) return null;

    if (options.length === 1) return <DcaName dca={options[0]} />;
    return (
        <DropdownMenu.Item onSelect={() => navigate('/dca/list')} disabled={disabled}>
            { t('DCAs') }
        </DropdownMenu.Item>
    );
};


const AutomixName = ({ automix }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    return (
        <DropdownMenu.Item onSelect={() => navigate(`/automix/${automix.id}`)} disabled={disabled}>
            { automix.name }
        </DropdownMenu.Item>
    );
};


const Automix = () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useAutomixHas();
    const { options } = useAutomixOptions();

    if (!has) return null;
    if (!options.length) return null;

    if (options.length === 1) return <AutomixName automix={options[0]} />;
    return (
        <DropdownMenu.Item onSelect={() => navigate('/automix/list')} disabled={disabled}>
            { t('Automix') }
        </DropdownMenu.Item>
    );
};


// Exported
export default () => {
    const { has: hasMg } = useFallbackMgHas();
    const { has: hasDca } = useDcaHas();
    const { has: hasAutomix } = useAutomixHas();
    if (!hasMg && !hasDca && !hasAutomix) return null;
    return (
        <>
            <Mg />
            <Dca />
            <Automix />
        </>
    );
};
