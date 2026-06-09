// Requirements
import { IconButton } from '@radix-ui/themes';
import { useUiSize } from '../../theme';


// Exported
export const HeaderIconButton = ({
    variant = 'ghost',
    radius = 'full',
    color = 'gray',
    size: sizeProp,
    ...props
}) => {
    const { textSize } = useUiSize();

    return (
        <IconButton
            variant={variant}
            radius={radius}
            color={color}
            size={sizeProp ?? textSize}
            {...props}
        />
    );
};
