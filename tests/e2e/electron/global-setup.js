import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import {
    E2E_CDP_PORT,
    E2E_DEV_START_TIMEOUT_MS,
    E2E_STATE_FILE,
    REPO_ROOT,
} from './constants.js';
import { waitForCdp } from './helpers/waitForCdp.js';

const writeState = (state) => {
    fs.writeFileSync(E2E_STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
};

export default async function globalSetup() {
    if (process.env.MMC_E2E_ATTACH) {
        await waitForCdp(E2E_DEV_START_TIMEOUT_MS);
        writeState({ attach: true });
        return;
    }

    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mmc-e2e-'));

    const child = spawn(
        'npx',
        ['electron-forge', 'start'],
        {
            cwd: REPO_ROOT,
            detached: true,
            stdio: 'ignore',
            env: {
                ...process.env,
                MMC_E2E: '1',
                MMC_E2E_CDP_PORT: String(E2E_CDP_PORT),
                MMC_E2E_USER_DATA: userDataDir,
                FORCE_COLOR: '0',
            },
        },
    );

    child.unref();

    try {
        await waitForCdp(E2E_DEV_START_TIMEOUT_MS);
    } catch (error) {
        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch {
            // Process may have already exited.
        }
        throw error;
    }

    writeState({
        attach: false,
        pid: child.pid,
        userDataDir,
    });
}
