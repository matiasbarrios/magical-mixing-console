// Requirements
import { hasCall } from '../../helpers/feature';
import { defaultOption } from '../../helpers/changes';


// Internal
const scheduleDcaReset = (changeSchedule, dca, dcaId) => {
    changeSchedule(dca, [`name(${dcaId})`, '']);
    changeSchedule(dca, [`color(${dcaId})`, defaultOption]);
    changeSchedule(dca, [`mute(${dcaId})`, false]);
    changeSchedule(dca, [`level(${dcaId})`, dca.level.minimum]);
    changeSchedule(dca, [`solo(${dcaId})`, false]);
};


// Exported
export const dcaReset = (changeSchedule, dca, dcaId) => {
    hasCall(dca, [], () => {
        scheduleDcaReset(changeSchedule, dca, dcaId);
    });
};


export const dcasReset = (changeSchedule, dca) => {
    hasCall(dca, [], () => {
        dca.options.forEach(({ id }) => {
            scheduleDcaReset(changeSchedule, dca, id);
        });
    });
};
