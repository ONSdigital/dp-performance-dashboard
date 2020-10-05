const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

function getPlugins() {
    var plugins = [];

    // Move static files to dist folder
    plugins.push(new CopyPlugin({
        patterns: [
            { from: 'src/index.html', to: 'index.html' },
            { from: 'src/worker.js', to: 'worker.js' },
            { from: 'src/img/loader.gif', to: 'img/loader.gif' },
            { from: 'src/favicon.ico', to: 'favicon.ico' }
        ]
    }));
    return plugins;
}

function isProduction(mode) {
    return mode === 'production';
}

function isWatching(mode) {
    return !isProduction(mode);
}

module.exports = (env, argv) => {
    var devTool = isProduction(argv.mode) ? '#source-map' : '#inline-source-map';

    return {
        mode: argv.mode,
        entry: "./src/app.js",
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "bundle.js"
        },
        watch: isWatching(argv.mode),
        module: {
            rules: [
                { test: /\.handlebars$/, use: "handlebars-loader" },
                { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }
            ]
        },
        devtool: devTool,
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
        },
        optimization: {
            minimize: isProduction(argv.mode),
        },
        plugins: getPlugins()
    }
};