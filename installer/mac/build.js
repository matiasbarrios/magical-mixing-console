// Builds and notarizes both macOS DMGs on this machine.
// Silicon first, then Intel: both write dist/Magical Mixing Console.app,
// and notarize staples that .app before the next build replaces it.
// Each stapled DMG is moved to out/macos-arm64 or out/macos-x86_64.


const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { root, fail, readJson, versionGet } = require('../helpers');


const archs = [
    ['arm64', 'macos-arm64'],
    ['x86_64', 'macos-x86_64'],
];


const step = (command, args) => {
    try {
        execFileSync(command, args, { cwd: root, stdio: 'inherit' });
    } catch (error) {
        if (error.code === 'ENOENT') fail(`${command} not found`);
        process.exit(error.status || 1);
    }
};


// tinyjs notarize rewrites the DMG in dist/ from the stapled .app
const dmgMove = (arch, dirName) => {
    const version = versionGet();
    const { name } = readJson('tinyjs.json');
    const file = `${name}-${version}-macos-${arch}.dmg`;
    const from = path.join(root, 'dist', file);
    if (!fs.existsSync(from)) fail(`missing dist/${file}`);

    const dir = path.join(root, 'out', dirName);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(from, path.join(dir, file));
    console.log(`==> out/${dirName}/${file}`);
};


if (process.platform !== 'darwin') fail('the macOS DMGs are built on a Mac');

for (const [arch, dirName] of archs) {
    step('npm', ['run', 'tinyjs-build', '--', '--dmg', '--arch', arch]);
    step('tinyjs', ['notarize', '--arch', arch]);
    dmgMove(arch, dirName);
}
