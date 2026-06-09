// Requirements
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


// Constants
const obfuscatorExcludes = [
    path.resolve(__dirname, '../src/console/capacitor/helpers/presets.js'),
    path.resolve(__dirname, '../src/virtual-devices/x18/run/adressesValues.js'),
];


// Exported
const optimization = (liteObfuscation = false) => ({
    minimize: true,
    minimizer: [
        new TerserPlugin({
            extractComments: true,
            terserOptions: {
                format: {
                    comments: false,
                },
                sourceMap: false,
            },
        }),
        new WebpackObfuscator({
            sourceMap: false,
            rotateStringArray: !liteObfuscation,
            stringArray: true,
            stringArrayThreshold: liteObfuscation ? 0.4 : 0.75,
            selfDefending: true,
            compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 0.1,
            disableConsoleOutput: true,
        }, obfuscatorExcludes),
        // new BundleAnalyzerPlugin(),
    ],
    splitChunks: false,
});


// Exported
module.exports = {
    optimization,
};

