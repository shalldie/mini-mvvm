const path = require('path');
const webpack = require('webpack');

const ifProduction = process.env.NODE_ENV === 'production';

console.log(ifProduction);

module.exports = {
    entry: {
        index: path.join(
            __dirname,
            ifProduction ?
                '../src/lib/MVVM.ts' :
                '../src/index.ts'
        )
    },

    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        library: 'MVVM',
        libraryExport: 'default',
        libraryTarget: ifProduction ? 'umd' : undefined,
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
