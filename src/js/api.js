/** Fetch data from JSON file **/

/* Third party JS */
var xhr = require('../../node_modules/xhr/index');
var store = require('./state');
var watch = require('./watchState');

/* Register web worker */
if (window.Worker) {
    var worker = new Worker("worker.js");
}

/* Functions to access dataSources from JSON file */
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
            // Update state with newly received data from web worker
            worker.onmessage = function (event) {
                var dispatchType = "";

                switch (event.data.title) {
                    case ("responseTimes"): {
                        dispatchType = "RECEIVED_RESPONSE_DATA";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                store.dispatch({
                    type: dispatchType,
                    data: event.data.data
                });
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

            // Tell web worker where to get dataSources from
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
};

// Export this object so that the api functions can be used across app
module.exports = api;
