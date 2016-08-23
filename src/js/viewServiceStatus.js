
var viewServiceStatus = {

    serviceStatusTemplate: require('../templates/service-status.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {"title": "Service status"},
    store: require('./state'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.serviceStatus.data;
    },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);
        this.bindClickEvents();
        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function(){viewServiceStatus.renderCharts();}, 5);

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

    renderCharts: function() {
        this.renderChartRequestTimesDaily();
        this.renderChartRequestTimesMonthly();
    },

    renderTemplate: function(container) {
        container.innerHTML = this.serviceStatusTemplate(this.bodyData);
    }
};

module.exports = viewServiceStatus;

var reqData = [{"name":"request-time-1-day","definition":{"name":"request-time-1-day","frequency":"hourly","query":{"query":"search * earliest\u003d08/16/2016:15:0:0 latest\u003d08/17/2016:0:0:0 (index\u003dsandbox) statsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"1daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last day"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-08-16T00:00:00.000+01:00","45.750000","86400","1"]]},{"name":"request-time-7-day","definition":{"name":"request-time-7-day","frequency":"hourly","query":{"query":"search * earliest\u003d08/16/2016:15:0:0 latest\u003d08/17/2016:0:0:0 (index\u003dsandbox) statsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"7daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last 7 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-08-16T00:00:00.000+01:00","45.750000","86400","1"]]},{"name":"request-time-30-day","definition":{"name":"request-time-30-day","frequency":"hourly","query":{"query":"search * earliest\u003d08/16/2016:15:0:0 latest\u003d08/17/2016:0:0:0 (index\u003dsandbox) statsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request time over the last 7 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-08-16T00:00:00.000+01:00","45.750000","86400","1"]]},{"name":"request-time-1-day-hourly","definition":{"name":"request-time-1-day-hourly","frequency":"hourly","query":{"query":"search * earliest\u003d08/16/2016:15:0:0 latest\u003d08/17/2016:0:0:0 (index\u003dsandbox) statsType\u003dREQUEST_TIME | timechart span\u003d1h avg(timeTaken)","start-date":"1daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request times hourly over the last day"}},"columns":["_time","avg(timeTaken)","_span"],"values":[["2016-08-16T15:00:00.000+01:00","45.750000","3600"],["2016-08-16T16:00:00.000+01:00","0","3600"],["2016-08-16T17:00:00.000+01:00","0","3600"],["2016-08-16T18:00:00.000+01:00","0","3600"],["2016-08-16T19:00:00.000+01:00","0","3600"],["2016-08-16T20:00:00.000+01:00","0","3600"],["2016-08-16T21:00:00.000+01:00","0","3600"],["2016-08-16T22:00:00.000+01:00","0","3600"],["2016-08-16T23:00:00.000+01:00","0","3600"]]},{"name":"request-time-30-day-daily","definition":{"name":"request-time-30-day-daily","frequency":"hourly","query":{"query":"search * earliest\u003d07/16/2016:15:0:0 latest\u003d08/17/2016:0:0:0 (index\u003dsandbox) statsType\u003dREQUEST_TIME | timechart span\u003d1d avg(timeTaken)","start-date":"30daysAgo","end-date":"today"},"meta":{"name":"Average request time","description":"Average request times daily over the last 30 days"}},"columns":["_time","avg(timeTaken)","_span","_spandays"],"values":[["2016-07-16T00:00:00.000+01:00","0","86400","1"],["2016-07-17T00:00:00.000+01:00","0","86400","1"],["2016-07-18T00:00:00.000+01:00","0","86400","1"],["2016-07-19T00:00:00.000+01:00","0","86400","1"],["2016-07-20T00:00:00.000+01:00","0","86400","1"],["2016-07-21T00:00:00.000+01:00","0","86400","1"],["2016-07-22T00:00:00.000+01:00","0","86400","1"],["2016-07-23T00:00:00.000+01:00","0","86400","1"],["2016-07-24T00:00:00.000+01:00","0","86400","1"],["2016-07-25T00:00:00.000+01:00","0","86400","1"],["2016-07-26T00:00:00.000+01:00","0","86400","1"],["2016-07-27T00:00:00.000+01:00","0","86400","1"],["2016-07-28T00:00:00.000+01:00","0","86400","1"],["2016-07-29T00:00:00.000+01:00","0","86400","1"],["2016-07-30T00:00:00.000+01:00","0","86400","1"],["2016-07-31T00:00:00.000+01:00","0","86400","1"],["2016-08-01T00:00:00.000+01:00","0","86400","1"],["2016-08-02T00:00:00.000+01:00","0","86400","1"],["2016-08-03T00:00:00.000+01:00","0","86400","1"],["2016-08-04T00:00:00.000+01:00","0","86400","1"],["2016-08-05T00:00:00.000+01:00","0","86400","1"],["2016-08-06T00:00:00.000+01:00","0","86400","1"],["2016-08-07T00:00:00.000+01:00","0","86400","1"],["2016-08-08T00:00:00.000+01:00","0","86400","1"],["2016-08-09T00:00:00.000+01:00","0","86400","1"],["2016-08-10T00:00:00.000+01:00","0","86400","1"],["2016-08-11T00:00:00.000+01:00","0","86400","1"],["2016-08-12T00:00:00.000+01:00","0","86400","1"],["2016-08-13T00:00:00.000+01:00","0","86400","1"],["2016-08-14T00:00:00.000+01:00","0","86400","1"],["2016-08-15T00:00:00.000+01:00","0","86400","1"],["2016-08-16T00:00:00.000+01:00","45.750000","86400","1"]]}];