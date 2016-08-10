/** Worker for updating data in the background **/

// Simple XHR wrapper - https://gist.github.com/sindresorhus/1583375
var xhr = function() {
    var xhr = new XMLHttpRequest();
    return function( method, url, callback ) {
        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4 ) {
                callback( xhr.responseText );
            }
        };
        xhr.open( method, url );
        xhr.send();
    };
}();

// Object that will later be messaged back to client
var newData = {
    type: '',
    updateTime: '',
    data: {}
};

// Our function that requests data from API
function getTrafficData(success) {
    xhr('get', 'https://s3-eu-west-1.amazonaws.com/ons-metrics/responsetimes.json', function(response) {
        var date = new Date();
        newData.updateTime = date.toISOString();
        newData.data = JSON.parse(response);

        // Callback for when response is needed instantly and isn't just going into memory for use later
        if (success) {
            success();
        }
    });
}

// Set up interval to poll the API every minute for new data
setInterval(getTrafficData, 60000);

// Handle messages sent to worker from client
onmessage = function(event) {
    console.log('Request to worker: "' + event.data + '"');

    switch (event.data) {
        case "INITIALISE_DATA": {
            // Initial function to request traffic data from API on first load. Then it'll be taken from memory
            getTrafficData(function() {
                newData.type = 'RETURN_INITIAL_DATA';
                postMessage(newData)
            });
            break;
        }
        case "GET_TRAFFIC_DATA": {
            // Take latest traffic data that is in memory
            newData.type = "RETURN_TRAFFIC_DATA";
            postMessage(newData);
            break;
        }
        case "GET_TECHNICAL_DATA": {
            // TODO this should get technical data not traffic - only one data object at the moment
            newData.type = "RETURN_TECHNICAL_DATA";
            postMessage(newData);
            break;
        }
    }
};
