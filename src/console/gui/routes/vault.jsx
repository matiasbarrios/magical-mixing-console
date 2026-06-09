// Requirements
import List from '../pages/vault/list';
import View from '../pages/vault/view';


// Exported
export default [
    {
        route: '/vault/list/:vaultType',
        element: <List />,
    },
    {
        route: '/vault/:vaultId',
        element: <View />,
    },
];
