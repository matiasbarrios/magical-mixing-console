// Requirements
const path = require('path');
const { electronRules } = require('./electron.rules');
const { optimization } = require('./optimization');


// Variables
const isProd = process.env.NODE_ENV === 'production';


// Exported
module.exports = {
    entry: path.join(__dirname, '../src/console/electron/main.js'),
    module: {
        rules: electronRules,
    },
    devtool: false,
    optimization: isProd ? optimization(true) : { minimize: false },
};
