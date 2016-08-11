/** Fetch data from JSON file **/

/* Third party JS */
var xhr = require('../../node_modules/xhr/index');
var store = require('./state');
var stringConvert = require('./stringConvert');

/* Register web worker */
var worker = new Worker("worker.js");

/* Functions to access data from JSON file */
var api = {
    requestData: function (success) {
        // TODO need to use this as a back-up for browsers without web workers (IE8)
        xhr({
            uri: "https://s3-eu-west-1.amazonaws.com/ons-metrics/responsetimes.json"
        }, function (err, response, body) {
            if (err) {
                throw err;
            }
            success(body)
        });
    },
    subscribeToDataUpdates: function () {
        if (window.Worker) {
            worker.onmessage = function (event) {
                var currentState = store.getState();

                // Update state with new data
                if (event.data.title == "activity") {
                    store.dispatch({
                        type: "RECEIVED_ACTIVITY_DATA",
                        data: event.data.data
                    })
                } else if (event.data.title == "serviceStatus") {
                    store.dispatch({
                        type: "RECEIVED_SERVICE_STATUS_DATA",
                        data: event.data.data
                    })
                }

                // Request that active view to re-render
                if (event.data.title == stringConvert.toCamelCase(currentState.activeView)) {
                    store.dispatch({
                        type: "REQUEST_VIEW",
                        view: currentState.activeView
                    })
                }
            }
        } else {
            console.log('Web workers not supported');
        }
    }
}

// Export this object so that the api functions can be used across app
module.exports = api;
