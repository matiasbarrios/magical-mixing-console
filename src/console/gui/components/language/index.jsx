// Requirements
import {
    createContext, useCallback, useContext, useMemo,
} from 'react';
import { ucFirst } from '../../helpers/format';
import { useSettings } from '../global/settings';
import { getOSLanguage, getTranslation } from './translations';


// Variables
const Context = createContext({});


// Exported
export const LanguageContext = ({ children }) => {
    const [language, languageSet] = useSettings('language', getOSLanguage());
    const [translateConcepts, translateConceptsSet] = useSettings('translate-concepts', false);

    const state = useMemo(() => ({
        language, languageSet, translateConcepts, translateConceptsSet,
    }), [language, languageSet, translateConcepts, translateConceptsSet]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


export const useLanguage = () => {
    const {
        language, languageSet, translateConcepts, translateConceptsSet,
    } = useContext(Context);

    const translateConceptsToggle = useCallback(() => translateConceptsSet(!translateConcepts), [
        translateConcepts, translateConceptsSet]);

    const t = useCallback((key, subkey, isAConcept) => {
        if (isAConcept && !translateConcepts) return key;
        return getTranslation(language, key, subkey);
    }, [language, translateConcepts]);

    const translateOption = (option, value) => {
        if (value) return value;
        if (!option?.type) return '';
        return `${ucFirst(t(option.type))} ${option.number ?? ''}`.trim();
    };

    const translateTry = useCallback((input) => {
        // Split the input string into tokens separated by whitespace
        const isNumber = s => /^-?\d+(\.\d+)?$/.test(s);
        const tokens = input.match(/\S+/g) || [];
        const result = [];
        let index = 0;

        while (index < tokens.length) {
            const currentToken = tokens[index];

            if (isNumber(currentToken)) {
            // If the current token is a number, append it as is
                result.push(currentToken);
                index += 1;
            } else {
                // Determine the maximum group size without numbers starting at the current index
                let maxGroupSize = 0;
                while (index + maxGroupSize < tokens.length
                    && !isNumber(tokens[index + maxGroupSize])) maxGroupSize += 1;

                // Attempt to translate the largest possible group first
                let translated;
                let groupSize = maxGroupSize;

                while (groupSize > 0) {
                    const group = tokens.slice(index, index + groupSize).join(' ');
                    translated = t(group);
                    // If translation is different from the group, it means it was found
                    if (translated !== group) {
                    // Translation found, append it and move the index forward
                        result.push(translated);
                        index += groupSize;
                        break;
                    }
                    groupSize -= 1; // Reduce the group size and try again
                }

                if (groupSize === 0) {
                    // No translation found for any group size, append the current word as is
                    result.push(currentToken);
                    index += 1;
                }
            }
        }

        // Join the translated tokens back into a single string
        return result.join(' ');
    }, [t]);

    return {
        t,
        language,
        languageSet,
        translateConcepts,
        translateConceptsToggle,
        translateOption,
        translateTry,
    };
};


export const busTypesPlural = {
    main: 'Mains',
    secondary: 'Secondaries',
    effect: 'Effect buses',
    channel: 'Channels',
    line: 'Lines',
    monitor: 'Monitors',
};

