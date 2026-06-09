
// Requirements
import Empty from '../pages/empty';
import Start from '../pages/start';
import device from './device';
import bus from './bus';
import fx from './fx';
import input from './input';
import output from './output';
import scene from './scene';
import automix from './automix';
import dca from './dca';
import mg from './mg';
import settings from './settings';
import vault from './vault';


// Exported
export default [
    {
        route: '/',
        element: <Start />,
    },
    ...device,
    ...bus,
    ...fx,
    ...input,
    ...output,
    ...scene,
    ...automix,
    ...dca,
    ...mg,
    ...settings,
    ...vault,
    {
        route: '*',
        element: <Empty />,
    },
];
