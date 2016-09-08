var viewWebTraffic = {
    container: (function () {
        return document.getElementById('content');
    })(),
    webTrafficTemplate: require('../templates/web-traffic.handlebars'),
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
        this.buildPageData();
        this.renderTemplate(container);
        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function(){
            viewWebTraffic.renderCharts();
            viewWebTraffic.renderHiddenTables();
        }, 5);
    },

    setChartOptions: function() {
        this.Highcharts.setOptions(this.chartConfig)
    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.activeUsers = data[0].values[0].toString();

        // browser stats
        var browsersIndex = 3;
        var browsers = {
            'name': data[browsersIndex].definition.meta.name,
            'description': data[browsersIndex].definition.meta.description,
            'values': []
        };
        this.bodyData.browsers = browsers;
        for (var i = 0; i < 5; i++) {
            var browser = {
                'name': data[browsersIndex].values[i][0],
                'sessions': viewWebTraffic.numberFormatter(parseInt(data[browsersIndex].values[i][1]))
            };
            browsers.values.push(browser);
        }

        // traffic sources (refers)
        trafficSourcesIndex = 6;
        var trafficSources = {
            'name': data[trafficSourcesIndex].definition.meta.name,
            'description': data[trafficSourcesIndex].definition.meta.description,
            'values': []
        };
        this.bodyData.trafficSources = trafficSources;
        for (var i = 0; i < 5; i++) {
            var trafficSource = {
                'name': data[trafficSourcesIndex].values[i][0],
                'sessions': viewWebTraffic.numberFormatter(parseInt(data[trafficSourcesIndex].values[i][2])),
                'users': viewWebTraffic.numberFormatter(parseInt(data[trafficSourcesIndex].values[i][3]))
            };
            trafficSources.values.push(trafficSource);
        }
        // landing pages
        var landingPages = {
            'name': data[5].definition.meta.name,
            'description': data[5].definition.meta.description,
            'values': []
        };
        this.bodyData.landingPages = landingPages;
        for (var i = 0; i < 5; i++) {
            var name = data[5].values[i][1].split(' - Office for National Statistics');
            var landingPage = {
                'name': name[0],
                'uri': data[5].values[i][0],
                'sessions': viewWebTraffic.numberFormatter(parseInt(data[5].values[i][2])),
                'users': viewWebTraffic.numberFormatter(parseInt(data[5].values[i][3]))
            };
            landingPages.values.push(landingPage);
        }
    },

    renderChartVisitsToday: function () {
        //this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
        var options = this.buildChartData(this.getData(), 'today', 0, 1);
        //format categories names with zeros to look like times
        for (value in options.categories) {
            options.categories[value] = options.categories[value] + ":00";
        }

        var chart = new viewWebTraffic.Highcharts.Chart({
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
        });
        //chart.series[0].setData([3,4,5,6,7,255,8,967,4]);
    },

    renderChartDevices: function () {
        var options = this.buildChartData(this.getData(), 'devices', 0, 1);
        var chart = new viewWebTraffic.Highcharts.Chart({
            chart: {
                renderTo: 'devices--chart',
                type: 'pie'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        format: '{point.name}<br/>{point.percentage:.1f} %',
                        distance: 10,
                        connectorWidth: 0,
                        x: -5,
                        y: -15,
                        style: {
                            color: '#414042',
                            fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
                            fontSize: '13px',
                            fontWeight: 400,
                            textAlign: 'center',
                            textTransform: 'capitalize'
                        }
                    }
                }
            },
            title: {
                text: '',
                align: "left"
            },
            // xAxis: {
            //     categories: ['Desktop', 'Mobile', 'Tablet'],
            //     labels: {
            //         autoRotation: 0
            //     },
            //     tickWidth: 0
            // },
            // yAxis: {
            //     title: {
            //         align: 'high',
            //         offset: -44,
            //         rotation: 0,
            //         y: -15,
            //         text: "Number of visits"
            //     },
            //     labels: {
            //         formatter: function () {
            //             return viewWebTraffic.numberFormatter(this.value);
            //         }
            //     }
            // },
            // series: [{
            //     data: options.series,
            //     marker: viewWebTraffic.chartConfig.series[0].marker,
            //     name: "Visits",
            //     showInLegend: false
            // }]
            series: [{
                name: 'Visits',
                colorByPoint: true,
                data: [{
                    name: options.categories[0],
                    y: options.series[0]
                }, {
                    name: options.categories[1],
                    y: options.series[1]
                }, {
                    name: options.categories[2],
                    y: options.series[2]
                }]
            }]
        });
    },

    renderChartLandingPages: function () {
        var options = this.buildChartData(this.getData(), 4, 1, 2);

        // remove ' - Office for National Statistics' from page titles
        // for (value in options.categories) {
        //     str = options.categories[value].split(' - Office for National Statistics');
        //     options.categories[value] = str[0];
        // }

        var chart = new viewWebTraffic.Highcharts.Chart({
            chart: {
                renderTo: 'landing-pages--chart',
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: options.categories,
                tickWidth: 0
            },
            yAxis: {
                title: {
                    text: 'Sessions'
                }
            },
            series: [{
                data: options.series,
                marker: viewWebTraffic.chartConfig.series[0].marker,
                name: "Sessions",
                showInLegend: false
            }]
        });
    },

    renderChartTrafficSources: function () {
        var options = this.buildChartData(this.getData(), 5, 0, 2);
        var chart = new viewWebTraffic.Highcharts.Chart({
            chart: {
                renderTo: 'traffic-sources--chart',
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: options.categories,
                tickWidth: 0
            },
            yAxis: {
                title: {
                    text: 'Sessions'
                }
            },
            series: [{
                data: options.series,
                marker: viewWebTraffic.chartConfig.series[0].marker,
                name: 'Sessions',
                showInLegend: false
            }]
        });
    },

    renderCharts: function () {
        this.setChartOptions();
        this.renderChartVisitsToday();
        this.renderChartDevices();
        //this.renderChartLandingPages();
        //this.renderChartTrafficSources();
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
