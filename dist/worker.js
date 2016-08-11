/** Worker for updating data in the background **/

// Simple XHR wrapper - https://gist.github.com/sindresorhus/1583375
// var xhr = function() {
//     var xhr = new XMLHttpRequest();
//     return function( method, url, callback ) {
//         xhr.onreadystatechange = function() {
//             if ( xhr.readyState === 4 ) {
//                 callback( xhr.responseText );
//             }
//         };
//         xhr.open( method, url );
//         xhr.send();
//     };
// }();

// Object that will later be messaged back to client
var data = [
    {
        title: 'activity',
        uri: 'https://s3-eu-west-1.amazonaws.com/ons-metrics/analytics.json',
        updateTime: '',
        data: {}
    },
    {
        title: 'serviceStatus',
        uri: 'https://s3-eu-west-1.amazonaws.com/ons-metrics/responsetimes.json',
        updateTime: '',
        data: {}
    }
];

// Our function that requests data from API
function getData() {
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

getData();
setInterval(getData, 30000);

// var xhrInProgress = false,
//     dataInitialised = false;
//
// // Our function that requests data from API
// function getData(success) {
//     var dataLength = data.length,
//         loopCount = 0;
//
//     xhrInProgress = true;
//
//     // Loop through data and get data for each object
//     for (var i = 0; i < dataLength; i++) {
//         (function(index) {
//
//             // New instance of http request to get data
//             var xhr = new XMLHttpRequest();
//             xhr.onreadystatechange = function() {
//                 if ( xhr.readyState === 4 ) {
//
//                     // Store data into global array
//                     var date = new Date();
//                     data[index].data = JSON.parse(xhr.responseText);
//                     data[index].updateTime = date.toISOString();
//
//                     // Callback for when response is needed instantly and isn't just going into memory for use later
//                     if (success) {
//                         success();
//                     }
//
//                     xhrInProgress = false;
//                     loopCount++;
//                     if (loopCount == dataLength) {
//                         console.log(loopCount);
//                         dataInitialised = true;
//                     }
//                 }
//             };
//             xhr.open( 'get', data[index].uri );
//             xhr.send();
//         })(i);
//     }
//
// }
//
// // Set up interval to poll the API every minute for new data
// setInterval(getData, 60000);
//
// // Handle messages sent to worker from client
// onmessage = function(event) {
//     console.log('Request to worker: "' + event.data + '"');
//
//     // If a request is already in progress stop the new request from firing
//     if (xhrInProgress) {
//         return;
//     }
//
//     // TODO on initial load run functions again if data hasn't come back yet
//
//     switch (event.data) {
//         case "INITIALISE_DATA": {
//             // Initial function to request traffic data from API on first load. Then it'll be taken from memory
//             getData(function() {
//                 data.type = 'RETURN_INITIAL_DATA';
//                 postMessage(data)
//             });
//             break;
//         }
//         case "GET_TRAFFIC_DATA": {
//             // Take latest traffic data that is in memory
//             data[0].type = "RETURN_TRAFFIC_DATA";
//             postMessage(data[0].data);
//             break;
//         }
//         case "GET_TECHNICAL_DATA": {
//             data[1].type = "RETURN_TECHNICAL_DATA";
//             postMessage(data[1].data);
//             break;
//         }
//     }
// };
