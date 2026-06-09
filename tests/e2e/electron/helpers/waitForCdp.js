import { E2E_CDP_URL } from '../constants.js';

export const waitForCdp = async (timeoutMs) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        try {
            const response = await fetch(`${E2E_CDP_URL}/json/version`);
            if (response.ok) return;
        } catch {
            // Electron dev server / webpack still starting.
        }
        await new Promise(resolve => { setTimeout(resolve, 500); });
    }

    throw new Error(`Electron CDP not ready at ${E2E_CDP_URL} within ${timeoutMs}ms`);
};
