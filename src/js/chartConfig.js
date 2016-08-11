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
};

module.exports = chartConfig;
