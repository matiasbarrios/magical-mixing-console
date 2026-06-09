// Requirements
import {
    hasCall, hasGetOnlyOnce, hasSet, hasSetDefaultOption,
} from './feature';


// Constants
const defaultOption = undefined;


// Internal
const parseIds = (p) => {
    const ids = p.split(',').map(i => parseInt(i.trim(), 10));
    if (ids.every(i => !Number.isNaN(i))) return ids;
    throw new Error(`Invalid ids: ${p}`);
};


const parseFeatureAndIds = (s) => {
    const match = s.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    if (match?.length === 3) return [match[1], parseIds(match[2])];
    throw new Error(`Unable to parse the feature and id: ${s}`);
};


const getNestedFeatureAndIds = (path, ids) => {
    let subFeatureName;
    if (path.includes('(')) {
        let subIds;
        [subFeatureName, subIds] = parseFeatureAndIds(path);
        ids.push(...subIds);
    } else {
        subFeatureName = path;
    }
    return subFeatureName;
};


const accessSubFeature = (feature, subFeatureName, subpaths) => {
    const subFeature = feature[subFeatureName];
    if (subFeature === undefined || typeof subFeature !== 'object'
        || subFeature?.has === undefined || (!subpaths.length && subFeature?.set === undefined)) {
        throw new Error(`Feature ${subFeatureName} not found or not valid`);
    }
    return subFeature;
};


const pathHasRecursive = ({
    feature, path, subpaths, ids = [], ancestors = [], onHasResolved,
}) => {
    const subFeatureName = getNestedFeatureAndIds(path, ids);
    const subFeature = accessSubFeature(feature, subFeatureName, subpaths);

    // Are we done?
    if (!subpaths.length) {
        hasCall(subFeature, ids, () => {}, has => onHasResolved(has));
        return;
    }

    // Recurse
    hasCall(subFeature, ids, () => {
        pathHasRecursive({
            feature: subFeature,
            ids,
            path: subpaths[0],
            subpaths: subpaths.slice(1),
            ancestors: [...ancestors, subFeatureName],
            onHasResolved,
        });
    }, (hasSubFeature) => {
        if (!hasSubFeature) onHasResolved(false);
    });
};


const pathGetRecursive = ({
    feature, path, subpaths, ids = [], ancestors = [],
    onHasResolved, onGotten, onFailed,
}) => {
    const subFeatureName = getNestedFeatureAndIds(path, ids);
    const subFeature = accessSubFeature(feature, subFeatureName, subpaths);

    // Are we done?
    if (!subpaths.length) {
        hasGetOnlyOnce(
            subFeature, ids, onGotten, onHasResolved, onFailed
        );
        return;
    }

    // Recurse
    hasCall(subFeature, ids, () => {
        pathGetRecursive({
            feature: subFeature,
            ids,
            path: subpaths[0],
            subpaths: subpaths.slice(1),
            ancestors: [...ancestors, subFeatureName],
            onHasResolved,
            onGotten,
            onFailed,
        });
    }, (hasSubFeature) => {
        if (!hasSubFeature) onHasResolved(false);
    });
};


const pathSetRecursive = ({
    feature, path, subpaths, value, ids = [], ancestors = [],
}) => {
    const subFeatureName = getNestedFeatureAndIds(path, ids);
    const subFeature = accessSubFeature(feature, subFeatureName, subpaths);

    // Are we done?
    if (!subpaths.length) {
        // console.log('path set', [...ancestors, subFeatureName], ids, value);
        if (value === defaultOption) hasSetDefaultOption(subFeature, ids);
        else hasSet(subFeature, ids, value);
        return;
    }

    // Recurse
    hasCall(subFeature, ids, () => {
        pathSetRecursive({
            feature: subFeature,
            ids,
            path: subpaths[0],
            subpaths: subpaths.slice(1),
            value,
            ancestors: [...ancestors, subFeatureName],
        });
    });
};


// Exported
export const pathHas = (feature, fullPath, onHasResolved) => {
    if (typeof fullPath !== 'string') throw new Error('Path must be a string');

    const pathSplitted = fullPath.split('.');
    const path = pathSplitted[0];
    const subpaths = pathSplitted.slice(1);

    pathHasRecursive({
        feature, path, subpaths, onHasResolved,
    });
};


export const pathGet = (
    feature, path, onHasResolved, onGotten, onFailed
) => {
    if (typeof path !== 'string') throw new Error('Path must be a string');

    const pathSplitted = path.split('.');
    const parentPath = pathSplitted[0];
    const subpaths = pathSplitted.slice(1);

    pathGetRecursive({
        feature,
        path: parentPath,
        subpaths,
        onHasResolved,
        onGotten,
        onFailed,
    });
};


export const pathSet = (feature, pathAndValue) => {
    if (!Array.isArray(pathAndValue) || pathAndValue.length !== 2
        || !pathAndValue[0] || typeof pathAndValue[0] !== 'string') {
        throw new Error('Path and value must be an array of two elements');
    }

    const [fullPath, value] = pathAndValue;
    const pathSplitted = fullPath.split('.');
    const path = pathSplitted[0];
    const subpaths = pathSplitted.slice(1);

    pathSetRecursive({
        feature, path, subpaths, value,
    });
};
