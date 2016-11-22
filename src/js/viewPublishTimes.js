var publishTimesTemplate = require('../templates/partials/publish-times.handlebars'),
    Highcharts = require('highcharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml');

var viewPublishTimes = {

    getData: function () {
        // Get latest activity data from state
        var currentState = store.getState();
        return currentState.publishTimes.data;
    },

    setChartOptions: function () {
        Highcharts.setOptions(chartConfig)
    },

    renderView: function (container) {
        this.renderTemplate(container);

        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function () {
            viewPublishTimes.renderCharts();
            viewPublishTimes.renderHiddenTables();
        }, 5);
    },

    renderTemplate: function (container) {
        container.innerHTML = publishTimesTemplate();
    },

    renderCharts: function () {
        this.setChartOptions();
        this.renderPublishTimesChart();
    },

    renderPublishTimesChart: function () {

        var time = buildChartData(this.getData(), 'publish-time-30-day', 0, 1);
        var files = buildChartData(this.getData(), 'publish-time-30-day', 0, 2);

        // format the date to dd/mm/yyyy
        for (value in time.categories) {
            var date = new Date(time.categories[value]);
            time.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'publish-times-new--chart', // TODO remove 'new' from ID once old requestAndPublish removed
                type: 'area'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                type: 'category',
                categories: time.categories,
                labels: {
                    autoRotation: 0
                },
                tickInterval: 4
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}'
                },
                max: 60000,
                title: {
                    text: 'Time (ms)',
                    align: 'high',
                    offset: -16,
                    rotation: 0,
                    y: -15
                },
                plotLines: [{
                    color: '#41403E', // Color value
                    dashStyle: 'shortdash', // Style of the plot line. Default to solid
                    value: 59000, // Value of where the line will appear
                    width: 1, // Width of the line
                    label: {
                        text: 'Allowed publish time',
                        style: {'color': '#41403E', 'font-size': '12px'},
                        y: 15
                    }
                }]
            }, { // Secondary yAxis
                title: {
                    text: 'Files',
                    align: 'high',
                    offset: -30,
                    rotation: 0,
                    y: -15
                },
                labels: {
                    format: '{value} files'
                },
                opposite: true
            }],
            series: [{
                name: 'Time',
                data: time.series,
                marker: chartConfig.series[0].marker,
                tooltip: {
                    valueSuffix: 'ms'
                }
            }, {
                name: 'Files',
                data: files.series,
                marker: chartConfig.series[0].marker
            }]
        });
    },

    renderTablePublishTimes: function() {
        var options = {
            data: this.getData(),
            id: 'publish-times-new', //TODO remove new from id once requestAndPublish function removed§
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

module.exports = viewPublishTimes;
