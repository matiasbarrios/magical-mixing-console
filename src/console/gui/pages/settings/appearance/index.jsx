// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    Dialog, Flex, Text,
} from '@radix-ui/themes';
import { useLanguage, LANGUAGE_OPTIONS } from '../../../components/language';
import { useTheme, useUiSize } from '../../../components/theme';
import DialogHeader from '../../../components/base/dialogHeader';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import CheckToggleButton from '../../../components/base/checkToggleButton';
import OverflowTabs from '../../../components/base/overflowTabs';
import { useFooter } from '../../../components/layout/footer';


// Variables
const AppearanceContext = createContext(null);

const APPEARANCE_ROW_HEIGHT_PX = 36;

// Header, tabs, and spacing below max dialog height (85dvh).
const APPEARANCE_DIALOG_CHROME_MAX_HEIGHT = 'calc(85dvh - 8rem)';

const APPEARANCE_TAB_ROW_COUNTS = {
    global: 4,
    header: 2,
    footer: 2,
    'bus-reception': 1,
};

const dialogStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85dvh',
    overflow: 'hidden',
};


// Internal
const SelectRow = ({
    label, value, options, onChange,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const selected = useMemo(() => options.find(o => o.value === value), [options, value]);

    const displayValue = useMemo(() => (selected ? t(selected.label) : ''),
        [selected, t]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label wrap="pretty">
                    { t(label) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={onChange} numeric={false}>
                        <DropdownSelect.Trigger square size={textSize} variant="soft" color="gray">
                            <Text size={textSize} wrap="nowrap">{ displayValue }</Text>
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content>
                            {options.map(o => (
                                <DropdownSelect.Option
                                    key={o.value}
                                    id={o.value}
                                    selected={value === o.value}
                                >
                                    <Text size="2" color="gray" wrap="nowrap">{ t(o.label) }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ToggleRow = ({
    label, value, onChange,
}) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label wrap="pretty">
                    { t(label) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <CheckToggleButton active={value} onClick={onChange} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const FormPanel = ({ children }) => (
    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
        { children }
    </LabelControlTable.List>
);


const SIZE_OPTIONS = [
    { value: '1', label: 'Small' },
    { value: '2', label: 'Large' },
];

const MODE_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

const LAYOUT_OPTIONS = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
];


const GlobalTab = ({
    textSize, setTextSize, language, languageSet, theme, setTheme,
    entityViewLayout, setEntityViewLayout,
}) => (
    <FormPanel>
        <SelectRow
            label="Language"
            value={language}
            options={LANGUAGE_OPTIONS}
            onChange={languageSet}
        />
        <SelectRow
            label="Mode"
            value={theme}
            options={MODE_OPTIONS}
            onChange={setTheme}
        />
        <SelectRow
            label="Size"
            value={textSize}
            options={SIZE_OPTIONS}
            onChange={setTextSize}
        />
        <SelectRow
            label="Layout"
            value={entityViewLayout}
            options={LAYOUT_OPTIONS}
            onChange={setEntityViewLayout}
        />
    </FormPanel>
);


const BusReceptionTab = ({
    receptionShortcuts, receptionShortcutsToggle,
}) => (
    <FormPanel>
        <ToggleRow
            label="Show input/eq/compressor/gate preview when enough space"
            value={receptionShortcuts}
            onChange={receptionShortcutsToggle}
        />
    </FormPanel>
);


const FooterTab = ({ footerShown, footerToggle, mgShown, mgToggle }) => (
    <FormPanel>
        <ToggleRow
            label="Always visible"
            value={footerShown}
            onChange={footerToggle}
        />
        <ToggleRow
            label="Mute groups"
            value={mgShown}
            onChange={mgToggle}
        />
    </FormPanel>
);


const HeaderTab = ({
    headerWizardWandShown, headerWizardWandToggle,
    headerNavigation, headerNavigationToggle,
}) => (
    <FormPanel>
        <ToggleRow
            label="Show wizard"
            value={headerWizardWandShown}
            onChange={headerWizardWandToggle}
        />
        <ToggleRow
            label="Show navigation"
            value={headerNavigation}
            onChange={headerNavigationToggle}
        />
    </FormPanel>
);


const AppearanceDialog = ({ open, onOpenChange }) => {
    const { t, language, languageSet } = useLanguage();
    const {
        theme, setTheme, textSize, setTextSize,
        receptionShortcuts, setReceptionShortcuts,
        entityViewLayout, setEntityViewLayout,
        headerWizardWandShown, setHeaderWizardWandShown,
        headerNavigation, setHeaderNavigation,
    } = useTheme();
    const {
        shown: footerShown, toggle: footerToggle, mgShown, mgToggle,
    } = useFooter();
    const [activeTab, setActiveTab] = useState('global');

    const tabs = useMemo(() => [
        { id: 'global', label: t('Global') },
        { id: 'header', label: t('Header') },
        { id: 'footer', label: t('Footer') },
        { id: 'bus-reception', label: t('Buses') },
    ], [t]);

    const receptionShortcutsToggle = useCallback(() => setReceptionShortcuts(!receptionShortcuts),
        [receptionShortcuts, setReceptionShortcuts]);

    const headerWizardWandToggle = useCallback(() => setHeaderWizardWandShown(!headerWizardWandShown),
        [headerWizardWandShown, setHeaderWizardWandShown]);

    const headerNavigationToggle = useCallback(() => setHeaderNavigation(!headerNavigation),
        [headerNavigation, setHeaderNavigation]);

    const panelHeightPx = useMemo(() => {
        const maxRows = Math.max(...Object.values(APPEARANCE_TAB_ROW_COUNTS));
        return maxRows * APPEARANCE_ROW_HEIGHT_PX;
    }, []);

    const scrollPanelStyle = useMemo(() => ({
        height: panelHeightPx,
        maxHeight: APPEARANCE_DIALOG_CHROME_MAX_HEIGHT,
        flexShrink: 0,
    }), [panelHeightPx]);

    useEffect(() => {
        if (!open) setActiveTab('global');
    }, [open]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined} style={dialogStyle}>
                <Flex flexShrink="0" width="100%" minWidth="0">
                    <DialogHeader>
                        { t('Appearance') }
                    </DialogHeader>
                </Flex>
                <Flex flexShrink="0" width="100%" minWidth="0">
                    <OverflowTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
                </Flex>
                <ConditionalScrollY
                    mt="3"
                    minWidth="0"
                    width="100%"
                    flexGrow="0"
                    gapY="0"
                    pb="0"
                    style={scrollPanelStyle}
                >
                    {activeTab === 'global' && (
                        <GlobalTab
                            textSize={textSize}
                            setTextSize={setTextSize}
                            language={language}
                            languageSet={languageSet}
                            theme={theme}
                            setTheme={setTheme}
                            entityViewLayout={entityViewLayout}
                            setEntityViewLayout={setEntityViewLayout}
                        />
                    )}
                    {activeTab === 'header' && (
                        <HeaderTab
                            headerWizardWandShown={headerWizardWandShown}
                            headerWizardWandToggle={headerWizardWandToggle}
                            headerNavigation={headerNavigation}
                            headerNavigationToggle={headerNavigationToggle}
                        />
                    )}
                    {activeTab === 'footer' && (
                        <FooterTab
                            footerShown={footerShown}
                            footerToggle={footerToggle}
                            mgShown={mgShown}
                            mgToggle={mgToggle}
                        />
                    )}
                    {activeTab === 'bus-reception' && (
                        <BusReceptionTab
                            receptionShortcuts={receptionShortcuts}
                            receptionShortcutsToggle={receptionShortcutsToggle}
                        />
                    )}
                </ConditionalScrollY>
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export const AppearanceProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const openAppearance = useCallback(() => {
        setOpen(true);
    }, []);

    const value = useMemo(() => ({
        openAppearance,
    }), [openAppearance]);

    return (
        <AppearanceContext.Provider value={value}>
            { children }
            <AppearanceDialog open={open} onOpenChange={setOpen} />
        </AppearanceContext.Provider>
    );
};


export const useAppearance = () => {
    const context = useContext(AppearanceContext);
    if (!context) {
        throw new Error('useAppearance must be used within AppearanceProvider');
    }
    return context;
};
