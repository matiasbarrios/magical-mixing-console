// Requirements
import { hasCall } from '../../helpers/feature';


// Internal
const scheduleMgReset = (changeSchedule, mg, mgId) => {
    changeSchedule(mg, [`mute(${mgId})`, false]);
};


// Exported
export const mgReset = (changeSchedule, mg, mgId) => {
    hasCall(mg, [], () => {
        scheduleMgReset(changeSchedule, mg, mgId);
    });
};


export const mgsReset = (changeSchedule, mg) => {
    hasCall(mg, [], () => {
        mg.options.forEach(({ id }) => {
            scheduleMgReset(changeSchedule, mg, id);
        });
    });
};
