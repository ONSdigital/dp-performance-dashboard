/** Configuration file for application */

// get the uri hash for routing
var uriHash = window.location.hash ? window.location.hash.substring(1) : false;

var view = require('./js/views'),
    api = require('./js/api');

/* Initialise app */
api.subscribeToDataUpdates();
view.init(uriHash);
