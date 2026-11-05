import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guiRoot = path.join(repoRoot, 'src/console/gui');
const platformIndex = path.join(guiRoot, 'platform/index.js');
const capacitorAdapter = path.join(guiRoot, 'platform/adapter.capacitor.js');
const packageJson = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));


// MMC_ENV wins over Vite, which forces NODE_ENV=production on every build.
const isProd = (process.env.MMC_ENV || process.env.NODE_ENV) === 'production';
const appVersion = (isProd && process.env.APP_VERSION) || packageJson.version;


// index.js imports adapter.tinyjs.js. This build loads adapter.capacitor.js
// instead, so Vite never pulls tinyjs into the mobile graph or Capacitor
// into the desktop one.
const capacitorPlatformAdapter = {
    name: 'mmc-capacitor-platform-adapter',
    enforce: 'pre',
    resolveId(source, importer) {
        if (source !== './adapter.tinyjs.js' || !importer) return null;
        const importerFile = path.normalize(importer.split('?')[0]);
        if (importerFile !== platformIndex) return null;
        return capacitorAdapter;
    },
};


export const guiConfig = ({ outDir, port, capacitor = false }) => defineConfig({
    root: guiRoot,
    base: './',
    publicDir: false,
    plugins: [
        capacitor ? capacitorPlatformAdapter : null,
        react(),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@magical-mixing/mixers': path.join(repoRoot, 'src/mixers'),
            '@magical-mixing/mixers-react': path.join(repoRoot, 'src/mixers-react'),
            '@magical-mixing/console': path.join(repoRoot, 'src/console'),
            '@magical-mixing/virtual-devices': path.join(repoRoot, 'src/virtual-devices'),
        },
    },
    define: {
        'process.env.APP_VERSION': JSON.stringify(appVersion),
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    server: port ? {
        host: '127.0.0.1',
        port,
        strictPort: true,
        hmr: { overlay: false },
        fs: { allow: [repoRoot] },
    } : undefined,
    build: {
        outDir,
        emptyOutDir: true,
        sourcemap: false,
        minify: isProd ? 'esbuild' : false,
        assetsInlineLimit: 1000 * 1024,
    },
});
