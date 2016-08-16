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

    getData: function() {
        // Get latest activity data from state
        var currentState = this.store.getState();
        return currentState.activity.data;
    },

    renderView: function (container) {
        this.getData();
        this.buildPageData();
        this.renderTemplate(container);
        this.setChartOptions();
        this.renderChartVisitsToday();
        this.renderChartDevices();
        this.renderChartLandingPages();
        this.renderChartTrafficSources();
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

        // format categories names with zeros to look like times
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
        //this.renderChart('devices--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
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
        //this.renderChart('landing-pages--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 4, 0, 1, "bar")));
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
        //this.renderChart('traffic-sources--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
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

    renderCharts: function (container, data) {

    },

    renderTemplate: function (container) {
        container.innerHTML = this.activityTemplate(this.bodyData);
    }

};

module.exports = viewActivity;
