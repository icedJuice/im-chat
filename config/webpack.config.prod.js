const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const package = require('../package.json');

const config = {
    ...baseConfig,
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.resolve(path.join(__dirname, '../lib')),
        library: 'im-chat',
        libraryTarget: 'umd',
        filename: `${package.name}.${package.version}.min.js`,
    },
    mode: 'production',
}

module.exports = config;