// Requirements
import List from '../pages/output/list';
import View from '../pages/output/view';


// Exported
export default [
    {
        route: '/output/list',
        element: <List />,
    },
    {
        route: '/output/:outputId',
        element: <View />,
    },
];
