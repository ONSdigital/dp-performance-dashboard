


var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    bodyData: {"title": "Service status"},
    dataToAdd: {
        type: "line",
        title: "Response times (ms)",
        chart: {
            type: 'line'
        },
        categories: [1,2,3,4],
        series: [45,55,65,25]
    },

    renderView: function (container) {
        this.renderTemplate(container);
        this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.dataToAdd));

    },

    renderChart: function(container, data) {
        this.Highcharts.chart(container, data);
    },

    renderTemplate: function(container) {
        container.innerHTML = this.serviceStatusTemplate(this.bodyData);
    },

    addDataToConfig: function(chartConfig, dataToAdd) {

        chartConfig.chart.type = dataToAdd.type ? dataToAdd.type : chartConfig.chart.type;
        chartConfig.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.title.text;
        chartConfig.series[0].data = dataToAdd.series ? dataToAdd.series : chartConfig.series[0].data;
        chartConfig.series[0].name = dataToAdd.title ? dataToAdd.title : chartConfig.series[0].name;
        chartConfig.xAxis.categories = dataToAdd.categories ? dataToAdd.categories : chartConfig.xAxis.categories;
        chartConfig.yAxis.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.yAxis.title.text;

        return chartConfig;
    }
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

module.exports = viewServiceStatus;