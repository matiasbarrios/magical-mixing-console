// Compiles the Windows installer from the tinyjs build in dist/.
// Needs Inno Setup 6.3+ (ISCC.exe).


// Requirements
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { fail, versionGet, distCheck } = require('../helpers');


// Constants
const script = path.join(__dirname, 'magical-mixing-console.iss');


// Internal
const isccFind = () => {
    const { env } = process;
    const candidates = [
        env.ISCC,
        env['ProgramFiles(x86)'] && path.join(env['ProgramFiles(x86)'], 'Inno Setup 6', 'ISCC.exe'),
        env.ProgramFiles && path.join(env.ProgramFiles, 'Inno Setup 6', 'ISCC.exe'),
        env.LOCALAPPDATA && path.join(env.LOCALAPPDATA, 'Programs', 'Inno Setup 6', 'ISCC.exe'),
    ].filter(Boolean);
    return candidates.find(c => fs.existsSync(c)) || 'ISCC.exe';
};


// Run
const build = () => {
    if (process.platform !== 'win32') {
        fail('the Windows installer is built on Windows. From a Mac, use npm run build-windows-in-github');
    }

    const version = versionGet();
    distCheck(['magical-mixing-console.exe', 'launcher.exe']);

    try {
        execFileSync(isccFind(), [`/DAppVersion=${version}`, script], { stdio: 'inherit' });
    } catch (error) {
        if (error.code === 'ENOENT') fail('ISCC.exe not found. Install Inno Setup 6 or set ISCC to its path');
        process.exit(error.status || 1);
    }
};


build();
