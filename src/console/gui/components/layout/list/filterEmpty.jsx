// Requirements
import {
    createContext, useContext, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../language';
import { useUiSize } from '../../theme';


// Internal
const ListFilterEmptyContext = createContext(null);


const ListFilterEmpty = ({ show }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    if (!show) return null;

    return (
        <Flex justify="center" width="100%" py="4">
            <Text size={textSize} color="gray">
                { t('No results') }
            </Text>
        </Flex>
    );
};


export const ListFilterScope = ({ filterBy, children }) => {
    const visibleRef = useRef(new Map());
    const [, setVersion] = useState(0);

    const api = useMemo(() => ({
        setVisible: (id, visible) => {
            const prev = visibleRef.current.get(id);
            visibleRef.current.set(id, visible);
            if (prev !== visible) setVersion(v => v + 1);
        },
        remove: (id) => {
            if (visibleRef.current.has(id)) {
                visibleRef.current.delete(id);
                setVersion(v => v + 1);
            }
        },
    }), []);

    let showEmpty = false;
    if (filterBy.trim()) {
        let count = 0;
        visibleRef.current.forEach((visible) => {
            if (visible) count += 1;
        });
        showEmpty = count === 0;
    }

    return (
        <ListFilterEmptyContext.Provider value={api}>
            { children }
            <ListFilterEmpty show={showEmpty} />
        </ListFilterEmptyContext.Provider>
    );
};


export const useListFilterVisibility = (id, hidden) => {
    const ctx = useContext(ListFilterEmptyContext);

    useLayoutEffect(() => {
        if (!ctx) return undefined;
        ctx.setVisible(id, !hidden);
        return () => ctx.remove(id);
    }, [ctx, id, hidden]);
};


// Exported
export default ListFilterEmpty;
