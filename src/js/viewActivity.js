var viewActivity = {
    container: (function() {return document.getElementById('content');})(),
    activityTemplate: require('../templates/activity.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    addDataToConfig: require('./addChartDataToChartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {"title": "Activity"},
    store: require('./state'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.activity.data;
    },

    renderView: function (container) {
        this.getData();
        this.buildPageData();
        this.renderTemplate(container);
        this.setChartOptions();
        this.renderChartVisitsToday();
        this.renderChartDevices();
        this.renderChartLandingPages();
        this.renderChartTrafficSources();
    },

    setChartOptions: function() {
        this.Highcharts.setOptions(this.chartConfig)
    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.activeUsers = data[0].values[0].toString();
    },

    renderChartVisitsToday: function () {
        //this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
        var options = this.buildChartData(this.getData(), 1, 0, 1);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'visits-today--chart',
                type: 'column'
            },
            title: {
                text: options.title
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: options.title
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker
            }]
        });
        //chart.series[0].setData([3,4,5,6,7,255,8,967,4]);
    },

    renderChartDevices: function () {
        //this.renderChart('devices--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
        var options = this.buildChartData(this.getData(), 5, 0, 4);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'devices--chart',
                type: 'bar'
            },
            title: {
                text: options.title
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: options.title
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker
            }]
        });
    },

    renderChartLandingPages: function () {
        //this.renderChart('landing-pages--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 4, 0, 1, "bar")));
        var options = this.buildChartData(this.getData(), 4, 0, 1);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'landing-pages--chart',
                type: 'bar'
            },
            title: {
                text: options.title
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: options.title
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker
            }]
        });
    },

    renderChartTrafficSources: function () {
        //this.renderChart('traffic-sources--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
        var options = this.buildChartData(this.getData(), 5, 0, 4);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'traffic-sources--chart',
                type: 'bar'
            },
            title: {
                text: options.title
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: options.title
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker
            }]
        });
    },

    renderCharts: function(container, data) {

    },

    renderTemplate: function(container) {
        container.innerHTML = this.activityTemplate(this.bodyData);
    }

    // addDataToConfig: function (chartConfig, dataToAdd) {
    //
    //     chartConfig.chart.type = dataToAdd.type ? dataToAdd.type : chartConfig.chart.type;
    //     chartConfig.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.title.text;
    //     chartConfig.series[0].data = dataToAdd.series ? dataToAdd.series : chartConfig.series[0].data;
    //     chartConfig.series[0].name = dataToAdd.title ? dataToAdd.title : chartConfig.series[0].name;
    //     chartConfig.xAxis.categories = dataToAdd.categories ? dataToAdd.categories : chartConfig.xAxis.categories;
    //     chartConfig.yAxis.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.yAxis.title.text;
    //
    //     console.log(chartConfig);
    //     return chartConfig;
    // },

    // buildChartData: function(dimension, categoryColumn, valueColumn, chartType) {
    //
    //     /**
    //      * Build an object of chart properties and data to merge with base chart config
    //      * @param {int} dimension - Index of metric array in data object
    //      * @param {int} categoryColumn - Index of values array in data object where to find category names
    //      * @param {int} valueColumn - Index of values array in data object where to to find the values to plot on chart
    //      * @param {string} chartType - type of chart to render
    //      */
    //
    //     var data = this.getData(),
    //         dataSeries = data[dimension].values,
    //         name = data[dimension].definition.meta.description,
    //         type = chartType,
    //         categories = [],
    //         series = [],
    //         obj = {};
    //
    //     for (var i = 0; i < dataSeries.length; i++ ) {
    //         for (value in dataSeries[i]) {
    //             if (value == categoryColumn) {
    //                 categories.push([dataSeries[i][value]].toString());
    //             } else if (value == valueColumn) {
    //                 series.push(parseInt([dataSeries[i][value]]));
    //             }
    //         }
    //     }
    //
    //     obj.type = type; obj.title = name; obj.categories = categories; obj.series = series;
    //
    //     return obj;
    //
    // }
};



// var Highcharts = require('highcharts');
//
// // Create the chart
// Highcharts.chart('chart--js', {
//     chart: {
//         type: 'bar'
//     },
//     title: {
//         text: 'Fruit Consumption'
//     },
//     xAxis: {
//         categories: ['Apples', 'Bananas', 'Oranges']
//     },
//     yAxis: {
//         title: {
//             text: 'Fruit eaten'
//         }
//     },
//     series: [{
//         name: 'Jane',
//         data: [1, 10, 4]
//     }, {
//         name: 'John',
//         data: [5, 7, 3]
//     }]
// });

module.exports = viewActivity;
