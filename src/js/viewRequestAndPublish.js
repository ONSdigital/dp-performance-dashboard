
var viewRequestAndPublishTimes = {
    requestAndPublishTimesTemplate: require('../templates/request-and-publish.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {
        activeChartTab: {
            today: true,
            month: false
        }
    },
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.requestAndPublishTimes.data;
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
            viewRequestAndPublishTimes.renderCharts();
            viewRequestAndPublishTimes.renderHiddenTables();
        }, 5);

    },

    bindClickEvents: function() {
        var tabLinks = document.getElementsByClassName('btn--tab');

        for(var i =0 ; i < tabLinks.length; i++) {
            tabLinks[i].addEventListener("click", this.handleTabClick, false);
        }
    },

    setActiveTab: function (activeTabId) {
        switch (activeTabId) {
            case 'request-times-daily--chart': {
                this.bodyData.activeChartTab.today = true;
                this.bodyData.activeChartTab.month = false;
                break;
            }
            case 'request-times-monthly--chart': {
                this.bodyData.activeChartTab.month = true;
                this.bodyData.activeChartTab.today = false;
                break;
            }
        }
    },

    handleTabClick: function() {
        // hide all tab content and set aria
        var tabContent = document.getElementsByClassName('tab__content'),
            tabContentLength = tabContent.length,
            i;
        for (i = 0; i < tabContentLength; i++) {
            tabContent[i].style.display = 'none';
            tabContent[i].setAttribute('aria-hidden', 'true');
        }

        // remove active class from all buttons and set aria
        var tabLinks = document.getElementsByClassName('btn--tab'),
            tabLinksLength = tabLinks.length;
        for (i = 0; i < tabLinksLength; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(' btn--tab-active', '');
            tabLinks[i].setAttribute('aria-selected', false);
        }

        // show tab content, add aria, toggle active tab object & add active class to button
        var activeTabName = this.getAttribute('aria-controls');
        var activeTabContent = document.getElementById(activeTabName);
        activeTabContent.style.display = 'block';
        activeTabContent.setAttribute('aria-hidden', 'false');
        this.className += ' btn--tab-active';
        this.setAttribute('aria-selected', true);

        // set active tab so same tab is shown on re-render of charts
        viewRequestAndPublishTimes.setActiveTab(activeTabName);
    },

    buildPageData: function() {
        var data = this.getData();
        this.bodyData.averageRequestTimes = [];
        for (var i = 0; i <= 2; i++) {
            var requestTimeData = {
                'name': data[i].definition.meta.name,
                'description': data[i].definition.meta.description,
                'requestTime': parseInt(data[i].values[0][1]).toFixed(0)
            };
            this.bodyData.averageRequestTimes.push(requestTimeData);
        }
    },

    renderChartRequestTimesDaily: function () {
        var options = this.buildChartData(this.getData(), 'request-time-1-day-hourly', 0, 1);

        // format time to hh:mm
        for (value in options.categories) {
            var date = new Date(options.categories[value]);
            options.categories[value] = date.getHours() + ':00';
        }
        var chart = new viewRequestAndPublishTimes.Highcharts.Chart({
            chart: {
                renderTo: 'request-times-daily--chart',
                type: 'line'
            },
            title: {
                text: '',
                align: "left"
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
                    offset: -35,
                    rotation: 0,
                    y: -15,
                    text: "Time (ms)"
                }
            },
            series: [{
                data: options.series,
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false,
                tooltip: {
                    valueSuffix: 'ms'
                }
            }]
        });
    },

    renderChartRequestTimesMonthly: function () {
        var options = this.buildChartData(this.getData(), 'request-time-30-day-daily', 0, 1);

        // format the date to dd/mm/yyyy
        for (value in options.categories) {
            var date = new Date(options.categories[value]);
            options.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }
        var chart = new viewRequestAndPublishTimes.Highcharts.Chart({
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
                categories: options.categories,
                labels: {
                    autoRotation: 0
                },
                tickInterval: 4
            },
            yAxis: {
                title: {
                    align: 'high',
                    offset: -35,
                    rotation: 0,
                    y: -15,
                    text: "Time (ms)"
                }
            },
            series: [{
                data: options.series,
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false,
                tooltip: {
                    valueSuffix: 'ms'
                }
            }]
        });
    },

    renderPublishTimesChart: function() {
        var time = this.buildChartData(this.getData(), 'publish-time-30-day', 0, 1);
        var files = this.buildChartData(this.getData(), 'publish-time-30-day', 0, 2);

        // format the date to dd/mm/yyyy
        for (value in time.categories) {
            var date = new Date(time.categories[value]);
            time.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }

        var chart = new viewRequestAndPublishTimes.Highcharts.Chart({
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
                title: {
                    text: 'Time (ms)',
                    align: 'high',
                    offset: -30,
                    rotation: 0,
                    y: -15
                }
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
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker,
                tooltip: {
                    valueSuffix: 'ms'
                }
            }, {
                name: 'Files',
                data: files.series,
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker
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
            data: this.getData(),
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
            data: this.getData(),
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
            data: this.getData(),
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
        this.renderTableRequestTimesDaily();
        this.renderTableRequestTimesMonthly();
        this.renderTablePublishTimes();
    },

    renderTemplate: function(container) {
        container.innerHTML = this.requestAndPublishTimesTemplate(this.bodyData);
    }
};

module.exports = viewRequestAndPublishTimes;
