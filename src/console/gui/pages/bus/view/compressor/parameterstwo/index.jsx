// Requirements
import Mix from './mix';
import Determination from './determination';


// Exported
export default ({ busId }) => (
    <>
        <Determination busId={busId} />
        <Mix busId={busId} />
    </>
);
