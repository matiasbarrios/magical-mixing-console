// Requirements
import { useDevice } from '@magical-mixing/mixers-react';
import { CheckIcon } from '@radix-ui/react-icons';
import {
    Box, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import {
    createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import { ICON_STYLE, ICON_SPACER } from '../../helpers/values';
import { DropdownMenuContent, DropdownMenuSubContent } from './dropdownMenuContent';
import { DropdownMenuTrigger } from './dropdownMenuTrigger';


// Variables
const Context = createContext({});


// Internal
const Root = ({ set, numeric = true, children }) => {
    const [opened, setOpened] = useState(false);

    const state = useMemo(() => ({
        opened, setOpened, set, numeric,
    }), [opened, setOpened, set, numeric]);

    return (
        <Context.Provider value={state}>
            <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                {children}
            </DropdownMenu.Root>
        </Context.Provider>
    );
};


const useDropdownSelect = () => {
    const {
        opened, setOpened, set, numeric,
    } = useContext(Context);
    const { disabled } = useDevice();

    const toggleOpened = useCallback(() => setOpened(!opened), [opened, setOpened]);

    const onValueChange = useCallback(v => () => {
        if (disabled) return;
        set(numeric ? parseInt(v, 10) : v);
    }, [set, disabled, numeric]);

    return { toggleOpened, onValueChange, setOpened };
};


const Content = ({ children, ...props }) => (
    <DropdownMenuContent {...props}>
        {children}
    </DropdownMenuContent>
);


const Trigger = ({ children, ...props }) => {
    const { toggleOpened } = useDropdownSelect();
    return (
        <DropdownMenuTrigger {...props} onClick={toggleOpened}>
            {children}
        </DropdownMenuTrigger>
    );
};


const Label = ({ children }) => (
    <DropdownMenu.Label>
        <Flex align="center" gapX="1">
            <Box {...ICON_SPACER} />
            <Text size="2">{ children }</Text>
        </Flex>
    </DropdownMenu.Label>
);


const Option = ({
    id, selected, children, disabled, noWhiteSpace, onSelect: customOnSelect,
}) => {
    const { onValueChange } = useDropdownSelect();

    const onSelect = useMemo(() => {
        if (disabled) return undefined;
        if (customOnSelect) return customOnSelect;
        return onValueChange(id);
    }, [disabled, customOnSelect, id, onValueChange]);

    return (
        <DropdownMenu.Item onSelect={onSelect} disabled={disabled}>
            <Flex align="center" gapX="1" flexGrow="1">
                {!!selected && <CheckIcon style={ICON_STYLE} />}
                {!selected && !noWhiteSpace && <Box {...ICON_SPACER} />}
                { children }
            </Flex>
        </DropdownMenu.Item>
    );
};


const Sub = ({ children }) => (
    <DropdownMenu.Sub>{children}</DropdownMenu.Sub>
);


const SubTrigger = ({ children }) => (
    <DropdownMenu.SubTrigger>{children}</DropdownMenu.SubTrigger>
);


const SubContent = ({ children, ...props }) => (
    <DropdownMenuSubContent {...props}>
        {children}
    </DropdownMenuSubContent>
);


const DropdownSelect = {
    Root,
    Content,
    Trigger,
    Label,
    Option,
    Sub,
    SubTrigger,
    SubContent,
};


// Exported
export { DropdownSelect, useDropdownSelect };
