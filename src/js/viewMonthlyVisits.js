var monthlyVisitsTemplate = require('../templates/partials/monthly-visits.handlebars'),
    Highcharts = require('highcharts'),
    buildHighCharts = require('./buildHighCharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml');

var viewMonthlyVisits = {

    getData: function () {
        // Get latest activity data from state
        var currentState = store.getState();
        return currentState.webTraffic.data;
    },

    renderView: function (container) {
        this.renderTemplate(container);

        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function () {
            viewMonthlyVisits.renderCharts();
            viewMonthlyVisits.renderHiddenTables();
        }, 5);
    },

    renderTemplate: function (container) {
        container.innerHTML = monthlyVisitsTemplate();
    },

    renderCharts: function () {
        buildHighCharts.setChartOptions();
        //this.setChartOptions();
        this.renderMonthlyVisitsChart();
    },

    renderMonthlyVisitsChart: function () {

        var options = buildChartData(this.getData(), 'visits-daily-30-days', 0, 1);

        var chartOptions = {
            chart: {
                renderTo: 'monthly-visits--chart', // TODO remove 'new' from ID once old requestAndPublish removed
                type: 'line'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                type: 'category',
                categories: options.categories,
                labels: {
                    autoRotation: 0
                },
                tickInterval: 4
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'Visits',
                    align: 'high',
                    offset: 12,
                    rotation: 0,
                    y: -15
                }
            }],
            series: [{
                name: 'Visits',
                data: options.series,
                marker: chartConfig.series[0].marker
            }]
        };
        console.log(chartOptions);
        buildHighCharts.chart(chartOptions);
    },

    renderTablePublishTimes: function() {
        var options = {
            data: this.getData(),
            id: 'monthly-visits', //TODO remove new from id once requestAndPublish function removed§
            headings: [
                'Date',
                'Time taken (ms)',
                'Number of files'
            ],
            body: [
                {
                    dataNode: 0,
                    valueNodes: [
                        0,
                        1
                    ]
                },
                {
                    dataNode: 0,
                    valueNodes: [
                        2
                    ]
                }
            ]
        };

        buildTableHtml(options);
    },

    renderHiddenTables: function() {
        this.renderTablePublishTimes();
    }
};

module.exports = viewMonthlyVisits;
