var monthlyVisitsTemplate = require('../templates/partials/monthly-visits.handlebars'),
    Highcharts = require('highcharts'),
    buildHighCharts = require('./buildHighCharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml');
    numberFormatter = require('./numberFormatter');

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
        this.renderMonthlyVisitsChart();
    },

    renderMonthlyVisitsChart: function () {

        var options = buildChartData(this.getData(), 'visits-daily-30-days', 0, 1);

        // format the date to dd/mm/yyyy
        // for (value in options.categories) {
        //     var date = new Date(options.categories[value]);
        //     options.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        // }

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
                    //format: '{value}'
                    formatter: function () {
                        return numberFormatter(this.value);
                    }
                },
                title: {
                    text: 'Visits',
                    align: 'high',
                    offset: 14,
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
        buildHighCharts.chart(chartOptions);
    },

    renderTableVisits: function() {
        var options = {
            data: this.getData(),
            id: 'monthly-visits',
            headings: [
                'Date',
                'Visits'
            ],
            body: [
                {
                    dataNode: 13,
                    valueNodes: []
                }
            ]
        };

        buildTableHtml(options);
    },

    renderHiddenTables: function() {
        this.renderTableVisits();
    }
};

module.exports = viewMonthlyVisits;
