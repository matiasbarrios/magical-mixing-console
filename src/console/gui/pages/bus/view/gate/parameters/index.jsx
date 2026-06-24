// Requirements
import Mode from './mode';
import Range from './range';
import Threshold from './threshold';


// Exported
export default ({ busId }) => (
    <>
        <Mode busId={busId} />
        <Range busId={busId} />
        <Threshold busId={busId} />
    </>
);
