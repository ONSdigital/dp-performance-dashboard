/** Worker for updating data in the background **/

// All sources to request data from
var dataSources = [
    {
        title: 'webTraffic',
        uri: 'analytics.json'
    },
    {
        title: 'responseTimes',
        uri: 'responsetimes.json'
    },
    {
        title: 'requestAndPublishTimes',
        uri: 'metrics.json'
    }
];

// Listen for message to switch to remote dataSources sources
onmessage = function(event) {

    switch (event.data) {
        case "USE_REMOTE_DATA": {
            var dataLength = dataSources.length,
                i;

            for (i = 0; i < dataLength; i++) {
                dataSources[i].uri = 'https://performance.ons.gov.uk/' + dataSources[i].uri;
            }

            getData();
            break;
        }
        case "USE_LOCAL_DATA": {
            getData();
            break;
        }
        default: {
            console.log('No message contents given to worker');
        }
    }
};

// Our function that requests data from API
function getData() {

    var dataLength = dataSources.length;

    // Loop through data sources and get data for each one
    for (var i = 0; i < dataLength; i++) {
        (function(index) {

            // New instance of http request to get dataSources
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ) {

                    if (dataSources[index].title === "requestAndPublishTimes") {
                        // Break up this response into separate messages back to client

                        var requestData = JSON.parse(xhr.responseText),
                            publishData = requestData.splice([requestData.length-1], 1);

                        postMessage({title: "requestTimes", data: requestData});
                        postMessage({title: "publishTimes", data: publishData});

                    } else {

                        var dataObject = {
                            title: '',
                            updateTime: '',
                            data: {}
                        };

                        dataObject.data = JSON.parse(xhr.responseText);

                        // Post message with updated object back to client
                        postMessage({title: dataSources[index].title, data: dataObject.data});
                    }
                }
            };
            xhr.open( 'get', dataSources[index].uri );
            xhr.send();
        })(i);
    }

}

setInterval(getData, 300000);
// setInterval(getData, 5000);
