// Requirements
import List from '../pages/dca/list';
import View from '../pages/dca/view';


// Exported
export default [
    {
        route: '/dca/list',
        element: <List />,
    },
    {
        route: '/dca/:dcaId',
        element: <View />,
    },
];
