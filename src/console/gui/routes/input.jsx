// Requirements
import List from '../pages/input/list';
import View from '../pages/input/view';


// Exported
export default [
    {
        route: '/input/list',
        element: <List />,
    },
    {
        route: '/input/:inputId',
        element: <View />,
    },
];
