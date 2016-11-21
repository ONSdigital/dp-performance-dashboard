var publishTimesTemplate = require('../templates/partials/request-times.handlebars'),
    Highcharts = require('highcharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml');


var viewRequestTimes = {

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.publishTimes.data;
    },

    setChartOptions: function() {
        Highcharts.setOptions(chartConfig)
    },

    renderView: function(container) {

    }
};

module.exports = viewRequestTimes;
