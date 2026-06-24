// Requirements
import { Flex, Spinner } from '@radix-ui/themes';
import SearchDetails from './searchDetails';


// Exported
export default () => (
    <Flex align="center" justify="center" gap="3">
        <Spinner />
        <SearchDetails />
    </Flex>
);
