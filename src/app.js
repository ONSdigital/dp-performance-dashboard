/** Configuration file for application */

var view = require('./js/views'),
    api = require('./js/api'),
    setEnvironment = require('./js/setEnvironment');


// app specific style sheet
require('./scss/app.scss');

// get the uri hash for routing
var uriHash = window.location.hash ? window.location.hash.substring(1) : false;

// get any parameters
var uriParams = window.location.search ? window.location.search.replace('?', '') : false;

// get environment variable
var environment = process.env.ENV;


/* Initialise app */

// Set environment and get either remote or local data sources depending on environment
setEnvironment(environment);
api.subscribeToEnvironmentVariable();

// Start api subscription to state and initialise view
api.subscribeToDataUpdates();
view.init(uriHash, uriParams);