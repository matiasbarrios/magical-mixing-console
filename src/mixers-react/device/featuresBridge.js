// Variables
let currentFeatures = null;


// Exported
export const setCurrentFeatures = (features) => {
    currentFeatures = features || null;
};


export const getCurrentFeatures = () => currentFeatures;
