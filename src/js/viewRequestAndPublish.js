
var viewRequestAndPublishTimes = {
    requestAndPublishTimesTemplate: require('../templates/request-and-publish.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {},
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),
    activeChartTab: 'request-times-daily--chart',

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
            viewRequestAndPublishTimes.toggleChartTabs();
        }, 5);

    },

    bindClickEvents: function() {
        var tabLinks = document.getElementsByClassName('btn--tab');

        for(var i =0 ; i < tabLinks.length; i++) {
            tabLinks[i].addEventListener("click", this.handleTabClick, false);
        }
    },

    toggleChartTabs: function (thisElement) {

        // Either pass in parameter of 'this' or use the default (ie chart of today's data)
        thisElement = thisElement ? thisElement : document.querySelectorAll('[aria-controls="' + this.activeChartTab + '"]')[0];

        console.log(thisElement);

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
        var activeTabName = thisElement.getAttribute('aria-controls');
        var activeTabContent = document.getElementById(activeTabName);
        activeTabContent.style.display = 'block';
        activeTabContent.setAttribute('aria-hidden', 'false');
        thisElement.className += ' btn--tab-active';
        thisElement.setAttribute('aria-selected', true);

        // set active tab so same tab is shown on re-render of charts
        viewRequestAndPublishTimes.activeChartTab = activeTabName;
    },

    handleTabClick: function() {
        //TODO abstract out Jon's dodgy code

        viewRequestAndPublishTimes.toggleChartTabs(this);
        // // hide all tab content and set aria
        // var tabContent = document.getElementsByClassName('tab__content'),
        //     tabContentLength = tabContent.length,
        //     i;
        // for (i = 0; i < tabContentLength; i++) {
        //     tabContent[i].style.display = 'none';
        //     tabContent[i].setAttribute('aria-hidden', 'true');
        // }
        //
        // // remove active class from all buttons and set aria
        // var tabLinks = document.getElementsByClassName('btn--tab'),
        //     tabLinksLength = tabLinks.length;
        // for (i = 0; i < tabLinksLength; i++) {
        //     tabLinks[i].className = tabLinks[i].className.replace(' btn--tab-active', '');
        //     tabLinks[i].setAttribute('aria-selected', false);
        // }
        //
        // // show tab content, add aria, toggle active tab object & add active class to button
        // var activeTabName = this.getAttribute('aria-controls');
        // var activeTabContent = document.getElementById(activeTabName);
        // activeTabContent.style.display = 'block';
        // activeTabContent.setAttribute('aria-hidden', 'false');
        // viewRequestAndPublishTimes.setActiveTab(activeTabName);
        // this.className += ' btn--tab-active';
        // this.setAttribute('aria-selected', true);
    },

    buildPageData: function() {
        var data = this.getData();
        this.bodyData.averageRequestTimes = [];
        for (var i = 0; i <= 2; i++) {
            var requestTimeData = {
                'name': data[i].definition.meta.name,
                'description': data[i].definition.meta.description,
                // 'requestTime': data[i].values[0][1]
            };
            this.bodyData.averageRequestTimes.push(requestTimeData);
        }
    },

    renderChartRequestTimesDaily: function () {
        //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
        var options = this.buildChartData(this.getData(), 3, 0, 1);

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
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false
            }]
        });
    },

    renderChartRequestTimesMonthly: function () {
        //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
        var options = this.buildChartData(this.getData(), 4, 0, 1);

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
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: "Time (ms)"
                }
            },
            series: [{
                data: options.series,
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker,
                name: "Request time",
                showInLegend: false
            }]
        });
    },

    renderPublishTimesChart: function() {
        var time = this.buildChartData(this.getData(), 5, 0, 1);
        var files = this.buildChartData(this.getData(), 6, 0, 1);

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
                marker: viewRequestAndPublishTimes.chartConfig.series[0].marker
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
