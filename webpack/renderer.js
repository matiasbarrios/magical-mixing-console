/* eslint-disable new-cap */


// Requirements
const path = require('path');
const hwp = require('html-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('../package.json');


// Constants
const isProd = process.env.NODE_ENV === 'production';


// Constants
const rules = [
    {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
        },
    }, {
        test: /\.html$/,
        use: 'raw-loader',
    }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
    }, {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 1000 * 1024,
            },
        }],
    }, {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    },
];


const plugins = [
    new hwp({ template: path.join(__dirname, '../src/console/gui/index.html') }),
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
    }),
    new webpack.DefinePlugin({
        'process.env.APP_VERSION': JSON.stringify(isProd ? process.env.APP_VERSION : packageJson.version),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || (isProd ? 'production' : 'development')),
    }),
];


const resolve = {
    extensions: ['.js', '.jsx'],
    fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
    },
};


// Exported
module.exports = {
    rules,
    plugins,
    resolve,
};
