// Requirements
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { searchNew, mixersInitialize } from '@magical-mixing/mixers';
import { getLANBroadcastAddress, getLocalAddressForIP } from '../../helpers/lan.js';
import {
    udpSocketOpen,
    udpSocketClose,
    udpMessageSend,
    onUDPMessageReceived,
} from '../../helpers/udp.js';
import { isValidIP, isValidPort } from '../../helpers/values.js';
import { busCapture } from './bus.js';
import { configurationCapture } from './configuration.js';
import { fxCapture } from './fx.js';
import { inputCapture } from './input.js';
import { outputCapture } from './output.js';
import { sceneCapture } from './scene.js';
import { automixCapture } from './automix.js';
import { dcaCapture } from './dca.js';
import { mgCapture } from './mg.js';


// Internal
const capture = async (device) => {
    // Start capturing
    console.log('Capturing');
    device.capture({ start: true });

    // Capture every feature
    await configurationCapture(device);
    await busCapture(device);
    await fxCapture(device);
    await inputCapture(device);
    await outputCapture(device);
    await sceneCapture(device);
    await automixCapture(device);
    await dcaCapture(device);
    await mgCapture(device);

    // Stop and save the results
    device.capture({ stop: true });
    const capturedValues = device.capture();

    // Merge with existing
    const filePath = join(dirname(fileURLToPath(import.meta.url)), '../data.json');
    let toSave = capturedValues;
    if (existsSync(filePath)) {
        try {
            const existing = JSON.parse(readFileSync(filePath, 'utf8'));
            toSave = { ...existing, ...capturedValues };
        } catch (e) {
            console.error('Error parsing existing file', e.message);
        }
    }

    // Sort the keys alphabetically
    const toSaveFinal = Object.fromEntries(Object.entries(toSave)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));

    // Delete some sensible keys, if present!
    toSaveFinal['/-prefs/ap/key'] = '';
    toSaveFinal['/-prefs/is/key'] = '';

    // Save!
    writeFileSync(filePath, JSON.stringify(toSaveFinal, null, 2));

    // Dispose
    await device.dispose();
    console.log('Done!');
    process.exit(0);
};


const onDeviceFound = search => async (data) => {
    const device = await search.getFound(data.ip, data.port);
    await device.connect();
    await search.stop();
    console.log('Device found');
    await capture(device);
};


// Main
const main = async () => {
    mixersInitialize({
        getLANBroadcastAddress,
        getLocalAddressForIP,
        udpSocketOpen,
        udpSocketClose,
        udpMessageSend,
        onUDPMessageReceived,
    });

    const ip = process.argv.length > 2 ? process.argv[2] : null;
    const port = process.argv.length > 3 ? process.argv[3] : null;

    if (!isValidIP(ip) || !isValidPort(port)) {
        console.error('Invalid IP or port');
        process.exit(1);
    }

    console.log(`Searching for ${ip}:${port}`);
    const search = searchNew();
    await search.inIPPort(ip, port, onDeviceFound(search), async () => {
        await search.stop();
        console.error('Device not found');
        process.exit(1);
    });
};


// Run
main();
