/** Modular function to convert string to camel case - credit to http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase **/

var stringConvert = {
    toCamelCase: function(string) {
        return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    },
    fromCameltoSlug: function(string) {
        return string.replace(/([a-z][A-Z])/g, function (g) { return g[0] + '-' + g[1].toLowerCase() });
    }
};

module.exports = stringConvert;