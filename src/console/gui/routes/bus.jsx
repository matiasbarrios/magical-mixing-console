// Requirements
import List from '../pages/bus/list';
import View from '../pages/bus/view';


// Exported
export default [
    {
        route: '/bus/list',
        element: <List />,
    },
    {
        route: '/bus/:busId',
        element: <View />,
    },
];
