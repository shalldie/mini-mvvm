const path = require('path');

const ifProduction = () => process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        'mini-vdom': path.join(
            __dirname,
            ifProduction() ?
                '../src/index.ts' :
                '../src/dev.ts'
        )
    },

    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        library: 'MiniVdom',
        libraryExport: 'default',
        libraryTarget: ifProduction ? 'umd' : undefined,
        publicPath: '/dist/'
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
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
