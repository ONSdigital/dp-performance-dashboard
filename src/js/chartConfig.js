var chartConfig = {
    chart: {
        type: 'line'
    },
    colors: ['#55A9DC', '#E6645C', '#886DB3', '#6CC080'],
    title: {
        text: ''
    },
    xAxis: {
        categories: [1470319946,1470319886,1470319826,1470319766,1470319706,1470319646,1470319586,1470319526,1470319466,1470319406,1470319346,1470319286,1470319226,1470319166,1470319106,1470319046]
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    series: [{
        name: 'Response time',
        data: [195,473,255,152,218,2129,504,100,892,327,648,266,725,81,247,204],
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
