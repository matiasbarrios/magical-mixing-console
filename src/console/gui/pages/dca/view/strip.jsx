// Requirements
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import Mute from './mute';
import Level from './level';
import Solo from './solo';
import Remove from './remove';


// Exported
export default ({ dcaId }) => {
    const { t } = useLanguage();
    return (
        <Flex align="center" gapX="1" width="100%" minWidth="0">
            <Level dcaId={dcaId} minWidth="0" label={t('Level')} />
            <Solo dcaId={dcaId} />
            <Mute dcaId={dcaId} />
            <Remove dcaId={dcaId} />
        </Flex>
    );
};
