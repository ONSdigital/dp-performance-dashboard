var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewTabs: require('./viewTabs'),
    viewActivity: require('./viewActivity'),
    viewResponseTimes: require('./viewResponseTimes'),
    viewRequestAndPublishTimes: require('./viewRequestAndPublish'),
    main: document.getElementById('main'),
    store: require('./state'),
    stringConvert: require('./stringConvert'),

    // remove uriHash arg - get from state store
    init: function(uriHash, uriParams) {
        this.renderBase();
        this.handleParams(uriParams);
        this.subscribeToStateChange();
        this.changeView(uriHash);
        this.handleHashChangeEvents();
    },

    renderBase: function() {
        this.main.innerHTML = this.baseTemplate();
        this.renderTabs();
    },

    handleHashChangeEvents: function() {
        window.addEventListener('hashchange', function() {
            view.changeView(location.hash.replace('#', ''));
        }, false)

    },

    toggleViewVisibility: function(activeView) {
        var sections = document.getElementsByClassName('section'),
            sectionsLength = sections.length,
            i;

        for (i = 0; i < sectionsLength; i++) {
            if (sections[i].getAttribute('id') != activeView + '-section') {
                sections[i].style.display = 'none';
                sections[i].setAttribute('aria-hidden', true);
            } else {
                sections[i].style.display = 'block';
                sections[i].setAttribute('aria-hidden', false);
            }
        }

    },

    renderContent: function(id) {
        // some simple routing
        // var content = document.getElementById('content');
        var container = document.getElementById(id + '__container');
        switch (id) {
            case "activity":
                view.store.dispatch({
                    type: 'UPDATED_ACTIVITY_VIEW'
                });
                this.viewActivity.renderView(container);
                break;
            case "response-times":
                view.store.dispatch({
                    type: 'UPDATED_RESPONSE_VIEW'
                });
                this.viewResponseTimes.renderView(container);
                break;
            case "request-publish-times":
                view.store.dispatch({
                    type: 'UPDATED_REQUEST_PUBLISH_VIEW'
                });
                this.viewRequestAndPublishTimes.renderView(container);
                break;
            default:
                console.log('No matching hash provided');
        }
    },

    renderTabs: function() {
        var tabs = document.getElementById('tabs--js');
        view.viewTabs.renderView(tabs);
    },

    handleParams: function(uriParams) {
        if (!uriParams) {
            return
        } else if (uriParams == "stateLogging") {
            // Enable state logging out in console
            this.store.dispatch({
                type: 'ENABLE_STATE_LOGGING'
            });
        }
    },

    changeView: function(uriHash) {
        var activeView = uriHash ? uriHash : "activity";

        this.store.dispatch({
            type: 'REQUEST_VIEW',
            view: activeView
        });
    },

    subscribeToStateChange: function() {
        this.store.subscribe(function() {
            var currentState = view.store.getState();

            // Toggle view display to active view
            if (currentState.pendingViewUpdate) {
                view.renderTabs();

                view.store.dispatch({
                    type: 'UPDATED_VIEW'
                });

                view.toggleViewVisibility(currentState.activeView);
            }

            // Render section when new data has arrived for it
            if (currentState.activity.isNewData) {
                view.renderContent('activity');
            } else if (currentState.responseTimes.isNewData) {
                view.renderContent('response-times');
            } else if (currentState.requestAndPublishTimes.isNewData) {
                view.renderContent('request-publish-times');
            }
        });
    }

};

module.exports = view;