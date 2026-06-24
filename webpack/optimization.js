// Requirements
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


// Exported
const optimization = () => ({
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
        // new BundleAnalyzerPlugin(),
    ],
    splitChunks: false,
});


// Exported
module.exports = {
    optimization,
};
