const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /(\.css|\.less)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
              "@/*": [
                "src/*"
              ],
        }
    }
    
};