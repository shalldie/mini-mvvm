const webpackConfig = require('./webpack.config.pro');
const Webpack = require('webpack');

Webpack(webpackConfig, function (err, stats) {
    if (err) {
        throw err;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    console.log('----- build complete >_<#@! -----');
});
