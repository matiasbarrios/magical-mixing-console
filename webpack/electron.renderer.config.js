// Requirements
const { optimization } = require('./optimization');
const { rules: renderingRules, plugins, resolve } = require('./renderer');


// Variables
const isProd = process.env.NODE_ENV === 'production';


// Exported
module.exports = {
    module: {
        rules: [
            ...renderingRules,
        ],
    },
    devtool: false,
    plugins,
    optimization: isProd ? optimization() : { minimize: false },
    resolve,
};
