const path = require('path');
const package = require('../package.json');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDir = process.cwd();

const reApp = (r) => path.resolve(appDir, r);

const config = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        path: reApp('dist'),
        filename: package.name + '.' + package.version + '.js',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true,
        compress: true,
        port: 8000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'IM CHAT',
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

}

module.exports = config;