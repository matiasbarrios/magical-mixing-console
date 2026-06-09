// Requirements
import {
    Button, Dialog, Flex, Text,
} from '@radix-ui/themes';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Internal
const CloseButton = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    return (
        <Dialog.Close>
            <Button variant="ghost" color="gray" size={textSize}>
                { t('Close') }
            </Button>
        </Dialog.Close>
    );
};


const TitleContent = ({ children }) => {
    const { textSize } = useUiSize();

    if (typeof children === 'string' || typeof children === 'number') {
        return <Text size={textSize}>{ children }</Text>;
    }
    return children;
};


// Exported
export default ({ children, mb = '4' }) => {
    const { textSize } = useUiSize();

    return (
        <Flex align="center" justify="between" gap="2" width="100%" mb={mb}>
            <Flex align="center" gap="1" minWidth="0" wrap="nowrap" flexGrow="1">
                <Dialog.Title mb="0" size={textSize} trim="both">
                    <TitleContent>{ children }</TitleContent>
                </Dialog.Title>
            </Flex>
            <Flex flexShrink="0">
                <CloseButton />
            </Flex>
        </Flex>
    );
};
