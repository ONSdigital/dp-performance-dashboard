var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewTabs: require('./viewTabs'),
    viewActivity: require('./viewActivity'),
    viewServiceStatus: require('./viewServiceStatus'),
    main: document.getElementById('main'),
    baseData: {title: "Title thingy"},
    store: require('./state'),
    stringConvert: require('./stringConvert'),

    // remove uriHash arg - get from state store
    init: function(uriHash, uriParams) {
        this.renderBase();
        this.handleParams(uriParams);
        this.subscribeToStateChange();
        this.changeView(uriHash);
        this.bindClickEvents();
    },

    renderBase: function() {
        this.main.innerHTML = this.baseTemplate(this.baseData);
        this.renderTabs();
    },

    bindClickEvents: function() {
        var tabLinks = document.getElementsByClassName('js-tab');

        for(var i =0 ; i < tabLinks.length; i++) {
            tabLinks[i].addEventListener("click", this.handleTabClick, false);
        }
    },

    handleTabClick: function() {
        var href = this.getAttribute("href").substring(1);
        view.changeView(href);
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

    renderContent: function(uriHash) {
        // some simple routing
        // var content = document.getElementById('content');
        var content = document.getElementById(uriHash + '-section');
        switch (uriHash) {
            case "service-status":
                view.store.dispatch({
                    type: 'UPDATED_SERVICE_STATUS_VIEW'
                });
                this.viewServiceStatus.renderView(content);
                break;
            case "activity":
                view.store.dispatch({
                    type: 'UPDATED_ACTIVITY_VIEW'
                });
                this.viewActivity.renderView(content);
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
                view.bindClickEvents();

                view.store.dispatch({
                    type: 'UPDATED_VIEW'
                });

                view.toggleViewVisibility(currentState.activeView);
            }

            // Render section when new data has arrived for it
            if (currentState.activity.isNewData) {
                view.renderContent('activity');
            } else if (currentState.serviceStatus.isNewData) {
                view.renderContent('service-status');
            }
        });
    }

};

module.exports = view;