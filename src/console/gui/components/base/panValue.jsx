// Requirements
import { useMemo } from 'react';


// Constants
const size = 24;

const cx = 12;

const cy = 12;

const radius = 9;

const strokeWidth = 2;

const dotRadius = 2.5;


// Internal
const polarToXY = (r, angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
});


const describeArc = (r, startAngle, endAngle) => {
    const start = polarToXY(r, startAngle);
    const end = polarToXY(r, endAngle);
    const angleDiff = endAngle - startAngle;
    const largeArc = Math.abs(angleDiff) > Math.PI ? 1 : 0;
    const sweep = angleDiff > 0 ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};


const valueToAngle = (value, minimum, maximum) => {
    const t = (value - minimum) / (maximum - minimum);
    return Math.PI + t * Math.PI;
};


// Exported
export const PanValue = ({
    value,
    minimum,
    maximum,
    inheritColor = false,
    dotRadius: dotRadiusProp = dotRadius,
}) => {
    const trackStroke = inheritColor
        ? 'color-mix(in srgb, currentColor 40%, transparent)'
        : 'var(--gray-a6)';
    const dotFill = inheritColor ? 'currentColor' : 'var(--gray-11)';

    const backgroundPath = useMemo(() => describeArc(radius, Math.PI, Math.PI * 2),
        []);

    const dot = useMemo(() => {
        if (value === undefined) return null;
        const valueAngle = valueToAngle(value, minimum, maximum);
        return polarToXY(radius, valueAngle);
    }, [value, minimum, maximum]);

    return (
        <svg
            width={size}
            height={Math.round(size * 0.65)}
            viewBox={`0 0 ${size} ${Math.round(size * 0.65)}`}
            aria-hidden
            style={{ display: 'block', flexShrink: 0 }}
        >
            <path
                d={backgroundPath}
                fill="none"
                stroke={trackStroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {dot && (
                <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dotRadiusProp}
                    fill={dotFill}
                />
            )}
        </svg>
    );
};
