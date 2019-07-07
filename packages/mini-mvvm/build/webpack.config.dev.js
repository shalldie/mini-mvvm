const webpack = require('webpack');
const webpackConfig = require('./webpack.config.base.js');

module.exports = Object.assign(webpackConfig, {
    mode: 'development',

    devtool: 'inline-source-map',

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
});
