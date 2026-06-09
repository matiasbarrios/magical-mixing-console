// Requirements
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import Volume from './volume';


// Exported
export default ({ outputId }) => {
    const { t } = useLanguage();

    return (
        <Flex align="center" gapX="1" width="100%" minWidth="0">
            <Flex flexGrow="1" minWidth="0">
                <Volume outputId={outputId} minWidth="0" fullWidth trackStart={t('Level')} />
            </Flex>
        </Flex>
    );
};
