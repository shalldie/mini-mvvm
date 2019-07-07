const path = require('path');
const open = require('open');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

const serverConfig = {
    host: '127.0.0.1',
    // host: 'localhost',
    port: '3' + (Math.random() + '').slice(-3)
};

const link = `http://${serverConfig.host}:${serverConfig.port}`;
// webpackConfig.entry.push(`webpack-dev-server/client?${link}`);

const options = {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    stats: {
        colors: true
    },
    ...serverConfig
};

webpackDevServer.addDevServerEntrypoints(webpackConfig, options);

const compiler = webpack(webpackConfig);

const server = new webpackDevServer(compiler, options);

server.listen(serverConfig.port, serverConfig.host, err => {
    if (err) {
        return console.log(err);
    }
    console.log(`Starting server on ${link}`);
    open(link);
});
