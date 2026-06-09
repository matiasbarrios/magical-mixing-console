// Requirements
const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');


// Exported
module.exports = {
    packagerConfig: {
        asar: true,
        icon: path.join(__dirname, 'assets/icon/icon'),
        name: 'Open-Sourced Magical Mixing Console',
        executableName: 'open-sourced-magical-mixing-console',
        extraResource: [
            path.resolve(__dirname, 'out/LICENSES.txt'),
            path.resolve(__dirname, 'LICENSE'),
        ],
        osxSign: {},
        osxNotarize: {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID,
        },
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                setupIcon: path.join(__dirname, 'assets/icon/icon.ico'),
            },
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: path.join(__dirname, 'assets/icon/icon.icns'),
                sign: true,
                signAutoDiscovery: true,
            },
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    icon: path.join(__dirname, 'assets/icon/icon.png'),
                },
            },
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        {
            name: '@electron-forge/plugin-webpack',
            config: {
                devContentSecurityPolicy: [
                    "default-src 'self';",
                    "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data: blob:;",
                ].join(' '),
                devServer: {
                    client: {
                        overlay: {
                            runtimeErrors: (error) => !error.message?.includes('ResizeObserver loop'),
                        },
                    },
                },
                mainConfig: path.join(__dirname, 'webpack/electron.main.config.js'),
                renderer: {
                    config: path.join(__dirname, 'webpack/electron.renderer.config.js'),
                    entryPoints: [
                        {
                            html: path.join(__dirname, 'src/console/gui/index.html'),
                            js: path.join(__dirname, 'src/console/gui/application.jsx'),
                            name: 'main_window',
                            preload: {
                                js: path.join(__dirname, 'src/console/electron/api.js'),
                            },
                        },
                    ],
                },
            },
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};
