
var viewServiceStatus = {

    responseTimesTemplate: require('../templates/response-times.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {},
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),

    getData: function() {
        // Get latest activity dataSources from state
        var currentState = this.store.getState();
        return currentState.responseTimes.data;
    },

    // setChartOptions: function() {
    //     this.Highcharts.setOptions(this.chartConfig)
    // },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);
        // this.bindClickEvents();
        // add delay before rendering charts to give browser chance to render template changes
        // setTimeout(function(){
        //     viewServiceStatus.renderCharts();
        //     viewServiceStatus.renderHiddenTables();
        // }, 5);

    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.averageResponseTimes = [];
        for (var i = 0; i <= 2; i++) {
            var responseTimeData = {
                'name': data[i].definition.meta.name,
                'description': data[i].definition.meta.description,
                'responseTime': parseInt(data[i].values[0][2]).toFixed(0),
                'timeUp': data[i].values[0][3],
                'timeDown': data[i].values[0][4],
                'percentageTimeUp': data[i].values[0][6],
                'percentageTimeDown': data[i].values[0][7]
            };
            this.bodyData.averageResponseTimes.push(responseTimeData);
        }
        // this.bodyData.averageRequestTimes = [];
        // for (var i = 0; i <= 2; i++) {
        //     var requestTimeData = {
        //         'name': reqData[i].definition.meta.name,
        //         'description': reqData[i].definition.meta.description,
        //         'requestTime': reqData[i].values[0][1]
        //     };
        //     this.bodyData.averageRequestTimes.push(requestTimeData);
        // }

    },

    bindClickEvents: function() {
        // var tabLinks = document.getElementsByClassName('btn--tab');
        //
        // for(var i =0 ; i < tabLinks.length; i++) {
        //     tabLinks[i].addEventListener("click", this.handleTabClick, false);
        // }

    },

    handleTabClick: function() {
        // hide all tab content and set aria
        // var tabContent = document.getElementsByClassName('tab__content');
        // for (var i = 0; i < tabContent.length; i++) {
        //     tabContent[i].style.display = 'none';
        //     tabContent[i].setAttribute('aria-hidden', 'true');
        // }
        //
        // // remove active class from all buttons and set aria
        // var tabLinks = document.getElementsByClassName('btn--tab');
        // for (var i = 0; i < tabLinks.length; i++) {
        //     tabLinks[i].className = tabLinks[i].className.replace(' btn--tab-active', '');
        //     tabLinks[i].setAttribute('aria-selected', false);
        // }
        //
        // // show tab content, add aria & add active class to button
        // var activeTabName = this.getAttribute('aria-controls');
        // var activeTabContent = document.getElementById(activeTabName);
        // activeTabContent.style.display = 'block';
        // activeTabContent.setAttribute('aria-hidden', 'false');
        // this.className += ' btn--tab-active';
        // this.setAttribute('aria-selected', true);
    },

    // renderChartRequestTimesDaily: function () {
    //     //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
    //     var options = this.buildChartData(reqData, 3, 0, 1);
    //
    //     // format time to hh:mm
    //     for (value in options.categories) {
    //         var date = new Date(options.categories[value]);
    //         options.categories[value] = date.getHours() + ':00';
    //     }
    //     var chart = new viewServiceStatus.Highcharts.Chart({
    //         chart: {
    //             renderTo: 'request-times-daily--chart',
    //             type: 'line'
    //         },
    //         title: {
    //             text: '',
    //             align: "left"
    //         },
    //         xAxis: {
    //             type: 'category',
    //             categories: options.categories
    //         },
    //         yAxis: {
    //             title: {
    //                 text: "Time (ms)"
    //             }
    //         },
    //         series: [{
    //             dataSources: options.series,
    //             marker: viewServiceStatus.chartConfig.series[0].marker,
    //             name: "Request time",
    //             showInLegend: false
    //         }]
    //     });
    // },
    //
    // renderChartRequestTimesMonthly: function () {
    //     //this.renderChart('response-times--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "line")));
    //     var options = this.buildChartData(reqData, 4, 0, 1);
    //
    //     // format the date to dd/mm/yyyy
    //     for (value in options.categories) {
    //         var date = new Date(options.categories[value]);
    //         options.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    //     }
    //     var chart = new viewServiceStatus.Highcharts.Chart({
    //         chart: {
    //             renderTo: 'request-times-monthly--chart',
    //             type: 'line'
    //         },
    //         title: {
    //             text: '',
    //             align: "left"
    //         },
    //         xAxis: {
    //             type: 'category',
    //             categories: options.categories
    //         },
    //         yAxis: {
    //             title: {
    //                 text: "Time (ms)"
    //             }
    //         },
    //         series: [{
    //             dataSources: options.series,
    //             marker: viewServiceStatus.chartConfig.series[0].marker,
    //             name: "Request time",
    //             showInLegend: false
    //         }]
    //     });
    // },
    //
    // renderPublishTimesChart: function() {
    //     var time = this.buildChartData(reqData, 5, 0, 1);
    //     var files = this.buildChartData(reqData, 6, 0, 1);
    //
    //     // format the date to dd/mm/yyyy
    //     for (value in time.categories) {
    //         var date = new Date(time.categories[value]);
    //         time.categories[value] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    //     }
    //
    //     var chart = new viewServiceStatus.Highcharts.Chart({
    //         chart: {
    //             renderTo: 'publish-times--chart',
    //             type: 'area'
    //         },
    //         title: {
    //             text: '',
    //             align: "left"
    //         },
    //         xAxis: {
    //             type: 'category',
    //             categories: time.categories
    //         },
    //         yAxis: {
    //             title: {
    //                 text: "Time (ms)"
    //             }
    //         },
    //         series: [{
    //             name: 'Time',
    //             dataSources: time.series,
    //             marker: viewServiceStatus.chartConfig.series[0].marker
    //         }, {
    //             name: 'Files',
    //             dataSources: files.series,
    //             marker: viewServiceStatus.chartConfig.series[0].marker
    //         }]
    //     });
    // },

    // renderCharts: function() {
    //     this.setChartOptions();
    //     this.renderChartRequestTimesDaily();
    //     this.renderChartRequestTimesMonthly();
    //     this.renderPublishTimesChart();
    // },
    //
    // renderTableRequestTimesDaily: function() {
    //     var options = {
    //         dataSources: reqData,
    //         id: 'request-times-daily',
    //         headings: [
    //             'Hour of day',
    //             'Time taken (ms)'
    //         ],
    //         body: [
    //             {
    //                 dataNode: 3,
    //                 valueNodes: [
    //                     0,
    //                     1
    //                 ]
    //             }
    //         ]
    //     };
    //
    //     this.buildTableHtml(options);
    // },
    //
    // renderTableRequestTimesMonthly: function() {
    //     var options = {
    //         dataSources: reqData,
    //         id: 'request-times-monthly',
    //         headings: [
    //             'Date',
    //             'Time taken (ms)'
    //         ],
    //         body: [
    //             {
    //                 dataNode: 4,
    //                 valueNodes: [
    //                     0,
    //                     1
    //                 ]
    //             }
    //         ]
    //     };
    //
    //     this.buildTableHtml(options);
    // },
    //
    // renderTablePublishTimes: function() {
    //     var options = {
    //         dataSources: reqData,
    //         id: 'publish-times',
    //         headings: [
    //             'Date',
    //             'Time taken (ms)',
    //             'Number of files'
    //         ],
    //         body: [
    //             {
    //                 dataNode: 5,
    //                 valueNodes: [
    //                     0,
    //                     1
    //                 ]
    //             },
    //             {
    //                 dataNode: 6,
    //                 valueNodes: [
    //                     1
    //                 ]
    //             }
    //         ]
    //     };
    //
    //     this.buildTableHtml(options);
    // },
    //
    // renderHiddenTables: function() {
    //     var t0 = performance.now();
    //     this.renderTableRequestTimesDaily();
    //     this.renderTableRequestTimesMonthly();
    //     this.renderTablePublishTimes();
    //     var t1 = performance.now();
    //     console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate service status tables');
    //
    // },

    renderTemplate: function(container) {
        container.innerHTML = this.responseTimesTemplate(this.bodyData);
    }
};

module.exports = viewServiceStatus;