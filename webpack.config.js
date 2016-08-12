var webpack = require('webpack');
var path = require('path');
var isProduction = (process.env.ENV === 'production');
var CopyWebpackPlugin = require('copy-webpack-plugin');

function getPlugins() {
    var plugins = [];

    if (isProduction) {
        // Uglify production JavaScript
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    // Move static files to dist folder
    plugins.push(new CopyWebpackPlugin([
        { from: 'src/index.html', to: 'index.html' },
        { from: 'src/worker.js', to: 'worker.js' }
    ]));

    return plugins;
}

function isWatching() {
    var bool = true;

    if (isProduction) {
        bool = false;
    }

    return bool;
}

module.exports = {
    entry: "./src/app.js",
    output: {
        path: "dist",
        filename: "bundle.js"
    },
    watch: isWatching(),
    module: {
        loaders: [
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    },
    devtool: "#inline-source-map",
    devServer: {
        outputPath: "dist"
    },
    plugins: getPlugins()
};