module.exports = {
    entry: "./src/app.js",
    output: {
        path: "dist",
        filename: "bundle.js"
    },
    watch:true,
    module: {
        loaders: [
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    }
};