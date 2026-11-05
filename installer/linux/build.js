// Packages the tinyjs build in dist/ as a .deb. Needs dpkg-deb (Debian / Ubuntu).
// Same package name as the previous desktop .deb, so installing it replaces that one.


// Requirements
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
    root, fail, readJson, versionGet, distCheck,
} = require('../helpers');


// Constants
const packageName = 'magical-mixing-console';
const appId = 'com.magicalmixing.console';
const installDir = `/usr/lib/${packageName}`;
const distFiles = [packageName, 'launcher', 'icon.png'];

const debArchs = { x64: 'amd64', arm64: 'arm64' };

// Libraries the prebuilt tinyjs launcher and tjs runtime link against (glibc 2.35 floor).
// Ubuntu 24.04 renamed some of them with a t64 suffix.
const depends = [
    'libc6 (>= 2.35)',
    'libwebkit2gtk-4.1-0',
    'libgtk-3-0t64 | libgtk-3-0',
    'libayatana-appindicator3-1',
    'libpipewire-0.3-0t64 | libpipewire-0.3-0',
    'libxtst6',
    'libffi8',
];

// The app writes ~/.local/share/applications/<appId>.desktop on first run; the same
// file name makes it shadow this one instead of showing twice in the menu
const desktopEntry = `[Desktop Entry]
Type=Application
Name=Magical Mixing Console
Comment=Control X Air and M Air digital mixers
Exec=${packageName} %U
Icon=${appId}
Terminal=false
StartupWMClass=${appId}
Categories=AudioVideo;Audio;
`;

const launcherScript = `#!/bin/sh
exec ${installDir}/${packageName} "$@"
`;


// Internal
// Debian sorts "2.3.0~beta" before "2.3.0"; "2.3.0-beta" would sort after
const debVersion = version => version.replace(/-/g, '~');


const fileWrite = (file, contents, mode = 0o644) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
    fs.chmodSync(file, mode);
};


const fileCopy = (from, to, mode = 0o644) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    fs.chmodSync(to, mode);
};


const sizeKb = (dir) => {
    const bytes = fs.readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter(e => e.isFile())
        .reduce((total, e) => total + fs.statSync(path.join(e.parentPath, e.name)).size, 0);
    return Math.ceil(bytes / 1024);
};


const controlGet = (version, arch, installedSize) => {
    const { description, homepage } = readJson('package.json');
    return [
        `Package: ${packageName}`,
        `Version: ${debVersion(version)}`,
        `Architecture: ${arch}`,
        'Maintainer: Matías Barrios <matias@magicalmixingconsole.com>',
        `Installed-Size: ${installedSize}`,
        `Depends: ${depends.join(', ')}`,
        'Section: sound',
        'Priority: optional',
        `Homepage: ${homepage || 'https://magicalmixingconsole.com'}`,
        'Description: Control X Air and M Air digital mixers',
        ` ${description}`,
        '',
    ].join('\n');
};


// Run
const build = () => {
    if (process.platform !== 'linux') {
        fail('the .deb is built on Linux. From a Mac, use npm run build-linux-in-github');
    }

    const version = versionGet();
    const arch = debArchs[process.arch];
    if (!arch) fail(`unsupported architecture: ${process.arch}`);
    distCheck(distFiles);

    const staging = path.join(root, 'out', 'deb', `${packageName}_${arch}`);
    fs.rmSync(staging, { recursive: true, force: true });

    const dist = path.join(root, 'dist');
    const stage = (...parts) => path.join(staging, ...parts);

    fileCopy(path.join(dist, packageName), stage('usr/lib', packageName, packageName), 0o755);
    fileCopy(path.join(dist, 'launcher'), stage('usr/lib', packageName, 'launcher'), 0o755);
    fileCopy(path.join(dist, 'icon.png'), stage('usr/lib', packageName, 'icon.png'));
    fileWrite(stage('usr/bin', packageName), launcherScript, 0o755);
    fileWrite(stage('usr/share/applications', `${appId}.desktop`), desktopEntry);
    fileCopy(path.join(dist, 'icon.png'), stage('usr/share/icons/hicolor/512x512/apps', `${appId}.png`));
    fileCopy(path.join(root, 'LICENSE'), stage('usr/share/doc', packageName, 'copyright'));

    const installedSize = sizeKb(staging);
    fileWrite(stage('DEBIAN', 'control'), controlGet(version, arch, installedSize));

    const output = path.join(dist, `${packageName}-${version}-linux-${arch}.deb`);
    try {
        execFileSync('dpkg-deb', ['--build', '--root-owner-group', staging, output], { stdio: 'inherit' });
    } catch (error) {
        if (error.code === 'ENOENT') fail('dpkg-deb not found. Build the .deb on Debian or Ubuntu');
        process.exit(error.status || 1);
    }
    console.log(`==> ${path.relative(root, output)}`);
};


build();
