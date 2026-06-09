// Requirements
const fs = require('fs');
const path = require('path');
const {
    app, dialog, Menu, nativeImage, screen,
} = require('electron');


// Constants — iPhone 16 Pro logical size (402×874 pt) for web marketing captures
const DEFAULT_WIDTH = 402;

const DEFAULT_HEIGHT = 874;

// App Store 6.9" display (iPhone 16 Pro Max): 440×956 pt @ 3× → 1320×2868 px
const STORE_IPHONE_WIDTH = 440;

const STORE_IPHONE_HEIGHT = 956;

const STORE_IPHONE_SCALE = 3;

// App Store 13" iPad (Pro M4): 1032×1376 pt @ 2× → 2064×2752 px
const STORE_IPAD_WIDTH = 1032;

const STORE_IPAD_HEIGHT = 1376;

const STORE_IPAD_SCALE = 2;

// Play Store 7" tablet: 600×960 logical @ 2× → 1200×1920 px
const STORE_PLAY_TABLET_7_WIDTH = 600;

const STORE_PLAY_TABLET_7_HEIGHT = 960;

const STORE_PLAY_TABLET_7_SCALE = 2;

// Play Store 10" tablet: 900×1280 logical @ 2× → 1800×2560 px
const STORE_PLAY_TABLET_10_WIDTH = 900;

const STORE_PLAY_TABLET_10_HEIGHT = 1280;

const STORE_PLAY_TABLET_10_SCALE = 2;


// Internal
const wait = ms => new Promise((resolve) => {
    setTimeout(resolve, ms);
});


const getDisplayScaleFactor = (mainWindow) => {
    const display = screen.getDisplayMatching(mainWindow.getBounds());
    return display.scaleFactor || 1;
};


const resolveScaleFactor = (mainWindow, options) => {
    if (options.scaleFactor != null) return options.scaleFactor;
    return getDisplayScaleFactor(mainWindow);
};


const getWebsiteAssetsDir = () => path.join(app.getPath('documents'), 'mmc-screenshots');


const logScreenshotResult = (result) => {
    if (result.canceled) return;
    const storeOk = result.enforceExactSize
        && result.width === result.targetWidth
        && result.height === result.targetHeight;
    let storeNote = '';
    if (result.enforceExactSize) {
        storeNote = storeOk ? ' (App Store size OK)' : ' (WARNING: wrong store dimensions)';
    }
    console.log(`Screenshot saved: ${result.path} `
        + `(${result.width}×${result.height}, ${result.method}, `
        + `display@${result.displayScale ?? '?'}x)${storeNote}`);
};


const captureViaCdp = async (webContents, {
    width, height, scaleFactor, delayMs, mobile = true,
}) => {
    const { debugger: dbg } = webContents;
    if (dbg.isAttached()) {
        throw new Error('Debugger already attached');
    }

    dbg.attach('1.3');
    try {
        await dbg.sendCommand('Emulation.setDeviceMetricsOverride', {
            width,
            height,
            deviceScaleFactor: scaleFactor,
            mobile,
            screenWidth: width,
            screenHeight: height,
        });
        await wait(delayMs);
        const { data } = await dbg.sendCommand('Page.captureScreenshot', {
            format: 'png',
            fromSurface: true,
        });
        return nativeImage.createFromBuffer(Buffer.from(data, 'base64'));
    } finally {
        try {
            await dbg.sendCommand('Emulation.clearDeviceMetricsOverride');
        } catch {
            // ignore if override was not active
        }
        dbg.detach();
    }
};


const upscaleImageToTarget = (image, targetWidth, targetHeight) => {
    const { width, height } = image.getSize();
    if (width >= targetWidth && height >= targetHeight) {
        return image;
    }
    return image.resize({
        width: targetWidth,
        height: targetHeight,
        quality: 'best',
    });
};


const ensureExactSize = (image, targetWidth, targetHeight) => {
    const { width, height } = image.getSize();
    if (width === targetWidth && height === targetHeight) {
        return { image, adjusted: false };
    }
    return {
        image: image.resize({
            width: targetWidth,
            height: targetHeight,
            quality: 'best',
        }),
        adjusted: true,
    };
};


// Exported
const captureScreenshot = async (mainWindow, outputPath, options = {}) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
        throw new Error('No window to capture');
    }

    const width = Math.round(options.width ?? DEFAULT_WIDTH);
    const height = Math.round(options.height ?? DEFAULT_HEIGHT);
    const displayScale = getDisplayScaleFactor(mainWindow);
    const scaleFactor = resolveScaleFactor(mainWindow, options);
    const delayMs = options.delayMs ?? 300;
    const targetWidth = Math.round(width * scaleFactor);
    const targetHeight = Math.round(height * scaleFactor);
    const cdpMobile = options.mobile !== false;

    const { webContents } = mainWindow;
    mainWindow.setContentSize(width, height);
    await wait(delayMs);

    const enforceExactSize = options.enforceExactSize === true;
    const preferCdp = enforceExactSize || scaleFactor > displayScale;

    let image;
    let method = 'capturePage';

    if (preferCdp && scaleFactor > 1) {
        try {
            image = await captureViaCdp(webContents, {
                width, height, scaleFactor, delayMs: 0, mobile: cdpMobile,
            });
            method = 'cdp';
        } catch (error) {
            console.warn(`CDP screenshot failed (${error.message}); falling back to capturePage`);
            image = await webContents.capturePage({ x: 0, y: 0, width, height });
        }
    } else {
        image = await webContents.capturePage({ x: 0, y: 0, width, height });
    }

    const captured = image.getSize();
    const needsMorePixels = captured.width < targetWidth || captured.height < targetHeight;

    if (needsMorePixels && scaleFactor > 1 && method !== 'cdp') {
        try {
            image = await captureViaCdp(webContents, {
                width, height, scaleFactor, delayMs: 0, mobile: cdpMobile,
            });
            method = 'cdp';
        } catch (error) {
            console.warn(`CDP screenshot failed (${error.message}); upscaling capturePage pixels`);
            method = 'capturePage+upscale';
            image = upscaleImageToTarget(image, targetWidth, targetHeight);
        }
    } else if (needsMorePixels) {
        method = 'capturePage+upscale';
        image = upscaleImageToTarget(image, targetWidth, targetHeight);
    }

    if (enforceExactSize) {
        const { image: fitted, adjusted } = ensureExactSize(image, targetWidth, targetHeight);
        if (adjusted) {
            method = `${method}+fit`;
        }
        image = fitted;
    }

    const resolved = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, image.toPNG());

    const size = image.getSize();
    return {
        path: resolved,
        width: size.width,
        height: size.height,
        targetWidth,
        targetHeight,
        enforceExactSize,
        method,
        displayScale,
        scaleFactor,
    };
};


const captureScreenshotDialog = async (mainWindow, options = {}) => {
    const defaultDir = options.defaultDir ?? getWebsiteAssetsDir();
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: path.join(defaultDir, options.defaultFileName ?? 'mmc-screenshot.png'),
        filters: [{ name: 'PNG', extensions: ['png'] }],
    });

    if (canceled || !filePath) {
        return { canceled: true };
    }

    const result = await captureScreenshot(mainWindow, filePath, options);
    return { canceled: false, ...result };
};


const storeCaptureDialog = preset => win => captureScreenshotDialog(win, {
    width: preset.width,
    height: preset.height,
    scaleFactor: preset.scaleFactor,
    enforceExactSize: true,
    mobile: preset.mobile,
    defaultDir: app.getPath('downloads'),
    defaultFileName: preset.defaultFileName,
});


const buildDevScreenshotMenu = (getMainWindow) => {
    const runCapture = async (fn) => {
        const win = getMainWindow();
        if (!win || win.isDestroyed()) return;
        try {
            logScreenshotResult(await fn(win));
        } catch (error) {
            console.error(`Screenshot failed: ${error.message}`);
        }
    };

    return Menu.buildFromTemplate([
        ...(process.platform === 'darwin' ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        }] : []),
        {
            label: 'Screenshot',
            submenu: [
                {
                    label: 'Save for web…',
                    click: () => runCapture(win => captureScreenshotDialog(win, {
                        defaultFileName: 'screenshot.png',
                    })),
                },
                {
                    label: 'Save for App Store & Play Store (iPhone 6.9")…',
                    click: () => runCapture(storeCaptureDialog({
                        width: STORE_IPHONE_WIDTH,
                        height: STORE_IPHONE_HEIGHT,
                        scaleFactor: STORE_IPHONE_SCALE,
                        mobile: true,
                        defaultFileName: 'store-iphone-screenshot.png',
                    })),
                },
                {
                    label: 'Save for App Store (iPad 13")…',
                    click: () => runCapture(storeCaptureDialog({
                        width: STORE_IPAD_WIDTH,
                        height: STORE_IPAD_HEIGHT,
                        scaleFactor: STORE_IPAD_SCALE,
                        mobile: false,
                        defaultFileName: 'store-ipad-screenshot.png',
                    })),
                },
                {
                    label: 'Save for Play Store (7" tablet)…',
                    click: () => runCapture(storeCaptureDialog({
                        width: STORE_PLAY_TABLET_7_WIDTH,
                        height: STORE_PLAY_TABLET_7_HEIGHT,
                        scaleFactor: STORE_PLAY_TABLET_7_SCALE,
                        mobile: false,
                        defaultFileName: 'play-tablet-7-screenshot.png',
                    })),
                },
                {
                    label: 'Save for Play Store (10" tablet)…',
                    click: () => runCapture(storeCaptureDialog({
                        width: STORE_PLAY_TABLET_10_WIDTH,
                        height: STORE_PLAY_TABLET_10_HEIGHT,
                        scaleFactor: STORE_PLAY_TABLET_10_SCALE,
                        mobile: false,
                        defaultFileName: 'play-tablet-10-screenshot.png',
                    })),
                },
            ],
        },
        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' },
    ]);
};


module.exports = {
    captureScreenshot,
    captureScreenshotDialog,
    buildDevScreenshotMenu,
    getWebsiteAssetsDir,
    getDisplayScaleFactor,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    STORE_IPHONE_WIDTH,
    STORE_IPHONE_HEIGHT,
    STORE_IPHONE_SCALE,
    STORE_IPAD_WIDTH,
    STORE_IPAD_HEIGHT,
    STORE_IPAD_SCALE,
    STORE_PLAY_TABLET_7_WIDTH,
    STORE_PLAY_TABLET_7_HEIGHT,
    STORE_PLAY_TABLET_7_SCALE,
    STORE_PLAY_TABLET_10_WIDTH,
    STORE_PLAY_TABLET_10_HEIGHT,
    STORE_PLAY_TABLET_10_SCALE,
    // Legacy aliases (iPhone store preset)
    STORE_WIDTH: STORE_IPHONE_WIDTH,
    STORE_HEIGHT: STORE_IPHONE_HEIGHT,
    STORE_SCALE: STORE_IPHONE_SCALE,
};
