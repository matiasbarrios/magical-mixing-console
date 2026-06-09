import { test, expect } from '@playwright/test';
import { connectToElectronDev, disconnectElectronDev } from './helpers/electronApp.js';
import {
    connectDeviceByEndpoint,
    deviceConnectButton,
    deviceEndpointLabel,
    openReceptionTab,
} from './helpers/connectFlow.js';
import { startVirtualX18, stopVirtualX18 } from './helpers/virtualX18.js';
import {
    E2E_CHANNEL_01_NAME,
    E2E_DEMO_DEVICE_NAME,
    E2E_IP,
    E2E_PORT,
} from './constants.js';

test.describe('connect page', () => {
    test.beforeAll(async () => {
        await startVirtualX18();
    });

    test.afterAll(async () => {
        await stopVirtualX18();
    });

    test('lists virtual X18 on the connect page', async () => {
        const { browser, page } = await connectToElectronDev();

        try {
            await expect(
                page.getByRole('heading', { name: /Devices found|Dispositivos encontrados/i }),
            ).toBeVisible({ timeout: 45_000 });

            const demoLabel = deviceEndpointLabel(E2E_IP, E2E_DEMO_DEVICE_NAME);
            await expect(page.getByText(demoLabel, { exact: true })).toBeVisible();
            await expect(page.getByText('Behringer X18').first()).toBeVisible();
            await expect(deviceConnectButton(page, E2E_IP, E2E_PORT)).toBeVisible();
        } finally {
            await disconnectElectronDev(browser);
        }
    });

    test('shows channel name on main reception after connect', async () => {
        const { browser, page } = await connectToElectronDev();

        try {
            await connectDeviceByEndpoint(page, E2E_IP, E2E_PORT);
            await openReceptionTab(page);

            await expect(page.getByText(E2E_CHANNEL_01_NAME).first()).toBeVisible({
                timeout: 45_000,
            });
        } finally {
            await disconnectElectronDev(browser);
        }
    });
});
