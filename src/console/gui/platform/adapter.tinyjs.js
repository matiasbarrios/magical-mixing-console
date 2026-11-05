// Desktop adapter. The Capacitor Vite build redirects this import
// to ./adapter.capacitor.js.


export const loadPlatform = async () => {
    const tinyjs = await import('../../tinyjs');
    await tinyjs.platformReady();
    return tinyjs;
};
