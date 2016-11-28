var container = (function () {
        return document.getElementById('content');
    })(),
    webTrafficTemplate = require('../templates/web-traffic.handlebars'),
    buildHighCharts = require('./buildHighCharts'),
    Highcharts = require('highcharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    bodyData = {},
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml'),
    numberFormatter = require('./numberFormatter');

var viewWebTraffic = {

    getData: function() {
        // Get latest activity data from state
        var currentState = store.getState();
        return currentState.webTraffic.data;
    },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);
        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function(){
            viewWebTraffic.renderCharts();
            viewWebTraffic.renderHiddenTables();
        }, 5);
    },

    getTrend: function(currentMonth, previousMonth) {
        if (currentMonth > previousMonth) {
            return "greater";
        }
        if (currentMonth < previousMonth) {
            return "less";
        }
        if (currentMonth == previousMonth) {
            return "equal";
        }
    },

    buildPageData: function () {
        var data = this.getData();
        bodyData.activeUsers = data[0].values[0].toString();

        //search refinement
        var searchRefinementData = data[7],
            searchRefinementAverage30 = data[8],
            searchRefinementAverage60 = data[9],
            searchRefinement = {
                'name': searchRefinementData.definition.meta.name,
                'description': searchRefinementData.definition.meta.description,
                'highlightValue': parseInt(searchRefinementAverage30.values[0][0]),
                'trend': this.getTrend(searchRefinementAverage30.values[0][0], searchRefinementAverage60.values[0][0])
            };
        bodyData.searchRefinement = searchRefinement;

        // search exit
        var searchExitData = data[10],
            searchExitAverage30 = data[11],
            searchExitAverage60 = data[12],
            searchExit = {
                'name': searchExitData.definition.meta.name,
                'description': searchExitData.definition.meta.description,
                'highlightValue': parseInt(searchExitAverage30.values[0][0]),
                'trend': this.getTrend(searchExitAverage30.values[0][0], searchExitAverage60.values[0][0])
            };
        bodyData.searchExit = searchExit;

        // visits
        var visitsData = data[13],
            visitsAverage30 = data[14],
            visitsAverage60 = data[15],
            visits = {
                'name': visitsData.definition.meta.name,
                'description': visitsData.definition.meta.description,
                'highlightValue': parseInt(visitsAverage30.values[0][0]),
                'trend': this.getTrend(visitsAverage30.values[0][0], visitsAverage60.values[0][0])
            };
        bodyData.visits = visits;

        // direct traffic
        var directTrafficData = data[16],
            directTrafficAverage30 = data[17],
            directTrafficAverage60 = data[18],
            percent = (directTrafficAverage30.values[0][0] / visitsAverage30.values[0][0]) * 100;
            directTraffic = {
                'name': directTrafficData.definition.meta.name,
                'description': directTrafficData.definition.meta.description,
                'highlightValue': parseInt(percent),
                'trend': this.getTrend(directTrafficAverage30.values[0][0], directTrafficAverage60.values[0][0])
            };
        bodyData.directTraffic = directTraffic;

    },

    renderChartVisitsToday: function () {
        //this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
        var options = buildChartData(this.getData(), 'today', 0, 1);
        //format categories names with zeros to look like times
        for (value in options.categories) {
            options.categories[value] = options.categories[value] + ":00";
        }

        var chartOptions = {
            chart: {
                renderTo: 'visits-today--chart',
                type: 'column'
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                //type: 'category',
                categories: options.categories,
                labels: {
                    autoRotation: 0
                },
                tickInterval: 2
            },
            yAxis: {
                title: {
                    align: 'high',
                    offset: -64,
                    rotation: 0,
                    y: -15,
                    text: 'Number of visits'
                },
                labels: {
                    //format: '{value}'
                    formatter: function () {
                        return numberFormatter(this.value);
                    }
                }
            },
            series: [{
                data: options.series,
                marker: chartConfig.series[0].marker,
                name: "Visitors",
                showInLegend: false
            }]
        };
        buildHighCharts.chart(chartOptions);
    },

    renderSparklineRefinedSearch: function () {
        var options = buildChartData(this.getData(), 'search-refinement-percentage', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--refined-search';
        buildHighCharts.sparkline(options);
    },

    renderSparklineSearchBounce: function () {
        var options = buildChartData(this.getData(), 'search-exit-percentage', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--search-bounce';
        buildHighCharts.sparkline(options);
     },

    renderSparklineDirectVisits: function () {
        var options = buildChartData(this.getData(), 'direct-visits-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--direct-traffic';
        buildHighCharts.sparkline(options);
    },

    renderSparklineVisits: function () {
        var options = buildChartData(this.getData(), 'visits-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--visits';
        buildHighCharts.sparkline(options);
    },

    renderChartVisitsMonth: function () {
        //this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
        var options = this.buildChartData(this.getData(), 'today', 0, 1);
        //format categories names with zeros to look like times
        for (value in options.categories) {
            options.categories[value] = options.categories[value] + ":00";
        }

        var chartOptions = {
            chart: {
                renderTo: 'visits-today--chart',
                type: 'column'
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                //type: 'category',
                categories: options.categories,
                labels: {
                    autoRotation: 0
                },
                tickInterval: 2
            },
            yAxis: {
                title: {
                    align: 'high',
                    offset: -64,
                    rotation: 0,
                    y: -15,
                    text: 'Number of visits'
                },
                labels: {
                    //format: '{value}'
                    formatter: function () {
                        return viewWebTraffic.numberFormatter(this.value);
                    }
                }
            },
            series: [{
                data: options.series,
                marker: viewWebTraffic.chartConfig.series[0].marker,
                name: "Visitors",
                showInLegend: false
            }]
        };
        this.buildHighCharts.chart(chartOptions);
    },


    renderCharts: function () {
        buildHighCharts.setChartOptions();
        this.renderChartVisitsToday();
        this.renderSparklineRefinedSearch();
        this.renderSparklineSearchBounce();
        this.renderSparklineDirectVisits();
        this.renderSparklineVisits();
    },

    renderTableVisitsToday: function() {
        var options = {
            data: this.getData(),
            id: 'visits-today',
            headings: [
                'Time (hour)',
                'Sessions'
            ],
            body: [
                {
                    dataNode: 1,
                    valueNodes: []
                }
            ]
        };

        buildTableHtml(options);
    },

    renderTableDevices: function() {
        var options = {
            data: this.getData(),
            id: 'devices',
            headings: [
                'Device',
                'Visits'
            ],
            body: [
                {
                    dataNode: 2,
                    valueNodes: []
                }
            ]
        };

        buildTableHtml(options);
    },

    renderTableLandingPages: function() {
        var options = {
            data: this.getData(),
            id: 'landing-pages',
            headings: [
                'Page title',
                'Sessions'
            ],
            body: [
                {
                    dataNode: 4,
                    valueNodes: [
                        1,
                        2
                    ]
                }
            ]
        };

        buildTableHtml(options);
    },

    renderTableTrafficSources: function() {
        var options = {
            data: this.getData(),
            id: 'traffic-sources',
            headings: [
                'Referrer',
                'Sessions'
            ],
            body: [
                {
                    dataNode: 5,
                    valueNodes: [
                        0,
                        2
                    ]
                }
            ]
        };

        buildTableHtml(options);
    },

    renderHiddenTables: function() {
        this.renderTableVisitsToday();
        this.renderTableDevices();

        /* Uncomment if we put charts back in */
        // this.renderTableLandingPages();
        // this.renderTableTrafficSources();
    },

    renderTemplate: function (container) {
        container.innerHTML = webTrafficTemplate(bodyData);
    }

};

module.exports = viewWebTraffic;
