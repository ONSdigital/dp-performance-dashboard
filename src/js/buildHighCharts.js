var buildHighCharts = {
    Highcharts: require('highcharts'),
    chartConfig: {
        credits: {
            enabled: false
        },
        lang: {
            thousandsSep: ','
        },
        chart: {
            style: {
                fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
                fontSize: '14px'
            },
            spacingTop: 15,
            spacingBottom: 15,
            spacingLeft: 0,
            spacingRight: 0,
            marginTop: 32
        },
        colors: ['#3B7A9E', '#FF9933', '#9E9E9E', '#55A9DC', '#E6645C', '#886DB3', '#6CC080'],
        series: [{
            marker: {
                enabled: true,
                lineWidth: 3,
                radius: 5,
                fillColor: null,
                lineColor: '#FFFFFF',
                symbol: 'circle',
                states: {
                    hover: {
                        lineWidth: 5,
                        radius: 7
                    }
                }
            }
        }],
        tooltip: {
            shared: true,
            useHTML: true,
            style: {
                "padding": "8px 16px 8px 16px"
            },
            backgroundColor: 'rgba(234,234,234, 1)',
            borderWidth: 1,
            borderRadius: 0,
            borderColor: 'rgba(208,210,211, 1)',
            shadow: false
        }
    },

    setChartOptions: function () {
        buildHighCharts.Highcharts.setOptions(this.chartConfig);
    },

    chart: function(options){
        return new this.Highcharts.Chart(options)
    },

    sparkline: function (options) {
        // set styling for Sparklines
        var sparklineOptions = {
            chart: {
                //renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                marginRight:0,
                marginLeft:0,
                marginBottom: 2,
                skipClone: true
            },
            title: {
                text: ''
            },
            subtitle: {
                text: '',
                y: 110
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: [],
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickWidth: 0,
                lineColor: "#FFFFFF",
                tickColor: "#FFFFFF"
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0],
                tickWidth: 0,
                gridLineWidth: 0
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                series: {
                    animation: false,
                    turboThreshold:0,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 1
                            }
                        }
                    },
                    fillOpacity: 0.15,
                    enableMouseTracking: false,
                },
                column: {
                    negativeColor: '#910000'
                    //borderColor: 'silver'
                }
            },
            exporting: {
                enabled: false
            }
        };

        options = this.Highcharts.merge(sparklineOptions, options);

        return new this.Highcharts.Chart(options);
    }
};

module.exports = buildHighCharts;
