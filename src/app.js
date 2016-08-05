/** Configuration file for application */


/* Import other JS files */
var api = require('./js/api'),
    store = require('./js/state');
require('./js/views');


/* Initialise data */
api.initialiseData();

/* Subscribe to state changes */
store.subscribe(function() {
    // console.log("State update: ", store.getState());
});



/* Throw away view JS for testing API/state JS */
var dataBtn = document.getElementById('latest-data');
dataBtn.addEventListener('click', function() {
    api.getTrafficData();
});

var viewBtn = document.getElementById('toggle-active');
viewBtn.addEventListener('click', function() {
    var currentState = store.getState(),
        toggledView;

    if (currentState.activeView == 'traffic') {
        toggledView = 'technical'
    } else if (currentState.activeView == 'technical') {
        toggledView = 'traffic'
    } else {
        toggledView = 'traffic'
    }

    store.dispatch({
        type: 'REQUEST_VIEW',
        view: toggledView
    })
});

// Listen for changes to view and renders view with newly received data
store.subscribe(function() {
    var currentState = store.getState(),
        activeView = currentState.activeView,
        viewElement = document.getElementById('active-view');

    if (currentState[activeView].status == 'RECEIVED' && currentState.viewChange == 'IN_PROGRESS') {
        store.dispatch({
            type: 'UPDATED_VIEW'
        });
        viewElement.innerHTML = activeView;
    }
});
