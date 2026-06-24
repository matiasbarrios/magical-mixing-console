// Exported
export const isValidIP = ip => /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/.test(ip);


export const isValidPort = (s) => {
    const portNumber = parseInt(s, 10);
    return !Number.isNaN(portNumber) && portNumber >= 0 && portNumber <= 65535;
};


export const ONE = 0.99999; // Strange bug when setting 1 in some binary values


// Represents 0dB → 1.0 and –50dB → ~0.2
export const minus60To0ToDecimal = v => 10 ** (v / 71.5);


export const minus90To10ToDecimal = (v) => {
    // Patrick‐Gilles Maillot approximation
    if (v <= -90) return 0.0;
    if (v < -60) return (v + 90) / 480;
    if (v < -30) return (v + 70) / 160;
    if (v < -10) return (v + 50) / 80;
    if (v < 10) return (v + 30) / 40;
    return ONE;
};


export const decimalToMinus90To10 = (v) => {
    // Patrick‐Gilles Maillot approximation
    if (v >= 0.5) return (v * 40.0) - 30.0; // max dB value: +10.
    if (v >= 0.25) return (v * 80.0) - 50.0;
    if (v >= 0.0625) return (v * 160.0) - 70.0;
    if (v >= 0.0) return (v * 480.0) - 90.0;
    return -90.0;
};


export const BUS_LEVEL_WIDTH = 'xs:60%;%;md:70%;lg:60%;xl:65%';


export const DCA_LEVEL_WIDTH = 'xs:60%;md:70%;lg:60%;xl:65%';


export const INPUT_LEVEL_WIDTH = 'xs:60%;md:70%;lg:60%;xl:65%';


export const OUTPUT_LEVEL_WIDTH = 'xs:60%;md:70%;lg:60%;xl:65%';


export const COMPRESSOR_INPUTS_WIDTH = '65px';


export const GATE_INPUTS_WIDTH = '65px';


/** Icon dimensions via CSS var (use ICON_STYLE on SVGs — width/height attrs reject var()). */
export const ICON_STYLE = {
    width: 'var(--mmc-icon-size)',
    height: 'var(--mmc-icon-size)',
    flexShrink: 0,
};

export const ICON_SPACER = { style: ICON_STYLE };

/** Radix DropdownMenu.Content / SubContent — always normal regardless of UI text size. */
export const DROPDOWN_MENU_CONTENT_SIZE = '2';

/** D3/SVG chart axis and threshold labels (see ThemeProvider). */
export const CHART_FONT_SIZE = 'var(--mmc-chart-font-size)';

export const getChartThresholdTextLineHeight = () => {
    if (typeof document === 'undefined') return 12;
    const parsed = parseFloat(window.getComputedStyle(document.documentElement)
        .getPropertyValue('--mmc-chart-threshold-line-height'));
    return Number.isNaN(parsed) ? 12 : parsed;
};


/** Letter-only controls in dense list rows (font tuning inside IconButton). */
export const QUICK_LETTER_LABEL_STYLE = {
    fontSize: 'var(--mmc-quick-button-font-size)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
};
