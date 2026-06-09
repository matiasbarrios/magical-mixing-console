// Requirements
import List from '../pages/fx/list';
import View from '../pages/fx/view';


// Exported
export default [
    {
        route: '/fx/list',
        element: <List />,
    },
    {
        route: '/fx/:fxId',
        element: <View />,
    },
];
