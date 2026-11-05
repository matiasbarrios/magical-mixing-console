// Requirements
const fs = require('fs');
const path = require('path');


// Constants
const root = path.join(__dirname, '..');


// Exported
const fail = (message) => {
    console.error(`installer: ${message}`);
    process.exit(1);
};


const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));


// The version lives in package.json and tinyjs.json; the installer refuses to build if they differ
const versionGet = () => {
    const { version } = readJson('package.json');
    const tinyjsVersion = readJson('tinyjs.json').version;
    if (version !== tinyjsVersion) {
        fail(`package.json (${version}) and tinyjs.json (${tinyjsVersion}) versions differ`);
    }
    return version;
};


const distCheck = (files) => {
    const missing = files.filter(f => !fs.existsSync(path.join(root, 'dist', f)));
    if (missing.length) fail(`missing in dist/: ${missing.join(', ')}. Run npm run tinyjs-build first`);
};


module.exports = {
    root,
    fail,
    readJson,
    versionGet,
    distCheck,
};
