var chartConfig = {
    chart: {
        type: ''
    },
    colors: ['#55A9DC', '#E6645C', '#886DB3', '#6CC080'],
    title: {
        text: ''
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    series: [{
        name: '',
        data: [],
        marker : {
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
    }]
};

module.exports = chartConfig;
