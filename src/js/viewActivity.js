var viewActivity = {
    container: (function () {
        return document.getElementById('content');
    })(),
    activityTemplate: require('../templates/activity.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    buildChartData: require('./buildChartDataObject'),
    bodyData: {"title": "Activity"},
    store: require('./state'),
    buildTableHtml: require('./buildTableHtml'),

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.activity.data;
    },

    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);
        // add delay before rendering charts to give browser chance to render template changes
        setTimeout(function(){
            viewActivity.renderCharts();
            viewActivity.renderHiddenTables();
        }, 5);
    },

    setChartOptions: function() {
        this.Highcharts.setOptions(this.chartConfig)
    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.activeUsers = data[0].values[0].toString();
    },

    renderChartVisitsToday: function () {
        //this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
        var options = this.buildChartData(this.getData(), 1, 0, 1);
        //format categories names with zeros to look like times
        for (value in options.categories) {
            options.categories[value] = options.categories[value] + ":00";
        }
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'visits-today--chart',
                type: 'column'
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
                    text: "Visits"
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker,
                name: "Visitors",
                showInLegend: false
            }]
        });
        //chart.series[0].setData([3,4,5,6,7,255,8,967,4]);
    },

    renderChartDevices: function () {
        var options = this.buildChartData(this.getData(), 2, 0, 1);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'devices--chart',
                type: 'column'
            },
            title: {
                text: '',
                align: "left"
            },
            xAxis: {
                categories: ['Desktop', 'Mobile', 'Tablet']
            },
            yAxis: {
                title: {
                    text: "Visits"
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker,
                name: "Device",
                showInLegend: false
            }]
        });
    },

    renderChartLandingPages: function () {
        var options = this.buildChartData(this.getData(), 4, 1, 2);

        // remove ' - Office for National Statistics' from page titles
        for (value in options.categories) {
            str = options.categories[value].split(' - Office for National Statistics');
            options.categories[value] = str[0];
        }

        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'landing-pages--chart',
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: 'Sessions'
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker,
                name: "Sessions",
                showInLegend: false
            }]
        });
    },

    renderChartTrafficSources: function () {
        var options = this.buildChartData(this.getData(), 5, 0, 2);
        var chart = new viewActivity.Highcharts.Chart({
            chart: {
                renderTo: 'traffic-sources--chart',
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: options.categories
            },
            yAxis: {
                title: {
                    text: 'Sessions'
                }
            },
            series: [{
                data: options.series,
                marker: viewActivity.chartConfig.series[0].marker,
                name: 'Sessions',
                showInLegend: false
            }]
        });
    },

    renderCharts: function () {
        this.setChartOptions();
        this.renderChartVisitsToday();
        this.renderChartDevices();
        this.renderChartLandingPages();
        this.renderChartTrafficSources();
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

        // var data = this.getData(),
        //     tableHtml = document.getElementById('visits-today--table') ? document.getElementById('visits-today--table') : document.createElement('table'),
        //     tableHeadings = ['<tr>'],
        //     tableBody = [],
        //     valuesLength = data[1].values.length,
        //     columnsLength = data[1].columns.length,
        //     valuesIndex,
        //     columnsIndex,
        //     chartElement = document.getElementById('visits-today--chart');
        //
        //
        // // Build the headings for the table
        // for (columnsIndex = 0; columnsIndex < columnsLength; columnsIndex++) {
        //     var headingTitle;
        //     switch (data[1].columns[columnsIndex]) {
        //         case 'ga:hour': {
        //             headingTitle = "Time (hour)";
        //             break;
        //         }
        //         case 'ga:sessions': {
        //             headingTitle = "Sessions";
        //             break;
        //         }
        //     }
        //
        //     tableHeadings.push('<th scope="col">' + headingTitle + '</th>');
        // }
        // tableHeadings.push('</tr>');
        // tableHeadings = tableHeadings.join('');
        //
        // // Build the body/data for the table
        // for (valuesIndex = 0; valuesIndex < valuesLength; valuesIndex++) {
        //     tableBody[valuesIndex] = '<tr><td>' + data[1].values[valuesIndex].join('</td><td>') + '</td></tr>';
        // }
        // tableBody = tableBody.join('');
        //
        // // Give our table element an ID
        // tableHtml.setAttribute('id', 'visits-today--table');
        //
        // // Hide table off of canvas
        // tableHtml.style.position = "fixed";
        // tableHtml.style.left = "-999999px";
        //
        // // Update table element with headings and body
        // tableHtml.innerHTML = tableHeadings + tableBody;
        //
        // // Append table after chart in DOM
        // chartElement.parentNode.insertBefore(tableHtml, chartElement.nextSibling);
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
        var t0 = performance.now();
        this.renderTableVisitsToday();
        this.renderTableDevices();
        this.renderTableLandingPages();
        this.renderTableTrafficSources();
        var t1 = performance.now();
        console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate activity tables');
    },

    renderTemplate: function (container) {
        container.innerHTML = this.activityTemplate(this.bodyData);
    }

};

module.exports = viewActivity;
