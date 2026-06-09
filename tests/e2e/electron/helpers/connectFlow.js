import { expect } from '@playwright/test';
import { E2E_DEMO_DEVICE_NAME, E2E_IP, E2E_PORT } from '../constants.js';

/** Stable connect target id (matches `data-mmc-device-endpoint` on the connect page). */
export const deviceEndpointKey = (ip, port) => `${ip}:${port}`;

/** Gray subtitle on a connect-page device row: `{ip} | {deskName}`. */
export const deviceEndpointLabel = (ip, deskName) => `${ip} | ${deskName}`;

export const deviceConnectButton = (page, ip, port) => (
    page.locator(`[data-mmc-device-endpoint="${deviceEndpointKey(ip, port)}"]`)
);

export const logDiscoveredConnectTargets = async (page) => {
    const targets = await page.locator('[data-mmc-device-endpoint]').evaluateAll(
        elements => elements.map((element) => ({
            endpoint: element.getAttribute('data-mmc-device-endpoint'),
            label: element.textContent?.trim() ?? '',
        })),
    );
    return targets;
};

export const connectDeviceByEndpoint = async (
    page,
    ip = E2E_IP,
    port = E2E_PORT,
) => {
    await expect(
        page.getByRole('heading', { name: /Devices found|Dispositivos encontrados/i }),
    ).toBeVisible({ timeout: 45_000 });

    await logDiscoveredConnectTargets(page);

    const button = deviceConnectButton(page, ip, port);
    await expect(button, `Connect button for ${deviceEndpointKey(ip, port)}`).toBeVisible({
        timeout: 45_000,
    });
    await button.click();

    await expect(page.getByRole('tab', { name: /Reception|Recepción/i })).toBeVisible({
        timeout: 45_000,
    });
};

export const openReceptionTab = async (page) => {
    const receptionTab = page.getByRole('tab', { name: /Reception|Recepción/i });
    if (await receptionTab.count() > 0) {
        await receptionTab.click();
        return;
    }

    await page.getByRole('button', { name: /More|Más/i }).click();
    await page.getByRole('menuitem', { name: /Reception|Recepción/i }).click();
};
