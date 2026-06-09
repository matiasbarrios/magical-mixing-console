// Requirements
import ListDevice from '../pages/scene/listDevice';
import ListApp from '../pages/scene/listApp';
import View from '../pages/scene/view';


// Exported
export default [
    {
        route: '/scene/list/device',
        element: <ListDevice />,
    },
    {
        route: '/scene/list/app',
        element: <ListApp />,
    },
    {
        route: '/scene/:sceneId',
        element: <View />,
    },
];
