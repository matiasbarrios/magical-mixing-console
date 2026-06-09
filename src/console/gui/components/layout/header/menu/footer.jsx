// Requirements
import {
    DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import CheckToggleButton from '../../../base/checkToggleButton';
import { useLanguage } from '../../../language';
import { useFooter } from '../../footer';
import { preventDefault } from '../../../../helpers/behaviour';
import { DropdownMenuSubContent } from './../../../base/dropdownMenuContent';


// Exported
export default () => {
    const { t } = useLanguage();
    const {
        shown: footerShown, toggle: footerToggle, mgShown, mgToggle,
    } = useFooter();

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{ t('Footer') }</DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                <DropdownMenu.Item onSelect={preventDefault(footerToggle)}>
                    <Flex align="center" justify="between" gapX="3" flexGrow="1">
                        <Text size="2">{ t('Always visible') }</Text>
                        <CheckToggleButton active={footerShown} onClick={footerToggle} />
                    </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={preventDefault(mgToggle)}>
                    <Flex align="center" justify="between" gapX="3" flexGrow="1">
                        <Text size="2">{ t('Mute groups') }</Text>
                        <CheckToggleButton active={mgShown} onClick={mgToggle} />
                    </Flex>
                </DropdownMenu.Item>
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};
