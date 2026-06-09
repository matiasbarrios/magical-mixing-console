// Exported
export const isValidIP = v => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(v)
    && v.split('.').every(n => n >= 0 && n <= 255);


export const isValidPort = port => (port >= 1 && port <= 65536);
