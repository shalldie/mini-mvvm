const webpackConfig = require('./webpack.config.base.js');

module.exports = Object.assign(webpackConfig, {
    mode: 'production'
});
