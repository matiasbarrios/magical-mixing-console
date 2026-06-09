// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import {
    useDevice,
    useFxHas, useFxOptions, useInputOptions, useOutputOptions, useSceneHas,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';
import { useFxNameTranslated } from '../../../../pages/fx/view/name';
import { useInputNameTranslated } from '../../../../pages/input/view/name';
import { useOutputNameTranslated } from '../../../../pages/output/view/name';
import { DropdownMenuSubContent } from './../../../base/dropdownMenuContent';


// Internal
const FxName = ({ fx }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { name } = useFxNameTranslated(fx.id);
    return (
        <DropdownMenu.Item onSelect={() => navigate(`/fx/${fx.id}`)} disabled={disabled}>
            { name }
        </DropdownMenu.Item>
    );
};

const Fxs = () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useFxHas();
    const { options } = useFxOptions();

    if (!has) return null;

    if (!options.length) return null;
    if (options.length === 1) return <FxName fx={options[0]} />;

    return (
        <DropdownMenu.Item onSelect={() => navigate('/fx/list')} disabled={disabled}>
            { t('FXs') }
        </DropdownMenu.Item>
    );
};


const InputName = ({ input }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { name } = useInputNameTranslated(input.id);
    return (
        <DropdownMenu.Item onSelect={() => navigate(`/input/${input.id}`)} disabled={disabled}>
            { name }
        </DropdownMenu.Item>
    );
};


const Inputs = () => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { options } = useInputOptions();

    if (!options.length) return null;

    if (options.length === 1) return <InputName input={options[0]} />;

    return (
        <DropdownMenu.Item onSelect={() => navigate('/input/list')} disabled={disabled}>
            { t('Inputs') }
        </DropdownMenu.Item>
    );
};


const OutputName = ({ output }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { name } = useOutputNameTranslated(output.id);
    return (
        <DropdownMenu.Item onSelect={() => navigate('/output/list')} disabled={disabled}>
            { name }
        </DropdownMenu.Item>
    );
};


const Outputs = () => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { options } = useOutputOptions();

    if (!options.length) return null;

    if (options.length === 1) return <OutputName output={options[0]} />;

    return (
        <DropdownMenu.Item onSelect={() => navigate('/output/list')} disabled={disabled}>
            { t('Outputs') }
        </DropdownMenu.Item>
    );
};


const Scenes = () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useSceneHas();
    if (!has) {
        return (
            <DropdownMenu.Item onSelect={() => navigate('/scene/list/app')} disabled={disabled}>
                { t('Scenes') }
            </DropdownMenu.Item>
        );
    }
    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={disabled}>{ t('Scenes') }</DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                <DropdownMenu.Item onSelect={() => navigate('/scene/list/device')} disabled={disabled}>
                    { t('In device') }
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate('/scene/list/app')} disabled={disabled}>
                    { t('In app') }
                </DropdownMenu.Item>
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};


// Exported
export default () => (
    <>
        <Fxs />
        <Inputs />
        <Outputs />
        <Scenes />
    </>
);
