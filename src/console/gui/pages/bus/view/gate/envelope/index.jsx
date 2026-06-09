// Requirements
import { Text } from '@radix-ui/themes';
import { useLanguage } from '../../../../../components/language';
import Attack from './attack';
import Hold from './hold';
import Release from './release';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    return (
        <>
            <Text size="1" color="gray" align="center">
                { t('Envelope', undefined, true) }
            </Text>
            <Attack busId={busId} />
            <Hold busId={busId} />
            <Release busId={busId} />
        </>
    );
};
