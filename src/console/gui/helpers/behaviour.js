// Exported
export const preventDefault = f => (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (typeof f === 'function') f();
};


export const noPointerDown = (e) => {
    if (e?.preventDefault) e.preventDefault();
};
