import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export const E2E_IP = '127.0.0.1';

/** Virtual X18 desk name (`src/virtual-devices/x18/run/index.js` → `deviceName`). */
export const E2E_DEMO_DEVICE_NAME = 'X18-DEMO';

/** Port the connect page broadcast search uses (see `src/mixers/drivers/xair/search.js`). */
export const E2E_PORT = 10024;

/** X Air main bus id (`src/mixers/drivers/xair/device/bus/options.js`). */
export const MAIN_BUS_ID = 27;

/** Virtual X18 desk snapshot: `src/virtual-devices/x18/data.json` → `/ch/01/config/name`. */
export const E2E_CHANNEL_01_NAME = 'Vocal 1';

export const E2E_CDP_PORT = Number(process.env.MMC_E2E_CDP_PORT || 9222);

export const E2E_CDP_URL = `http://127.0.0.1:${E2E_CDP_PORT}`;

export const REPO_ROOT = repoRoot;

export const E2E_STATE_FILE = path.join(repoRoot, 'tests/e2e/electron/.e2e-state.json');

/** First webpack compile during `electron-forge start` can take several minutes. */
export const E2E_DEV_START_TIMEOUT_MS = 180_000;
