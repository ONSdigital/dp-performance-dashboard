/** Configuration file for application */

var view = require('./js/views'),
    api = require('./js/api'),
    stringConvert = require('./js/stringConvert');

// get the uri hash for routing
var uriHash = window.location.hash ? window.location.hash.substring(1) : false;

// get any parameters
var uriParams = window.location.search ? window.location.search.replace('?', '') : false;

/* Initialise app */
api.subscribeToDataUpdates();
view.init(uriHash, uriParams);
