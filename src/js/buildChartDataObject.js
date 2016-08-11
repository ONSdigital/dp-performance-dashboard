module.exports = function(data, dimension, categoryColumn, valueColumn, chartType) {

    /**
     * Build an object of chart properties and data to merge with base chart config
     * @param {object} data - JSON data object returned from state
     * @param {int} dimension - Index of metric array in data object
     * @param {int} categoryColumn - Index of values array in data object where to find category names
     * @param {int} valueColumn - Index of values array in data object where to to find the values to plot on chart
     * @param {string} chartType - type of chart to render
     */

    var dataSeries = data[dimension].values,
        name = data[dimension].definition.meta.description,
        type = chartType,
        categories = [],
        series = [],
        obj = {};

    for (var i = 0; i < dataSeries.length; i++ ) {
        for (value in dataSeries[i]) {
            if (value == categoryColumn) {
                categories.push([dataSeries[i][value]].toString());
            } else if (value == valueColumn) {
                series.push(parseInt([dataSeries[i][value]]));
            }
        }
    }

    obj.type = type; obj.title = name; obj.categories = categories; obj.series = series;

    return obj;

};
