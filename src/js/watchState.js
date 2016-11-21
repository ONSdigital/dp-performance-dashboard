/**
 * Observes Redux state and runs function when specific part of state in updated
 *
 * @param stateProperty - a string of the selector for the property being observed in stave (eg 'workspace.editorData')
 * @param onChange - a function that is run when selected property in state in updated to new value (which is passed back with the old value as an argument in onChange)
 *
 * @returns unsubscribe function - stops this observation of the state
 */

var state = require('./state'),
    getValue = require('object-path').get;

var watchState = function(stateProperty, onChange) {

    // console.log("Registered state observation for '" + stateProperty + "'");

    var currentValue;

    function handleChange() {
        var previousValue = currentValue;
        currentValue = getValue(state.getState(), stateProperty);

        if (JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
            onChange(currentValue, previousValue);
            // console.log(stateProperty + ' changed from "',previousValue,'" to "',currentValue,'"');
        }
    }

    return state.subscribe(handleChange);
};

module.exports = watchState;
