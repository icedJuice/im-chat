const path = require('path');
const package = require('../package.json');

const appDir = process.cwd();

const reApp = (r) => path.resolve(appDir, r);

const config = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        path: reApp('dist'),
        filename: package.name + '.' + package.version + '.js',
    },
    // mode: 'production',
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             loader: require.resolve('babel-loader'),
    //         },
    //       ]
    // },
}

module.exports = config;