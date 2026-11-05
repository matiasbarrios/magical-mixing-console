// Exported
export const call = (method, ...args) => window.tiny.api.call(`mmc.${method}`, { args });


export const on = (event, callback) => window.tiny.api.on(`mmc.${event}`, callback);
