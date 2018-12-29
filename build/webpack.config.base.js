const path = require('path');

const ifProduction = () => process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        mvvm: path.join(
            __dirname,
            ifProduction() ?
                '../src/core/MVVM.ts' :
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
