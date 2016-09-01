var webpack = require('webpack');
var isProduction = process.env.ENV === 'production';
var isStatic = process.env.ENV === 'static';
var CopyWebpackPlugin = require('copy-webpack-plugin');
var environment = (process.env.ENV === 'production') ? 'production' : 'develop';

function getPlugins() {
    var plugins = [];

    if (isProduction) {
        // Uglify production JavaScript
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    // Move static files to dist folder
    plugins.push(new CopyWebpackPlugin([
        { from: 'src/index.html', to: 'index.html' },
        { from: 'src/worker.js', to: 'worker.js' },
        { from: 'src/img/loader.gif', to: 'img/loader.gif' },
        { from: 'src/favicon.ico', to: 'favicon.ico' }
    ]));

    // environment variable plugin
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            'ENV': JSON.stringify(environment)
        }
    }));

    return plugins;
}

function isWatching() {
    var bool = true;

    if (isProduction || isStatic) {
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
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"]}
        ]
    },
    devtool: "#inline-source-map",
    devServer: {
        outputPath: "dist"
    },
    plugins: getPlugins()
};