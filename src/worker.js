/** Worker for updating data in the background **/

// Object that will later be messaged back to client
var dataArray = [
    {
        title: 'activity',
        uri: 'analytics.json',
        updateTime: '',
        data: {}
    },
    {
        title: 'serviceStatus',
        uri: 'responsetimes.json',
        updateTime: '',
        data: {}
    }
];

// Listen for message to switch to remote data sources
onmessage = function(event) {

    switch (event.data) {
        case "USE_REMOTE_DATA": {
            var array = [],
                dataLength = dataArray.length,
                i;

            for (i = 0; i < dataLength; i++) {
                array.push({});
                array[i].title = dataArray[i].title;
                array[i].uri = 'https://performance.develop.onsdigital.co.uk/' + dataArray[i].uri;
            }

            getData(array);
            break;
        }
        case "USE_LOCAL_DATA": {
            getData(dataArray);
            break;
        }
        default: {
            console.log('No message contents given to worker');
        }
    }
};

// Our function that requests data from API
function getData(data) {
    var dataLength = data.length;

    // Loop through data and get data for each object
    for (var i = 0; i < dataLength; i++) {
        (function(index) {

            // New instance of http request to get data
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ) {

                    // Store data into global array
                    var date = new Date();
                    data[index].data = JSON.parse(xhr.responseText);
                    data[index].updateTime = date.toISOString();

                    // Post message with updated object back to client
                    postMessage({title: data[index].title, data: data[index].data});
                }
            };
            xhr.open( 'get', data[index].uri );
            xhr.send();
        })(i);
    }

}

setInterval(getData, 300000);
