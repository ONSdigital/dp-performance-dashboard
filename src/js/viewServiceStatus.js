var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),

    renderTemplate: function (container, data) {
        container.innerHTML = this.serviceStatusTemplate(data);
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
//
// Highcharts.chart('chart--js-2', {
//     chart: {
//         type: 'bar'
//     },
//     title: {
//         text: 'Meat eaten'
//     },
//     xAxis: {
//         categories: ['Lamb', 'Chicken', 'Beef', '"Quorn"']
//     },
//     yAxis: {
//         title: {
//             text: 'Meat eaten'
//         }
//     },
//     series: [{
//         name: 'Crispin',
//         data: [0, 0, 0, 50]
//     }, {
//         name: 'Jon',
//         data: [34, 48, 34, 0]
//     }]
// });

module.exports = viewServiceStatus;
