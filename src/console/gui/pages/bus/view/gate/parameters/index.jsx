// Requirements
import Mode from './mode';
import Range from './range';


// Exported
export default ({ busId }) => (
    <>
        <Mode busId={busId} />
        <Range busId={busId} />
    </>
);
