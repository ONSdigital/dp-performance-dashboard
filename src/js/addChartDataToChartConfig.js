module.exports = function(chartConfig, dataToAdd){
    chartConfig.chart.type = dataToAdd.type ? dataToAdd.type : chartConfig.chart.type;
    chartConfig.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.title.text;
    chartConfig.series[0].data = dataToAdd.series ? dataToAdd.series : chartConfig.series[0].data;
    chartConfig.series[0].name = dataToAdd.title ? dataToAdd.title : chartConfig.series[0].name;
    chartConfig.xAxis.categories = dataToAdd.categories ? dataToAdd.categories : chartConfig.xAxis.categories;
    chartConfig.yAxis.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.yAxis.title.text;

    return chartConfig;
};


