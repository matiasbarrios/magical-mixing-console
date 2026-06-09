// Exported
export const noDecimals = (d) => {
    if (d === undefined || d === null) return '';
    const res = d.toLocaleString(navigator.language, {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return res === '-0' ? '0' : res;
};


export const oneDecimal = (d) => {
    if (d === undefined || d === null) return '';
    const res = d.toLocaleString(navigator.language, {
        useGrouping: true,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
    return res === '-0.0' ? '0.0' : res;
};


export const twoDecimals = (d) => {
    if (d === undefined || d === null) return '';
    const res = d.toLocaleString(navigator.language, {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return res === '-0.00' ? '0.00' : res;
};


export const ucFirst = s => s.charAt(0).toUpperCase() + s.slice(1);


export const formatPanHundred = (value) => {
    if (value === undefined || value === null) return '';
    const rounded = Math.round(value);
    if (rounded === 0) return '0';
    if (rounded < 0) return `${Math.abs(rounded)}L`;
    return `${rounded}R`;
};


export const formatLevelDb = (value, { detailed = false, showPlus = true } = {}) => {
    if (value === undefined || value === null) return '';
    const ds = detailed ? oneDecimal(value) : noDecimals(value);
    return `${showPlus && value >= 0 ? '+' : ''}${ds}`;
};


export const toCamelCase = s => s.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());


export const fromCamelCaseToUCFirst = (s) => {
    if (s === undefined || s === null) return '';
    // Put a space before each capital letter
    const spaced = s.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};


export const fromValueToK = (v) => {
    if (v === undefined || v === null) return '';
    if (v < 1000) return Math.round(v);
    if (v < 10000) {
        const r = Math.floor(v / 100);
        return `${oneDecimal(r / 10).replace('.0', '')}k`;
    }
    return `${Math.round(v / 1000)}k`;
};


export const always3Numbers = (v) => {
    if (v === undefined || v === null) return '';
    if (v < 10) return twoDecimals(v);
    if (v < 100) return oneDecimal(v);
    if (v < 1000) return noDecimals(v);
    if (v < 10000) {
        const r = Math.floor(v / 100);
        return `${oneDecimal(r / 10).replace('.0', '')}k`;
    }
    return `${Math.round(v / 1000)}k`;
};
