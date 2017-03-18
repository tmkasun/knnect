var webpack = require('webpack');
module.exports = {
    entry: {
        services: './services.js',
        utils: './utils.js',
    },
    output: {
        path: './bin',
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
