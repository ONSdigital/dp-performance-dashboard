/** State management - Redux **/

/* Import third-party JS */
var Redux = require('../../node_modules/redux/dist/redux.min.js');

function dashboard(state, action) {
    // Set initial state
    if (state === undefined) {
        state = initialState;
    }

    // Parse to string, clone and parse back to object to keep original state immutable
    var stateStr = JSON.stringify(state),
        updatedState = JSON.parse(stateStr);

    // Reducer switch function, updates the state as necessary
    switch (action.type) {
        case 'RECEIVED_TRAFFIC_DATA': {
            updatedState.webTraffic.data = action.data;
            break;
        }
        case 'RECEIVED_RESPONSE_DATA': {
            updatedState.responseTimes.data = action.data;
            break;
        }
        case 'RECEIVED_REQUEST_PUBLISH_DATA': {
            updatedState.requestAndPublishTimes.data = action.data;
            break;
        }
        case 'INITIALISE_VIEW': {
            updatedState.activeView = action.view;
            break;
        }
        case 'REQUEST_VIEW': {
            updatedState.activeView = action.view;
            break;
        }
        case 'ENABLE_STATE_LOGGING': {
            updatedState.enableStateLogging = true;
            break;
        }
        case 'UPDATE_ENVIRONMENT_VAR': {
            updatedState.environment = action.env;
            break;
        }
        default: {
            // console.log('No state action type given');
            break;
        }
    }

    if (updatedState.enableStateLogging) {
        console.log('ACTION: ', action);
        console.log('OLD STATE: ', state);
        console.log('NEW STATE: ', updatedState);
        console.log('--------');
    }

    return updatedState
}

var createStore = Redux.createStore,
    initialState = {
        activeView: '',
        pendingViewUpdate: false,
        enableStateLogging: false,
        environment: '',
        webTraffic: {},
        responseTimes: {},
        requestAndPublishTimes: {}
    },
    store = createStore(dashboard);

// Export state module for app to use
module.exports = store;
