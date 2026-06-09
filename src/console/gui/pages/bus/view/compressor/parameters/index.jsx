// Requirements
import Mode from './mode';
import Knee from './knee';
import Ratio from './ratio';
import MakeupGain from './makeupGain';


// Exported
export default ({ busId }) => (
    <>
        <Mode busId={busId} />
        <Ratio busId={busId} />
        <Knee busId={busId} />
        <MakeupGain busId={busId} />
    </>
);
