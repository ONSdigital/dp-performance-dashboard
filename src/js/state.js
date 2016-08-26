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
        case 'RECEIVED_ACTIVITY_DATA': {
            updatedState.activity.data = action.data;
            updatedState.activity.isNewData = true;
            break;
        }
        case 'RECEIVED_RESPONSE_DATA': {
            updatedState.responseTimes.data = action.data;
            updatedState.responseTimes.isNewData = true;
            break;
        }
        case 'RECEIVED_REQUEST_PUBLISH_DATA': {
            updatedState.requestAndPublishTimes.data = action.data;
            updatedState.requestAndPublishTimes.isNewData = true;
            break;
        }
        case 'UPDATED_RESPONSE_VIEW': {
            updatedState.responseTimes.isNewData = false;
            break;
        }
        case 'UPDATED_ACTIVITY_VIEW': {
            updatedState.activity.isNewData = false;
            break;
        }
        case 'UPDATED_REQUEST_PUBLISH_VIEW': {
            updatedState.requestAndPublishTimes.isNewData = false;
            break;
        }
        case 'INITIALISE_VIEW': {
            updatedState.activeView = action.view;
            break;
        }
        case 'REQUEST_VIEW': {
            updatedState.activeView = action.view;
            updatedState.pendingViewUpdate = true;
            break;
        }
        case 'UPDATED_VIEW': {
            updatedState.pendingViewUpdate = false;
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
        activity: {},
        responseTimes: {},
        requestAndPublishTimes: {}
    },
    store = createStore(dashboard);

// Export state module for app to use
module.exports = store;
