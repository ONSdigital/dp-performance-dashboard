/** Fetch data from JSON file **/

/* Third party JS */
var xhr = require('../../node_modules/xhr/index');
var store = require('./state');

/* Register web worker */
var worker = new Worker("worker.js");

/* Action functions */
function requestData(dataSrc) {
    return {
        type: 'REQUEST_' + dataSrc + '_DATA'
    }
}
function receivedData(dataSrc, data) {
    return {
        type: 'RECEIVED_' + dataSrc + '_DATA',
        data: data
    }
}

/* Functions to access data from JSON file */
var api = {
    "requestData": function(success) {
        xhr({
            uri: "https://s3-eu-west-1.amazonaws.com/ons-metrics/responsetimes.json"
        }, function(err, response, body) {
            if (err) {
                throw err;
            }
            success(body)
        })
    },
    'getTrafficData': function() {
        if (window.Worker) {
            worker.postMessage('GET_TRAFFIC_DATA');
            store.dispatch(requestData('TRAFFIC'));
            worker.onmessage = function(event) {
                store.dispatch(receivedData('TRAFFIC', event.data.data));
            }
        } else {
            api.requestData(function(response) {
                success('Update state with: ', JSON.parse(response));
            });
        }
    },
    'getTechnicalData': function() {
        if (window.Worker) {
            worker.postMessage('GET_TECHNICAL_DATA');
            store.dispatch(requestData('TECHNICAL'));
            worker.onmessage = function(event) {
                store.dispatch(receivedData('TECHNICAL', event.data.data));
            }
        } else {
            api.requestData(function(response) {
                success('Update state with: ', JSON.parse(response));
            });
        }
    },
    'initialiseData': function() {
        if (window.Worker) {
            worker.postMessage('INITIALISE_DATA');
            worker.onmessage = function(event) {
                // TODO Probably should put this in the store but useful at the moment to see state changes
                console.log(event.data);
            }
        } else {
            api.requestData(function(response) {
                console.log('Update state with: ', JSON.parse(response));
            });
        }
    }
};

/* Subscribe to store and listen for updates to view that require API calls */
store.subscribe(function() {
    var currentState = store.getState();
    if (currentState.viewChange == 'IN_PROGRESS' && currentState.requestApiCall && currentState.activeView == 'traffic') {
        api.getTrafficData();
    } else if (currentState.viewChange == 'IN_PROGRESS' && currentState.requestApiCall && currentState.activeView == 'technical') {
        api.getTechnicalData();
    }
});

// Export this object so that the api functions can be used across app
module.exports = api;
