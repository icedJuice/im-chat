const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const package = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    ...baseConfig,
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.resolve(path.join(__dirname, '../dist')),
        filename: `${package.name}.${package.version}.min.js`
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        contentBase: path.resolve(path.join(__dirname, "../dist")),
        hot: true,
        compress: true,
        port: 8000,
        open: true,
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: 1000
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'IM CHAT',
            template: path.resolve(path.join(__dirname, '../public/index.html')),
        }),
    ],

}

module.exports = config;