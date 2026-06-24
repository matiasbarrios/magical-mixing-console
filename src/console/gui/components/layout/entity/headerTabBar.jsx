// Requirements
import { Flex } from '@radix-ui/themes';
import OverflowTabs from '../../base/overflowTabs';


// Exported
export default ({ tabs, active, onChange }) => (
    <Flex width="100%" minWidth="0" justify="center">
        <OverflowTabs
            variant="header"
            tabs={tabs}
            active={active}
            onChange={onChange}
        />
    </Flex>
);
