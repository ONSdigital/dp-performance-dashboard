var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),
    Highcharts: require('highcharts'),
    chart: require('./chartConfig'),

    renderTemplate: function (container, data) {
        container.innerHTML = this.serviceStatusTemplate(data);
        this.renderChart('js--chart', this.addDataToConfig('line', 'Response rates'));

    },

    renderChart: function(container, data) {
        this.Highcharts.chart(container, data);
    },

    addDataToConfig: function(type, title) {
        var chart = this.chart;
        chart.chart.type = type;
        chart.title.text = title;

        return chart;
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
