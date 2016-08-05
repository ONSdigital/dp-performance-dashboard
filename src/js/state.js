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

    // console.log("Previous state:", state);

    switch (action.type) {
        case 'REQUEST_TRAFFIC_DATA': {
            updatedState.traffic.status = 'IN_PROGRESS';
            updatedState.requestApiCall = false;
            break;
        }
        case 'RECEIVED_TRAFFIC_DATA': {
            updatedState.traffic.status = 'RECEIVED';
            updatedState.traffic.data = action.data;
            break;
        }
        case 'REQUEST_TECHNICAL_DATA': {
            updatedState.technical.status = 'IN_PROGRESS';
            updatedState.requestApiCall = false;
            break;
        }
        case 'RECEIVED_TECHNICAL_DATA': {
            updatedState.technical.status = 'RECEIVED';
            updatedState.technical.data = action.data;
            break;
        }
        case 'UPDATE_TRAFFIC': {
            updatedState.traffic = action.traffic;
            break;
        }
        case 'UPDATE_TECHNICAL': {
            updatedState.technical = action.technical;
            break;
        }
        case 'REQUEST_VIEW': {
            updatedState.activeView = action.view;
            updatedState.viewChange = 'IN_PROGRESS';
            updatedState.requestApiCall = true;
            break;
        }
        case 'UPDATED_VIEW': {
            updatedState.viewChange = initialState.viewChange;
        }
        default: {
            // console.log('No action type given');
        }
    }


    // console.log('ACTION: ', action);
    // console.log('OLD STATE: ', state);
    // console.log('NEW STATE: ', updatedState);
    // console.log('--------');

    return updatedState
}

var createStore = Redux.createStore,
    initialState = {
        activeView: 'traffic',
        viewChange: '',
        requestApiCall: false,
        traffic: {},
        technical: {}
    },
    store = createStore(dashboard);

// Export state module for app to use
module.exports = store;
