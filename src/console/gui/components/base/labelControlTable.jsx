// Requirements
import { useMemo } from 'react';
import { Text } from '@radix-ui/themes';
import { useUiSize } from '../theme';
import { useScreen } from './screen';


// Internal
const List = ({ children, className }) => (
    <table className={className ? `label-control-table ${className}` : 'label-control-table'}>
        <tbody>
            {children}
        </tbody>
    </table>
);


const Row = ({
    ref, style, opacity, children,
}) => (
    <tr ref={ref} style={{ ...style, opacity: opacity ?? 1 }}>
        {children}
    </tr>
);


const Cell = ({
    children, colSpan, width, minHeight,
}) => {
    const {
        xs, sm, md, lg, xl,
    } = useScreen();

    const widthFinal = useMemo(() => {
        if (!width?.includes(':')) return width;

        const rawSizes = Object.fromEntries(width.split(';')
            .map(pair => pair.split(':'))
            .filter(([k, v]) => k && v));

        const screenSizes = [
            ['xs', xs],
            ['sm', sm],
            ['md', md],
            ['lg', lg],
            ['xl', xl],
        ];

        let lastValue = '';
        screenSizes.some(([key, isActive]) => {
            if (rawSizes[key]) lastValue = rawSizes[key];
            return isActive;
        });

        return lastValue;
    }, [width, xs, sm, md, lg, xl]);

    const style = useMemo(() => ({
        ...(widthFinal && { width: widthFinal }),
        ...(minHeight && { minHeight }),
    }), [widthFinal, minHeight]);

    return (
        <td colSpan={colSpan} style={style}>
            {children}
        </td>
    );
};


const LabelControlTable = {
    List,
    Row,
    Cell,
};

const LABEL_CONTROL_CLASS = 'label-control-table--label-control';
const LABEL_WIDTH = 'xs:33%;md:1%';


const Label = ({ children, wrap = 'nowrap', ...props }) => {
    const { textSize } = useUiSize();

    return (
        <Text size={textSize} color="gray" wrap={wrap} {...props}>
            { children }
        </Text>
    );
};


// Exported
export {
    LabelControlTable,
    Label,
    LABEL_CONTROL_CLASS,
    LABEL_WIDTH,
};
