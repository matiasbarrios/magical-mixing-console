// Requirements
import List from '../pages/mg/list';
import View from '../pages/mg/view';


// Exported
export default [
    {
        route: '/mg/list',
        element: <List />,
    },
    {
        route: '/mg/:mgId',
        element: <View />,
    },
];
