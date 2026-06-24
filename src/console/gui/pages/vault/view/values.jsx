// Requirements
import { useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { fromCamelCaseToUCFirst } from '../../../helpers/format';


// Internal
const formatScalar = (value, t) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? t('Yes') : t('No');
    return String(value);
};


const isNestedValue = value => value !== null && typeof value === 'object';


const joinLabel = (parent, child) => (
    parent ? `${parent} · ${child}` : child
);


const collectRows = (value, label, rows, t) => {
    if (!isNestedValue(value)) {
        if (label !== undefined) {
            rows.push({ label, value: formatScalar(value, t) });
        }
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            const itemLabel = joinLabel(label, String(index + 1));
            if (!isNestedValue(item)) {
                rows.push({ label: itemLabel, value: formatScalar(item, t) });
                return;
            }
            Object.entries(item).forEach(([key, nestedValue]) => {
                collectRows(nestedValue,
                    joinLabel(itemLabel, fromCamelCaseToUCFirst(key)),
                    rows,
                    t);
            });
        });
        return;
    }

    Object.entries(value).forEach(([key, nestedValue]) => {
        collectRows(nestedValue,
            joinLabel(label, fromCamelCaseToUCFirst(key)),
            rows,
            t);
    });
};


// Exported
export default ({ content }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const rows = useMemo(() => {
        const result = [];
        collectRows(content, undefined, result, t);
        return result;
    }, [content, t]);

    return rows.map(({ label, value }, index) => (
        <LabelControlTable.Row key={`${label}-${index}`}>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { label }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <Text size={textSize} wrap="nowrap">
                        { value }
                    </Text>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    ));
};
