// Requirements
import { useCallback, useMemo, useState } from 'react';
import { DropdownMenu, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { useFallbackBusesSorted } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { DropdownMenuContent } from '../../../components/base/dropdownMenuContent';
import { BusIconNameLabeled } from './name';
import { buildBusMenuSections, useBusMenuContent } from './menu';


// Constants
const quickMenuOpts = { quickAccess: true };

const buildQuickMenuSections = buses => buildBusMenuSections(buses, quickMenuOpts);


// Exported
export default ({ busId, color = 'gray' }) => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { sortedBuses } = useFallbackBusesSorted();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const menuSections = useMemo(() => buildQuickMenuSections(sortedBuses),
        [sortedBuses]);
    const menuContent = useBusMenuContent(menuSections);
    const hasBuses = menuSections.length > 0;
    const goToList = useCallback(() => navigate('/bus/list'), [navigate]);

    const label = <BusIconNameLabeled busId={busId} />;

    if (!hasBuses) {
        return (
            <Flex align="center" mx="2">
                { label }
            </Flex>
        );
    }

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                size="2"
                variant="ghost"
                color={color}
                onClick={toggleOpened}
            >
                { label }
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                { menuContent }
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={goToList} disabled={disabled}>
                    { t('List') }
                </DropdownMenu.Item>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
