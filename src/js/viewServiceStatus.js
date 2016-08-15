
var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {"title": "Service status"},
    store: require('./state'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.serviceStatus.data;
    },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);

    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.averageResponseTimes = [];
        for (var i = 0; i <= 2; i++) {
            var responseTimeData = {
                'name': data[i].definition.meta.name,
                'description': data[i].definition.meta.description,
                'responseTime': data[i].values[0][2],
                'timeUp': data[i].values[0][3],
                'timeDown': data[i].values[0][4],
                'percentageTimeUp': data[i].values[0][6],
                'percentageTimeDown': data[i].values[0][7]
            };
            this.bodyData.averageResponseTimes.push(responseTimeData);
        }

    },

    // renderChartResponseTimes: function () {
    //     this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
    // },

    renderChart: function(container, data) {
        this.Highcharts.chart(container, data);
    },

    renderTemplate: function(container) {
        container.innerHTML = this.serviceStatusTemplate(this.bodyData);
    }
};

module.exports = viewServiceStatus;