
var store = require('./state');

function setEnvironment(environment) {
    store.dispatch({
        type: "UPDATE_ENVIRONMENT_VAR",
        env: environment
    });
}

module.exports = setEnvironment;