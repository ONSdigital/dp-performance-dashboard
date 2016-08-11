var viewActivity = {

    container: (function() {return document.getElementById('content');})(),
    activityTemplate: require('../templates/activity.handlebars'),
    Highcharts: require('highcharts'),
    chartConfig: require('./chartConfig'),
    addDataToConfig: require('./addChartDataToChartConfig'),
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
        this.renderChartVisitsToday();
        this.renderChartDevices();
        this.renderChartLandingPages();
        this.renderChartTrafficSources();
    },

    buildPageData: function () {
        var data = this.getData();
        this.bodyData.activeUsers = data[0].values[0].toString();
    },

    renderChartVisitsToday: function () {
        this.renderChart('visits-today--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 1, 0, 1, "column")));
    },

    renderChartDevices: function () {
        this.renderChart('devices--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
    },

    renderChartLandingPages: function () {
        this.renderChart('landing-pages--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 4, 0, 1, "bar")));
    },

    renderChartTrafficSources: function () {
        this.renderChart('traffic-sources--chart', this.addDataToConfig(this.chartConfig, this.buildChartData(this.getData(), 5, 0, 4, "bar")));
    },

    renderChart: function(container, data) {
        this.Highcharts.chart(container, data);
    },

    renderTemplate: function(container) {
        container.innerHTML = this.activityTemplate(this.bodyData);
    }

    // addDataToConfig: function (chartConfig, dataToAdd) {
    //
    //     chartConfig.chart.type = dataToAdd.type ? dataToAdd.type : chartConfig.chart.type;
    //     chartConfig.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.title.text;
    //     chartConfig.series[0].data = dataToAdd.series ? dataToAdd.series : chartConfig.series[0].data;
    //     chartConfig.series[0].name = dataToAdd.title ? dataToAdd.title : chartConfig.series[0].name;
    //     chartConfig.xAxis.categories = dataToAdd.categories ? dataToAdd.categories : chartConfig.xAxis.categories;
    //     chartConfig.yAxis.title.text = dataToAdd.title ? dataToAdd.title : chartConfig.yAxis.title.text;
    //
    //     console.log(chartConfig);
    //     return chartConfig;
    // },

    // buildChartData: function(dimension, categoryColumn, valueColumn, chartType) {
    //
    //     /**
    //      * Build an object of chart properties and data to merge with base chart config
    //      * @param {int} dimension - Index of metric array in data object
    //      * @param {int} categoryColumn - Index of values array in data object where to find category names
    //      * @param {int} valueColumn - Index of values array in data object where to to find the values to plot on chart
    //      * @param {string} chartType - type of chart to render
    //      */
    //
    //     var data = this.getData(),
    //         dataSeries = data[dimension].values,
    //         name = data[dimension].definition.meta.description,
    //         type = chartType,
    //         categories = [],
    //         series = [],
    //         obj = {};
    //
    //     for (var i = 0; i < dataSeries.length; i++ ) {
    //         for (value in dataSeries[i]) {
    //             if (value == categoryColumn) {
    //                 categories.push([dataSeries[i][value]].toString());
    //             } else if (value == valueColumn) {
    //                 series.push(parseInt([dataSeries[i][value]]));
    //             }
    //         }
    //     }
    //
    //     obj.type = type; obj.title = name; obj.categories = categories; obj.series = series;
    //
    //     return obj;
    //
    // }
};



// var Highcharts = require('highcharts');
//
// // Create the chart
// Highcharts.chart('chart--js', {
//     chart: {
//         type: 'bar'
//     },
//     title: {
//         text: 'Fruit Consumption'
//     },
//     xAxis: {
//         categories: ['Apples', 'Bananas', 'Oranges']
//     },
//     yAxis: {
//         title: {
//             text: 'Fruit eaten'
//         }
//     },
//     series: [{
//         name: 'Jane',
//         data: [1, 10, 4]
//     }, {
//         name: 'John',
//         data: [5, 7, 3]
//     }]
// });

module.exports = viewActivity;


// temporary data
var gaJSON = [{"name":"active-users","definition":{"name":"active-users","frequency":"realtime","query":{"metrics":"rt:activeUsers"}},"columns":["rt:activeUsers"],"values":[["246"]]},{"name":"today","definition":{"name":"today","frequency":"hourly","query":{"dimensions":"ga:hour","metrics":"ga:sessions","start-date":"today","end-date":"today"},"meta":{"name":"Today","description":"Today\u0027s visits to the website."}},"columns":["ga:hour","ga:sessions"],"values":[["00","225"],["01","164"],["02","166"],["03","148"],["04","150"],["05","205"],["06","480"],["07","816"],["08","2183"],["09","1820"],["10","2"],["11","0"],["12","0"],["13","0"],["14","0"],["15","0"],["16","0"],["17","0"],["18","0"],["19","0"],["20","0"],["21","0"],["22","0"],["23","0"]]},{"name":"devices","definition":{"name":"devices","frequency":"daily","query":{"dimensions":"ga:deviceCategory","metrics":"ga:sessions","start-date":"90daysAgo","end-date":"yesterday"},"meta":{"name":"Devices","description":"90 days of desktop/mobile/tablet visits for all sites."}},"columns":["ga:deviceCategory","ga:sessions"],"values":[["desktop","1312654"],["mobile","312593"],["tablet","125871"]]},{"name":"top-pages-realtime","definition":{"name":"top-pages-realtime","frequency":"realtime","query":{"dimensions":"rt:pagePath,rt:pageTitle","metrics":"rt:activeUsers","sort":"-rt:activeUsers","max-results":"20"},"meta":{"name":"Top Pages (Live)","description":"The top 20 pages, measured by active onsite users, for all sites."}},"columns":["rt:activeUsers"],"values":[["246"]]},{"name":"top-landing-pages-30-days","definition":{"name":"top-landing-pages-30-days","frequency":"daily","query":{"dimensions":"ga:landingPagePath","metrics":"ga:sessions,ga:pageviews,ga:users,ga:pageviewsPerSession,ga:avgSessionDuration,ga:exits","start-date":"30daysAgo","end-date":"yesterday","sort":"-ga:sessions","max-results":"20"},"meta":{"name":"Top Landing Pages (30 Days)","description":"Last 30 days\u0027 Landing Pages, measured by visits, for all sites."}},"columns":["ga:landingPagePath","ga:sessions","ga:pageviews","ga:users","ga:pageviewsPerSession","ga:avgSessionDuration","ga:exits"],"values":[["/","75457","416175","60946","5.5153928727619705","260.4956200219993","75457"],["/economy/inflationandpriceindices","49592","133244","44061","2.686804323277948","131.8666317147927","49592"],["/census/2011census","9729","43318","9123","4.452461712406208","162.04327268989618","9729"],["/peoplepopulationandcommunity/populationandmigration/populationestimates","6295","24111","5866","3.8301826846703735","220.28594122319302","6295"],["/employmentandlabourmarket/peoplenotinwork/unemployment","5459","16612","5060","3.043048177321854","189.0921414178421","5459"],["/economy/inflationandpriceindices/bulletins/consumerpriceinflation/previousReleases","5018","16429","4645","3.274013551215624","151.54842566759666","5018"],["/peoplepopulationandcommunity/populationandmigration","4974","22587","4760","4.541013268998793","243.7022517088862","4974"],["/economy/grossdomesticproductgdp","4872","15784","4607","3.2397372742200328","210.73132183908046","4872"],["/employmentandlabourmarket/peopleinwork/earningsandworkinghours","4515","14033","4218","3.1080841638981176","176.92248062015503","4515"],["/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/bulletins/nationallifetablesunitedkingdom/2015-09-23","4391","6769","4123","1.5415622864951035","73.83785014803006","4391"],["/timeseriestool","3862","16766","3308","4.341273951320559","245.9694458829622","3862"],["/peoplepopulationandcommunity/birthsdeathsandmarriages/deaths","3605","10788","3381","2.99251040221914","168.2621359223301","3605"],["/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies","3585","8868","3402","2.473640167364017","121.54337517433751","3585"],["/employmentandlabourmarket/peopleinwork/earningsandworkinghours/bulletins/annualsurveyofhoursandearnings/2015provisionalresults","3479","7436","3190","2.137395803391779","151.66772060937052","3479"],["/releasecalendar","3313","14001","1958","4.226079082402657","253.5013582855418","3313"],["/peoplepopulationandcommunity/culturalidentity/ethnicity/articles/ethnicityandnationalidentityinenglandandwales/2012-12-11","3308","5771","3108","1.744558645707376","102.42382103990326","3308"],["/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/bulletins/birthsummarytablesenglandandwales/2015-07-15","3279","6935","3097","2.114974077462641","114.68008539188777","3279"],["/aboutus/careers","3141","4776","2510","1.5205348615090735","88.89175421840179","3141"],["/peoplepopulationandcommunity/populationandmigration/internationalmigration/bulletins/migrationstatisticsquarterlyreport/may2016","2998","5657","2660","1.8869246164109406","117.8955970647098","2998"],["/peoplepopulationandcommunity/crimeandjustice","2984","9470","2771","3.173592493297587","170.81233243967827","2984"]]},{"name":"top-traffic-sources-30-days","definition":{"name":"top-traffic-sources-30-days","frequency":"daily","query":{"dimensions":"ga:source,ga:hasSocialSourceReferral","metrics":"ga:sessions,ga:pageviews,ga:users,ga:pageviewsPerSession,ga:avgSessionDuration,ga:exits","start-date":"30daysAgo","end-date":"yesterday","sort":"-ga:sessions","max-results":"20"},"meta":{"name":"Top Traffic Sources (30 Days)","description":"Last 30 days\u0027 Traffic Sources, measured by visits, for all sites."}},"columns":["ga:source","ga:hasSocialSourceReferral","ga:sessions","ga:pageviews","ga:users","ga:pageviewsPerSession","ga:avgSessionDuration","ga:exits"],"values":[["google","No","314570","1074762","232396","3.4166067965794578","207.32518676288265","313209"],["(direct)","No","92356","263147","77347","2.849268049720646","127.24171683485642","92078"],["bing","No","32837","117033","22695","3.5640588360690684","177.2113165027256","32679"],["t.co","Yes","5755","10233","4283","1.7781059947871416","73.07471763683753","5734"],["yahoo","No","5075","13178","4339","2.5966502463054186","136.25142857142856","5066"],["bbc.co.uk","No","4930","9402","4322","1.9070993914807302","92.35841784989859","4897"],["theguardian.com","No","2665","4962","2351","1.8619136960600375","95.99662288930581","2648"],["gov.uk","No","2432","8484","1683","3.4884868421052633","209.90995065789474","2417"],["links.govdelivery.com","No","2173","5754","1445","2.6479521398987576","143.53934652554074","2157"],["telegraph.co.uk","No","1702","2549","1622","1.4976498237367804","32.290246768507636","1701"],["neighbourhood.statistics.gov.uk","No","1577","5842","1115","3.7045022194039317","184.36461636017756","1569"],["crimesurvey.co.uk","No","1443","4909","1115","3.401940401940402","221.86832986832988","1435"],["forexfactory.com","No","1438","3038","1033","2.112656467315716","135.8212795549374","1421"],["m.facebook.com","Yes","1391","1730","1332","1.2437095614665707","30.485981308411215","1390"],["en.wikipedia.org","No","1124","3641","987","3.2393238434163703","142.99288256227757","1120"],["uk.search.yahoo.com","No","960","3038","811","3.1645833333333333","172.575","959"],["bbc.com","No","811","1429","728","1.7620221948212085","74.79778051787916","810"],["gov.scot","No","753","3346","559","4.443559096945551","179.49269588313413","748"],["duckduckgo.com","No","751","2550","610","3.395472703062583","207.07723035952063","749"],["facebook.com","Yes","719","1325","605","1.842837273991655","90.65368567454799","713"]]}];
