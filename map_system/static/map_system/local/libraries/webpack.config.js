var webpack = require('webpack');
module.exports = {
    entry: {
        services: './services.js',
        utils: './utils.js',
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js',
    }
};
