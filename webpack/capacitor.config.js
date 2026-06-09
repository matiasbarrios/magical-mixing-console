// Requirements
const path = require('path');
const { optimization } = require('./optimization');
const { rules, plugins, resolve } = require('./renderer');


// Variables
const isProd = process.env.NODE_ENV === 'production';


// Exported
module.exports = () => ({
    entry: {
        index: path.join(__dirname, '../src/console/gui/application.jsx'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, '../out/capacitor'),
    },
    devServer: {
        compress: true,
        port: 3001,
        historyApiFallback: true,
    },
    module: {
        rules,
    },
    devtool: false,
    plugins,
    optimization: isProd ? optimization() : { minimize: false },
    resolve,
});
