// Requirements
const osLocale = require('os-locale').default;


// Exported
const getOSLanguage = () => {
    let locale = osLocale();
    locale = (locale || '').split('-');
    return locale[0] || '';
};


// Export
module.exports = {
    getOSLanguage,
};
