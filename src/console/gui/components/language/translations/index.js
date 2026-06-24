// Requirements
import de from './de';
import es from './es';


// Constants
const languages = {
    de,
    es,
};

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'German' },
    { value: 'es', label: 'Spanish' },
];


// Variables
let osLanguage = null;


// Exported
export const getTranslation = (language, key, subkey) => {
    // If language not present or translation not available then use the key itself
    if (!languages[language] || !languages[language][key] || !languages[language][key]) {
        return key;
    }
    if (subkey) return languages[language][`${key}_${subkey}`];
    return languages[language][key];
};


export const translationInitialize = async (platformOSLanguage) => {
    osLanguage = platformOSLanguage || 'en';
};


export const getOSLanguage = () => osLanguage;


export { LANGUAGE_OPTIONS };
