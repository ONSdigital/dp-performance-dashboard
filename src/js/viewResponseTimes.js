
var viewServiceStatus = {

    responseTimesTemplate: require('../templates/response-times.handlebars'),
    bodyData: {},
    store: require('./state'),

    getData: function() {
        // Get latest activity dataSources from state
        var currentState = this.store.getState();
        return currentState.responseTimes.data;
    },


    renderView: function (container) {
        this.buildPageData();
        this.renderTemplate(container);

    },

    buildPageData: function () {
        var data = this.getData();
        var items = ["average-1-day", "average-7-days", "average-30-days"];
        this.bodyData.averageResponseTimes = [];
        for (var i = 0; i < items.length; i++) {
            var responseTimeData = {
                'name': data[items[i]].definition.meta.name,
                'description': data[items[i]].definition.meta.description,
                'responseTime': parseInt(data[items[i]].values[0][2]).toFixed(0),
                'timeUp': data[items[i]].values[0][3],
                'timeDown': data[items[i]].values[0][4],
                'percentageTimeUp': data[items[i]].values[0][6],
                'percentageTimeDown': data[items[i]].values[0][7]
            };
            this.bodyData.averageResponseTimes.push(responseTimeData);
        }

    },

    renderTemplate: function(container) {
        container.innerHTML = this.responseTimesTemplate(this.bodyData);
    }
};

module.exports = viewServiceStatus;