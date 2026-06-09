import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from '@playwright/test';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    testDir: path.join(repoRoot, 'tests/e2e/electron'),
    timeout: 90_000,
    expect: {
        timeout: 45_000,
    },
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    globalSetup: path.join(repoRoot, 'tests/e2e/electron/global-setup.js'),
    globalTeardown: path.join(repoRoot, 'tests/e2e/electron/global-teardown.js'),
    reporter: 'list',
});
