// Exported
export const doAsync = async (elements, whatToDo) => {
    if (!Array.isArray(elements)) {
        return;
    }
    const doIt = async (i = 0) => {
        if (i === elements.length) {
            return;
        }
        await whatToDo(elements[i], i);
        await doIt(i + 1);
    };
    await doIt();
};
