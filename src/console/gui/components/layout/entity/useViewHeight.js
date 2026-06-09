// Requirements
import { useMemo } from 'react';
import { headerHeight } from '../header';
import { useFooter, useFooterHeight } from '../footer';
import { layoutPaddingYPx } from '../contentPadding';


export const entityViewShellStyle = viewHeight => ({
    height: viewHeight,
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box',
});


// Exported
export const useEntityViewHeight = (layoutPaddingY = layoutPaddingYPx) => {
    const { rendered: footerRendered } = useFooter();
    const footerHeight = useFooterHeight();

    return useMemo(() => (
        `calc(var(--mmc-viewport-height) - ${headerHeight}${footerRendered ? ` - ${footerHeight}` : ''} - ${layoutPaddingY})`
    ), [footerRendered, footerHeight, layoutPaddingY]);
};
