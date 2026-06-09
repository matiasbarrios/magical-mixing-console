import { chromium } from '@playwright/test';
import { E2E_CDP_URL } from '../constants.js';

const isAppPage = page => !page.url().startsWith('devtools://');

export const connectToElectronDev = async () => {
    const browser = await chromium.connectOverCDP(E2E_CDP_URL);
    const pages = browser.contexts().flatMap(context => context.pages());
    const page = pages.find(isAppPage) ?? pages[0];

    if (!page) {
        await browser.close();
        throw new Error('No Electron renderer page found via CDP');
    }

    await page.waitForLoadState('domcontentloaded');
    return { browser, page };
};

export const disconnectElectronDev = async (browser) => {
    await browser.close();
};
