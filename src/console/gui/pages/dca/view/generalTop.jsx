// Requirements
import { Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import EditButton from './editButton';
import Level from './level';
import DcaQuickActions from './dcaActions';


// Exported
export default ({ dcaId }) => {
    const { t } = useLanguage();

    return (
        <Flex align="center" gapX="1" width="100%" minWidth="0" wrap="nowrap">
            <EditButton dcaId={dcaId} />
            <Flex flexGrow="1" minWidth="0" width="100%">
                <Level dcaId={dcaId} minWidth="0" fullWidth label={t('Level')} />
            </Flex>
            <DcaQuickActions dcaId={dcaId} />
        </Flex>
    );
};
