
// get the uri hash for routing
var uriHash = window.location.hash ? window.location.hash.substring(1) : false;

require('./js/api.js');
require('../node_modules/redux/dist/redux.min');
var view = require('./js/views');

view.init(uriHash);