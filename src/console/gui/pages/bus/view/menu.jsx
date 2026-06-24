// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { BUS_TYPE_ORDER } from '../../../helpers/busTypeOrder';
import { BusIconNameLabeled } from './name';
import { DropdownMenuSubContent } from './../../../components/base/dropdownMenuContent';


const BUS_MENU_TYPE_LABELS = {
    secondary: 'Aux',
    monitor: 'Monitor',
    main: 'Main',
    effect: 'Effects',
    channel: 'Channels',
    line: 'Lines',
};

const BUS_MENU_ALWAYS_DIRECT_TYPES = ['monitor', 'main'];

const BUS_MENU_QUICK_ACCESS_TYPES = ['secondary'];

const buildBusMenuSections = (buses, { quickAccess = false } = {}) => {
    const byType = type => buses.filter(bus => bus.type === type);
    const direct = new Set([
        ...BUS_MENU_ALWAYS_DIRECT_TYPES,
        ...(quickAccess ? BUS_MENU_QUICK_ACCESS_TYPES : []),
    ]);

    return BUS_TYPE_ORDER.map(type => ({
        kind: direct.has(type) ? 'group' : 'sub',
        label: BUS_MENU_TYPE_LABELS[type],
        buses: byType(type),
    })).filter(section => section.buses.length > 0);
};


const BusMenuItem = ({ busId }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();

    const navigateTo = useCallback(() => {
        navigate(`/bus/${busId}`);
    }, [navigate, busId]);

    return (
        <DropdownMenu.Item onSelect={navigateTo} disabled={disabled}>
            <BusIconNameLabeled busId={busId} size="2" />
        </DropdownMenu.Item>
    );
};


const BusMenuSub = ({ label, buses }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();

    if (!buses.length) return null;

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={disabled}>{ t(label) }</DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                {buses.map(bus => <BusMenuItem key={bus.id} busId={bus.id} />)}
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};


const renderContent = menuSections => menuSections.flatMap((section, index) => {
    const sectionKey = section.label || section.buses[0]?.type;
    const elements = [];

    if (index > 0) {
        elements.push(<DropdownMenu.Separator key={`sep-${sectionKey}`} />);
    }

    if (section.kind === 'group') {
        section.buses.forEach((bus) => {
            elements.push(<BusMenuItem key={bus.id} busId={bus.id} />);
        });
    } else {
        const sub = (
            <BusMenuSub key={section.label} label={section.label} buses={section.buses} />
        );
        elements.push(sub);
    }

    return elements;
});


const useBusMenuContent = s => useMemo(() => renderContent(s), [s]);


// Exported
export {
    buildBusMenuSections,
    BusMenuItem,
    BusMenuSub,
    useBusMenuContent,
};
