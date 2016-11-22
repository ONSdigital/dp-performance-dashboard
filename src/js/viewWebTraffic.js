var viewWebTraffic = {
    container: (function () {
        return document.getElementById('content');
    })(),
    webTrafficTemplate: require('../templates/web-traffic.handlebars'),
    buildHighCharts: require('./buildHighCharts'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {},
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),
    numberFormatter: require('./numberFormatter'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.webTraffic.data;
    },

    renderView: function (container) {
        console.log('Returned data: ', this.getData());
        this.buildPageData();
        console.log('BODY DATA:', this.bodyData);
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
        this.bodyData.activeUsers = data[0].values[0].toString();

        //search refinement
        var searchRefinementData = data[7];
        var searchRefinementAverage30 = data[8];
        var searchRefinementAverage60 = data[9];
        var searchRefinement = {
            'name': searchRefinementData.definition.meta.name,
            'description': searchRefinementData.definition.meta.description,
            'highlightValue': parseInt(searchRefinementAverage30.values[0][0]),
            'trend': this.getTrend(searchRefinementAverage30.values[0][0], searchRefinementAverage60.values[0][0])
        };
        this.bodyData.searchRefinement = searchRefinement;

        // search exit
        var searchExitData = data[10];
        var searchExitAverage30 = data[11];
        var searchExitAverage60 = data[12];
        var searchExit = {
            'name': searchExitData.definition.meta.name,
            'description': searchExitData.definition.meta.description,
            'highlightValue': parseInt(searchExitAverage30.values[0][0]),
            'trend': this.getTrend(searchExitAverage30.values[0][0], searchExitAverage60.values[0][0])
        };
        this.bodyData.searchExit = searchExit;

        // direct traffic
        var directTrafficData = data[16];
        var directTrafficAverage30 = data[17];
        var directTrafficAverage60 = data[18];
        var directTraffic = {
            'name': directTrafficData.definition.meta.name,
            'description': directTrafficData.definition.meta.description,
            'highlightValue': parseInt(directTrafficAverage30.values[0][0]),
            'trend': this.getTrend(directTrafficAverage30.values[0][0], directTrafficAverage60.values[0][0])
        };
        this.bodyData.directTraffic = directTraffic;

        // visits
        var visitsData = data[13];
        var visitsAverage30 = data[14];
        var visitsAverage60 = data[15];
        var visits = {
            'name': visitsData.definition.meta.name,
            'description': visitsData.definition.meta.description,
            'highlightValue': parseInt(visitsAverage30.values[0][0]),
            'trend': this.getTrend(visitsAverage30.values[0][0], visitsAverage60.values[0][0])
        };
        this.bodyData.visits = visits;

    },

    renderChartVisitsToday: function () {
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

    renderSparklineRefinedSearch: function () {
        var options = this.buildChartData(this.getData(), 'search-refinement-percentage', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--refined-search';
        this.buildHighCharts.sparkline(options);
    },

    renderSparklineSearchBounce: function () {
        var options = this.buildChartData(this.getData(), 'search-exit-percentage', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--search-bounce';
        this.buildHighCharts.sparkline(options);
     },

    renderSparklineDirectVisits: function () {
        var options = this.buildChartData(this.getData(), 'direct-visits-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--direct-traffic';
        this.buildHighCharts.sparkline(options);
    },

    renderSparklineVisits: function () {
        var options = this.buildChartData(this.getData(), 'visits-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--visits';
        this.buildHighCharts.sparkline(options);
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
        this.buildHighCharts.setChartOptions();
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

        this.buildTableHtml(options);
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

        this.buildTableHtml(options);
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

        this.buildTableHtml(options);
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

        this.buildTableHtml(options);
    },

    renderHiddenTables: function() {
        this.renderTableVisitsToday();
        this.renderTableDevices();

        /* Uncomment if we put charts back in */
        // this.renderTableLandingPages();
        // this.renderTableTrafficSources();
    },

    renderTemplate: function (container) {
        container.innerHTML = this.webTrafficTemplate(this.bodyData);
    }

};

module.exports = viewWebTraffic;
