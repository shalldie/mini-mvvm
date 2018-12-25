const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: [path.join(__dirname, '../src/index.ts')]
    },

    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },

    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    }

};
