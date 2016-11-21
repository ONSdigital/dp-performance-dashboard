/** Fetch data from JSON file **/

/* Third party JS */
var xhr = require('../../node_modules/xhr/index');
var store = require('./state');
var stringConvert = require('./stringConvert');
var watch = require('./watchState');

/* Register web worker */
if (window.Worker) {
    var worker = new Worker("worker.js");
}

/* Functions to access data from JSON file */
var api = {

    requestData: function (uri, success) {
        xhr({
            uri: uri
        }, function (err, response, body) {
            if (err) {
                throw err;
            }
            success(body)
        });
    },

    subscribeToDataUpdates: function () {
        if (worker) {
            worker.onmessage = function (event) {

                // Update state with new data
                if (event.data.title == "webTraffic") {
                    store.dispatch({
                        type: "RECEIVED_TRAFFIC_DATA",
                        data: event.data.data
                    })
                } else if (event.data.title == "responseTimes") {
                    store.dispatch({
                        type: "RECEIVED_RESPONSE_DATA",
                        data: event.data.data
                    })
                } else if (event.data.title == "requestAndPublishTimes") {
                    store.dispatch({
                        type: "RECEIVED_REQUEST_PUBLISH_DATA",
                        data: event.data.data
                    })
                }
            }
        } else {
            this.nonWebWorkerRequest();
        }
    },

    subscribeToEnvironmentVariable: function() {
        var environmentSet = false;

        function onChange(newEnvironment) {

            // Only allow environment to be set once
            if (environmentSet) {
                return false;
            }

            // Tell web worker where to get data from
            if (worker) {
                switch (newEnvironment) {
                    case 'production': {
                        worker.postMessage('USE_LOCAL_DATA');
                        break;
                    }
                    case 'develop': {
                        worker.postMessage('USE_REMOTE_DATA');
                        break;
                    }
                    default: {
                        worker.postMessage('USE_LOCAL_DATA');
                        break;
                    }
                }

                environmentSet = true;

            }
        }

        watch('environment', onChange);
    },

    nonWebWorkerRequest: function() {
        var data = [
            {
                title: 'webTraffic',
                uri: 'analytics.json',
                data: {}
            },
            {
                title: 'responseTimes',
                uri: 'responsetimes.json',
                data: {}
            },
            {
                title: 'requestAndPublishTimes',
                uri: 'metrics.json',
                data: {}
            }
        ],
        dataLength = data.length;

        for (var i = 0; i < dataLength; i++) {
            (function(i) {
                api.requestData(data[i].uri, function(response) {
                    switch (data[i].title) {
                        case 'webTraffic': {
                            store.dispatch({
                                type: "RECEIVED_TRAFFIC_DATA",
                                data: JSON.parse(response)
                            });
                            break;
                        }
                        case 'responseTimes': {
                            store.dispatch({
                                type: "RECEIVED_RESPONSE_DATA",
                                data: JSON.parse(response)
                            });
                            break;
                        }
                        case 'requestAndPublishTimes': {
                            store.dispatch({
                                type: "RECEIVED_REQUEST_PUBLISH_DATA",
                                data: JSON.parse(response)
                            });
                            break;
                        }
                    }
                });
            })(i);
        }


    }
};

// Export this object so that the api functions can be used across app
module.exports = api;
