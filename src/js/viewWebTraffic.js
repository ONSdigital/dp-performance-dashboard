var webTrafficTemplate = require('../templates/web-traffic.handlebars'),
    buildHighCharts = require('./buildHighCharts'),
    chartConfig = require('./chartConfig'),
    buildChartData = require('./buildChartDataObject'),
    bodyData = {},
    store = require('./state'),
    buildTableHtml = require('./buildTableHtml'),
    numberFormatter = require('./numberFormatter'),
    getTrend = require('./getTrend');

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

    buildPageData: function () {
        var data = this.getData();
        bodyData.activeUsers = data[0].values[0].toString();

        // dataset downloads
        var datasetDownloadsData = data[19],
            datasetDownloadsAverage30 = data[20],
            datasetDownloadsAverage60 = data[21],
            datasetDownloads = {
                'name': datasetDownloadsData.definition.meta.name,
                'description': datasetDownloadsData.definition.meta.description,
                'highlightValue': parseInt(datasetDownloadsAverage30.values[0][0]),
                'trend': getTrend(datasetDownloadsAverage30.values[0][0], datasetDownloadsAverage60.values[0][0])
            };
        bodyData.datasetDownloads = datasetDownloads;

        // navigation bounce
        var navBounceData = data[7],
            navBounceAverage30 = data[8],
            navBounceAverage60 = data[9],
            navBounce = {
                'name': navBounceData.definition.meta.name,
                'description': navBounceData.definition.meta.description,
                'highlightValue': parseInt(navBounceAverage30.values[0][0]),
                'trend': getTrend(navBounceAverage30.values[0][0], navBounceAverage60.values[0][0])
            };
        bodyData.navBounce = navBounce;

        //search refinement
        var searchRefinementData = data[7],
            searchRefinementAverage30 = data[8],
            searchRefinementAverage60 = data[9],
            searchRefinement = {
                'name': searchRefinementData.definition.meta.name,
                'description': searchRefinementData.definition.meta.description,
                'highlightValue': parseInt(searchRefinementAverage30.values[0][0]),
                'trend': getTrend(searchRefinementAverage30.values[0][0], searchRefinementAverage60.values[0][0])
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
                'trend': getTrend(searchExitAverage30.values[0][0], searchExitAverage60.values[0][0])
            };
        bodyData.searchExit = searchExit;

        // external links
        var externalLinksData = data[22],
            externalLinksAverage30 = data[23],
            externalLinksAverage60 = data[24],
            externalLinks = {
                'name': externalLinksData.definition.meta.name,
                'description': externalLinksData.definition.meta.description,
                'highlightValue': parseInt(externalLinksAverage30.values[0][0]),
                'trend': getTrend(externalLinksAverage30.values[0][0], externalLinksAverage60.values[0][0])
            };
        bodyData.externalLinks = externalLinks;

        // visits
        var visitsData = data[13],
            visitsAverage30 = data[14],
            visitsAverage60 = data[15],
            visits = {
                'name': visitsData.definition.meta.name,
                'description': visitsData.definition.meta.description,
                'highlightValue': numberFormatter(parseInt(visitsAverage30.values[0][0])),
                'trend': getTrend(visitsAverage30.values[0][0], visitsAverage60.values[0][0])
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
                'trend': getTrend(directTrafficAverage30.values[0][0], directTrafficAverage60.values[0][0])
            };
        bodyData.directTraffic = directTraffic;

        // 30 secs on bulletin
        var bulletinData = data[25],
            bulletinAverage30 = data[26],
            bulletinAverage60 = data[27],
            bulletin = {
                'name': bulletinData.definition.meta.name,
                'description': bulletinData.definition.meta.description,
                'highlightValue': parseInt(bulletinAverage30.values[0][0]),
                'trend': getTrend(bulletinAverage30.values[0][0], bulletinAverage60.values[0][0])
            };
        bodyData.bulletin = bulletin;

    },

    renderChartVisitsToday: function () {
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

    renderSparklineDatasetDownloads: function () {
        var options = buildChartData(this.getData(), 'dataset-page-downloads-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--dataset-downloads';
        buildHighCharts.sparkline(options);
    },

    renderSparklineNavigationBounce: function () {
        var options = buildChartData(this.getData(), 'search-refinement-percentage', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--nav-bounce';
        buildHighCharts.sparkline(options);
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

    renderSparklineExternalLinks: function () {
        var options = buildChartData(this.getData(), 'users-following-external-links-daily-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--external-links';
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

    renderSparklineBulletins: function () {
        var options = buildChartData(this.getData(), 'users-30-sec-on-bulletin-30-days', 0, 1);
        var data = options.series;
        options.series = [{
            data: data,
            pointStart: 1
        }];
        options.chart = {};
        options.chart.renderTo = 'sparkline--bulletins';
        buildHighCharts.sparkline(options);
    },

    renderCharts: function () {
        buildHighCharts.setChartOptions();
        this.renderChartVisitsToday();
        //this.renderSparklineDatasetDownloads();
        //this.renderSparklineNavigationBounce();
        this.renderSparklineRefinedSearch();
        this.renderSparklineSearchBounce();
        this.renderSparklineDirectVisits();
        this.renderSparklineExternalLinks();
        this.renderSparklineVisits();
        this.renderSparklineBulletins();
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

    renderHiddenTables: function() {
        this.renderTableVisitsToday();
    },

    renderTemplate: function (container) {
        container.innerHTML = webTrafficTemplate(bodyData);
    }

};

module.exports = viewWebTraffic;
