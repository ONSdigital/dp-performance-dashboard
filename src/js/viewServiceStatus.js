
var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {"title": "Service status"},
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.serviceStatus.data;
    },

    setChartOptions: function() {
        this.Highcharts.setOptions(this.chartConfig)
    },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);
        this.bindClickEvents();
        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function(){
            viewServiceStatus.renderCharts();
            viewServiceStatus.renderHiddenTables();
        }, 5);

    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.averageResponseTimes = [];
        for (var i = 0; i <= 2; i++) {
            var responseTimeData = {
                'name': data[i].definition.meta.name,
                'description': data[i].definition.meta.description,
                'responseTime': data[i].values[0][2],
                'timeUp': data[i].values[0][3],
                'timeDown': data[i].values[0][4],
                'percentageTimeUp': data[i].values[0][6],
                'percentageTimeDown': data[i].values[0][7]
            };
            this.bodyData.averageResponseTimes.push(responseTimeData);
        }
        this.bodyData.averageRequestTimes = [];
        for (var i = 0; i <= 2; i++) {
            var requestTimeData = {
                'name': reqData[i].definition.meta.name,
                'description': reqData[i].definition.meta.description,
                'requestTime': reqData[i].values[0][1]
            };
            this.bodyData.averageRequestTimes.push(requestTimeData);
        }

    },

    bindClickEvents: function() {
        var tabLinks = document.getElementsByClassName('btn--tab');

        for(var i =0 ; i < tabLinks.length; i++) {
            tabLinks[i].addEventListener("click", this.handleTabClick, false);
        }

    },

    handleTabClick: function() {
        // hide all tab content and set aria
        var tabContent = document.getElementsByClassName('tab__content');
        for (var i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = 'none';
            tabContent[i].setAttribute('aria-hidden', 'true');
        }

        // remove active class from all buttons and set aria
        var tabLinks = document.getElementsByClassName('btn--tab');
        for (var i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(' btn--tab-active', '');
            tabLinks[i].setAttribute('aria-selected', false);
        }

        // show tab content, add aria & add active class to button
        var activeTabName = this.getAttribute('aria-controls');
        var activeTabContent = document.getElementById(activeTabName);
        activeTabContent.style.display = 'block';
        activeTabContent.setAttribute('aria-hidden', 'false');
        this.className += ' btn--tab-active';
        this.setAttribute('aria-selected', true);
    },

    renderChartRequestTimesDaily: function () {
        //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
        var options = this.buildChartData(reqData, 3, 0, 1);

        // format time to hh:mm
        for (value in options.categories) {
            var date = new Date(options.categories[value]);
            options.categories[value] = date.getHours() + ':00';
        }
        var chart = new viewServiceStatus.Highcharts.Chart({
            chart: {
                renderTo: 'request-times-daily--chart',
                type: 'line'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                type: 'category',
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: "Time (ms)"
                }
            },
            series: [{
                data: options.series,
                marker: viewServiceStatus.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false
            }]
        });
    },

    renderChartRequestTimesMonthly: function () {
        //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
        var options = this.buildChartData(reqData, 4, 0, 1);

        // format the date to dd/mm/yyyy
        for (value in options.categories) {
            var date = new Date(options.categories[value]);
            options.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }
        var chart = new viewServiceStatus.Highcharts.Chart({
            chart: {
                renderTo: 'request-times-monthly--chart',
                type: 'line'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                type: 'category',
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: "Time (ms)"
                }
            },
            series: [{
                data: options.series,
                marker: viewServiceStatus.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false
            }]
        });
    },

    renderPublishTimesChart: function() {
        var time = this.buildChartData(reqData, 5, 0, 1);
        var files = this.buildChartData(reqData, 6, 0, 1);

        // format the date to dd/mm/yyyy
        for (value in time.categories) {
            var date = new Date(time.categories[value]);
            time.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }

        var chart = new viewServiceStatus.Highcharts.Chart({
            chart: {
                renderTo: 'publish-times--chart',
                type: 'area'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                type: 'category',
                categories: time.categories
            },
            yAxis: {
                title: {
                    text: "Time (ms)"
                }
            },
            series: [{
                name: 'Time',
                data: time.series,
                marker: viewServiceStatus.chartConfig.series[0].marker
            }, {
                name: 'Files',
                data: files.series,
                marker: viewServiceStatus.chartConfig.series[0].marker
            }]
        });
    },

    renderCharts: function() {
        this.setChartOptions();
        this.renderChartRequestTimesDaily();
        this.renderChartRequestTimesMonthly();
        this.renderPublishTimesChart();
    },

    renderTableRequestTimesDaily: function() {
        var options = {
            data: reqData,
            id: 'request-times-daily',
            headings: [
                'Hour of day',
                'Time taken (ms)'
            ],
            body: [
                {
                    dataNode: 3,
                    valueNodes: [
                        0,
                        1
                    ]
                }
            ]
        };

        this.buildTableHtml(options);
    },

    renderTableRequestTimesMonthly: function() {
        var options = {
            data: reqData,
            id: 'request-times-monthly',
            headings: [
                'Date',
                'Time taken (ms)'
            ],
            body: [
                {
                    dataNode: 4,
                    valueNodes: [
                        0,
                        1
                    ]
                }
            ]
        };

        this.buildTableHtml(options);
    },

    renderTablePublishTimes: function() {
        var options = {
            data: reqData,
            id: 'publish-times',
            headings: [
                'Date',
                'Time taken (ms)',
                'Number of files'
            ],
            body: [
                {
                    dataNode: 5,
                    valueNodes: [
                        0,
                        1
                    ]
                },
                {
                    dataNode: 6,
                    valueNodes: [
                        1
                    ]
                }
            ]
        };

        this.buildTableHtml(options);
    },

    renderHiddenTables: function() {
        var t0 = performance.now();
        this.renderTableRequestTimesDaily();
        this.renderTableRequestTimesMonthly();
        this.renderTablePublishTimes();
        var t1 = performance.now();
        console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate service status tables');

    },

    renderTemplate: function(container) {
        container.innerHTML = this.serviceStatusTemplate(this.bodyData);
    }
};

module.exports = viewServiceStatus;

var reqData = [{"name":"request-time-1-day","definition":{"name":"request-time-1-day","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"1daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last day"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-08-22T00:00:00.000+01:00","41.069767","86400","1"]]},{"name":"request-time-7-day","definition":{"name":"request-time-7-day","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"7daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last 7 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-08-16T00:00:00.000+01:00","0","86400","1"],["2016-08-17T00:00:00.000+01:00","0","86400","1"],["2016-08-18T00:00:00.000+01:00","0","86400","1"],["2016-08-19T00:00:00.000+01:00","0","86400","1"],["2016-08-20T00:00:00.000+01:00","0","86400","1"],["2016-08-21T00:00:00.000+01:00","0","86400","1"],["2016-08-22T00:00:00.000+01:00","41.069767","86400","1"]]},{"name":"request-time-30-day","definition":{"name":"request-time-30-day","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last 30 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-07-24T00:00:00.000+01:00","0","86400","1"],["2016-07-25T00:00:00.000+01:00","0","86400","1"],["2016-07-26T00:00:00.000+01:00","0","86400","1"],["2016-07-27T00:00:00.000+01:00","0","86400","1"],["2016-07-28T00:00:00.000+01:00","0","86400","1"],["2016-07-29T00:00:00.000+01:00","0","86400","1"],["2016-07-30T00:00:00.000+01:00","0","86400","1"],["2016-07-31T00:00:00.000+01:00","0","86400","1"],["2016-08-01T00:00:00.000+01:00","0","86400","1"],["2016-08-02T00:00:00.000+01:00","0","86400","1"],["2016-08-03T00:00:00.000+01:00","0","86400","1"],["2016-08-04T00:00:00.000+01:00","0","86400","1"],["2016-08-05T00:00:00.000+01:00","0","86400","1"],["2016-08-06T00:00:00.000+01:00","0","86400","1"],["2016-08-07T00:00:00.000+01:00","0","86400","1"],["2016-08-08T00:00:00.000+01:00","0","86400","1"],["2016-08-09T00:00:00.000+01:00","0","86400","1"],["2016-08-10T00:00:00.000+01:00","0","86400","1"],["2016-08-11T00:00:00.000+01:00","0","86400","1"],["2016-08-12T00:00:00.000+01:00","0","86400","1"],["2016-08-13T00:00:00.000+01:00","0","86400","1"],["2016-08-14T00:00:00.000+01:00","0","86400","1"],["2016-08-15T00:00:00.000+01:00","0","86400","1"],["2016-08-16T00:00:00.000+01:00","0","86400","1"],["2016-08-17T00:00:00.000+01:00","0","86400","1"],["2016-08-18T00:00:00.000+01:00","0","86400","1"],["2016-08-19T00:00:00.000+01:00","0","86400","1"],["2016-08-20T00:00:00.000+01:00","0","86400","1"],["2016-08-21T00:00:00.000+01:00","0","86400","1"],["2016-08-22T00:00:00.000+01:00","41.069767","86400","1"]]},{"name":"request-time-1-day-hourly","definition":{"name":"request-time-1-day-hourly","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dREQUEST_TIME | timechart span\u003d1h avg(timeTaken)","start-date":"1daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request times hourly over the last day"}},"columns":["_time","avg(timeTaken)","_span"],"values":[["2016-08-22T00:00:00.000+01:00","0","3600"],["2016-08-22T01:00:00.000+01:00","0","3600"],["2016-08-22T02:00:00.000+01:00","0","3600"],["2016-08-22T03:00:00.000+01:00","0","3600"],["2016-08-22T04:00:00.000+01:00","0","3600"],["2016-08-22T05:00:00.000+01:00","0","3600"],["2016-08-22T06:00:00.000+01:00","0","3600"],["2016-08-22T07:00:00.000+01:00","0","3600"],["2016-08-22T08:00:00.000+01:00","0","3600"],["2016-08-22T09:00:00.000+01:00","0","3600"],["2016-08-22T10:00:00.000+01:00","45.821212","3600"],["2016-08-22T11:00:00.000+01:00","25.390000","3600"],["2016-08-22T12:00:00.000+01:00","0","3600"],["2016-08-22T13:00:00.000+01:00","0","3600"],["2016-08-22T14:00:00.000+01:00","0","3600"],["2016-08-22T15:00:00.000+01:00","0","3600"],["2016-08-22T16:00:00.000+01:00","0","3600"],["2016-08-22T17:00:00.000+01:00","0","3600"],["2016-08-22T18:00:00.000+01:00","0","3600"],["2016-08-22T19:00:00.000+01:00","0","3600"],["2016-08-22T20:00:00.000+01:00","0","3600"],["2016-08-22T21:00:00.000+01:00","0","3600"],["2016-08-22T22:00:00.000+01:00","0","3600"],["2016-08-22T23:00:00.000+01:00","0","3600"]]},{"name":"request-time-30-day-daily","definition":{"name":"request-time-30-day-daily","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request times daily over the last 30 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-07-24T00:00:00.000+01:00","0","86400","1"],["2016-07-25T00:00:00.000+01:00","0","86400","1"],["2016-07-26T00:00:00.000+01:00","0","86400","1"],["2016-07-27T00:00:00.000+01:00","0","86400","1"],["2016-07-28T00:00:00.000+01:00","0","86400","1"],["2016-07-29T00:00:00.000+01:00","0","86400","1"],["2016-07-30T00:00:00.000+01:00","0","86400","1"],["2016-07-31T00:00:00.000+01:00","0","86400","1"],["2016-08-01T00:00:00.000+01:00","0","86400","1"],["2016-08-02T00:00:00.000+01:00","0","86400","1"],["2016-08-03T00:00:00.000+01:00","0","86400","1"],["2016-08-04T00:00:00.000+01:00","0","86400","1"],["2016-08-05T00:00:00.000+01:00","0","86400","1"],["2016-08-06T00:00:00.000+01:00","0","86400","1"],["2016-08-07T00:00:00.000+01:00","0","86400","1"],["2016-08-08T00:00:00.000+01:00","0","86400","1"],["2016-08-09T00:00:00.000+01:00","0","86400","1"],["2016-08-10T00:00:00.000+01:00","0","86400","1"],["2016-08-11T00:00:00.000+01:00","0","86400","1"],["2016-08-12T00:00:00.000+01:00","0","86400","1"],["2016-08-13T00:00:00.000+01:00","0","86400","1"],["2016-08-14T00:00:00.000+01:00","0","86400","1"],["2016-08-15T00:00:00.000+01:00","0","86400","1"],["2016-08-16T00:00:00.000+01:00","0","86400","1"],["2016-08-17T00:00:00.000+01:00","0","86400","1"],["2016-08-18T00:00:00.000+01:00","0","86400","1"],["2016-08-19T00:00:00.000+01:00","0","86400","1"],["2016-08-20T00:00:00.000+01:00","0","86400","1"],["2016-08-21T00:00:00.000+01:00","0","86400","1"],["2016-08-22T00:00:00.000+01:00","41.069767","86400","1"]]},{"name":"publish-time-30-day","definition":{"name":"publish-time-30-day","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dCOLLECTIONS_PUBLISH_TIME | timechart span\u003d1d avg(collectionsPublishTime)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request times daily over the last 30 days"}},"columns":["_time","avg(collectionsPublishTime)","_span","_spandays"],"values":[["2016-07-24T00:00:00.000+01:00","0","86400","1"],["2016-07-25T00:00:00.000+01:00","0","86400","1"],["2016-07-26T00:00:00.000+01:00","0","86400","1"],["2016-07-27T00:00:00.000+01:00","0","86400","1"],["2016-07-28T00:00:00.000+01:00","0","86400","1"],["2016-07-29T00:00:00.000+01:00","0","86400","1"],["2016-07-30T00:00:00.000+01:00","0","86400","1"],["2016-07-31T00:00:00.000+01:00","0","86400","1"],["2016-08-01T00:00:00.000+01:00","0","86400","1"],["2016-08-02T00:00:00.000+01:00","0","86400","1"],["2016-08-03T00:00:00.000+01:00","0","86400","1"],["2016-08-04T00:00:00.000+01:00","0","86400","1"],["2016-08-05T00:00:00.000+01:00","0","86400","1"],["2016-08-06T00:00:00.000+01:00","0","86400","1"],["2016-08-07T00:00:00.000+01:00","0","86400","1"],["2016-08-08T00:00:00.000+01:00","0","86400","1"],["2016-08-09T00:00:00.000+01:00","0","86400","1"],["2016-08-10T00:00:00.000+01:00","0","86400","1"],["2016-08-11T00:00:00.000+01:00","0","86400","1"],["2016-08-12T00:00:00.000+01:00","0","86400","1"],["2016-08-13T00:00:00.000+01:00","0","86400","1"],["2016-08-14T00:00:00.000+01:00","0","86400","1"],["2016-08-15T00:00:00.000+01:00","0","86400","1"],["2016-08-16T00:00:00.000+01:00","0","86400","1"],["2016-08-17T00:00:00.000+01:00","0","86400","1"],["2016-08-18T00:00:00.000+01:00","0","86400","1"],["2016-08-19T00:00:00.000+01:00","0","86400","1"],["2016-08-20T00:00:00.000+01:00","0","86400","1"],["2016-08-21T00:00:00.000+01:00","0","86400","1"],["2016-08-22T00:00:00.000+01:00","735200246900.666626","86400","1"]]},{"name":"publish-file-30-day","definition":{"name":"publish-file-30-day","frequency":"hourly","query":{"query":"(index\u003dsandbox) metricsType\u003dCOLLECTIONS_PUBLISH_TIME | timechart span\u003d1d avg(collectionsPublishFileCount)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average publish file count","description":"Average publish file counts daily over the last 30 days"}},"columns":["_time","avg(collectionsPublishFileCount)","_span","_spandays"],"values":[["2016-07-24T00:00:00.000+01:00","0","86400","1"],["2016-07-25T00:00:00.000+01:00","0","86400","1"],["2016-07-26T00:00:00.000+01:00","0","86400","1"],["2016-07-27T00:00:00.000+01:00","0","86400","1"],["2016-07-28T00:00:00.000+01:00","0","86400","1"],["2016-07-29T00:00:00.000+01:00","0","86400","1"],["2016-07-30T00:00:00.000+01:00","0","86400","1"],["2016-07-31T00:00:00.000+01:00","0","86400","1"],["2016-08-01T00:00:00.000+01:00","0","86400","1"],["2016-08-02T00:00:00.000+01:00","0","86400","1"],["2016-08-03T00:00:00.000+01:00","0","86400","1"],["2016-08-04T00:00:00.000+01:00","0","86400","1"],["2016-08-05T00:00:00.000+01:00","0","86400","1"],["2016-08-06T00:00:00.000+01:00","0","86400","1"],["2016-08-07T00:00:00.000+01:00","0","86400","1"],["2016-08-08T00:00:00.000+01:00","0","86400","1"],["2016-08-09T00:00:00.000+01:00","0","86400","1"],["2016-08-10T00:00:00.000+01:00","0","86400","1"],["2016-08-11T00:00:00.000+01:00","0","86400","1"],["2016-08-12T00:00:00.000+01:00","0","86400","1"],["2016-08-13T00:00:00.000+01:00","0","86400","1"],["2016-08-14T00:00:00.000+01:00","0","86400","1"],["2016-08-15T00:00:00.000+01:00","0","86400","1"],["2016-08-16T00:00:00.000+01:00","0","86400","1"],["2016-08-17T00:00:00.000+01:00","0","86400","1"],["2016-08-18T00:00:00.000+01:00","0","86400","1"],["2016-08-19T00:00:00.000+01:00","0","86400","1"],["2016-08-20T00:00:00.000+01:00","0","86400","1"],["2016-08-21T00:00:00.000+01:00","0","86400","1"],["2016-08-22T00:00:00.000+01:00","38.000000","86400","1"]]}];