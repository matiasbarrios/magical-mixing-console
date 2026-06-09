import fs from 'fs';
import { E2E_STATE_FILE } from './constants.js';

export default async function globalTeardown() {
    if (!fs.existsSync(E2E_STATE_FILE)) return;

    const state = JSON.parse(fs.readFileSync(E2E_STATE_FILE, 'utf8'));

    if (!state.attach && state.pid) {
        try {
            process.kill(-state.pid, 'SIGTERM');
        } catch {
            try {
                process.kill(state.pid, 'SIGTERM');
            } catch {
                // Process already stopped.
            }
        }
    }

    if (state.userDataDir) {
        fs.rmSync(state.userDataDir, { recursive: true, force: true });
    }

    fs.rmSync(E2E_STATE_FILE, { force: true });
}
