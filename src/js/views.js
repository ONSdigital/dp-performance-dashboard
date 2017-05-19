var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewTabs: require('./viewTabs'),
    viewWebTraffic: require('./viewWebTraffic'),
    viewResponseTimes: require('./viewResponseTimes'),
    viewRequestAndPublishTimes: require('./viewRequestAndPublish'),
    viewPublishTimes: require('./viewPublishTimes'),
    viewRequestTimes: require('./viewRequestTimes'),
    viewMonthlyVisits: require('./viewMonthlyVisits'),
    main: document.getElementById('main'),
    store: require('./state'),
    stringConvert: require('./stringConvert'),
    watch: require('./watchState'),

    // remove uriHash arg - get from state store
    init: function(uriHash, uriParams) {
        this.renderBase();
        this.handleParams(uriParams);

        this.updateOnStateChanges();
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
        var container = document.getElementById(id + '__container');
        switch (id) {
            case "ons-website":
                this.viewWebTraffic.renderView(container);
                break;
            case "response-times":
                this.viewResponseTimes.renderView(container);
                break;
            case "request-publish-times":
                this.viewRequestAndPublishTimes.renderView(container);
                break;
            case "request-times":
                this.viewRequestTimes.renderView(container);
                break;
            case "publish-times":
                // this.viewPublishTimes.renderView(container);
                break;
            case "monthly-visits":
                this.viewMonthlyVisits.renderView(container);
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
        }

        // Enable state logging out in console
        this.store.dispatch({
            type: 'ENABLE_STATE_LOGGING'
        });
    },

    changeView: function(uriHash) {
        var activeView = uriHash ? uriHash : "ons-website";

        this.store.dispatch({
            type: 'REQUEST_VIEW',
            view: activeView
        });
    },

    updateOnStateChanges: function() {
        this.watchActiveView();
        this.watchWebTrafficData();
        this.watchResponseTimesData();
        this.watchRequestTimes();
        this.watchPublishTimes();
        this.watchRequestAndPublishData();
        this.watchMonthlyVisitsData();
    },

    watchActiveView: function() {
        this.watch('activeView', function(newView) {
            view.renderTabs();
            view.toggleViewVisibility(newView);
        });
    },

    watchWebTrafficData: function() {
        this.watch('webTraffic.data', function() {
            view.renderContent('ons-website');
        });
    },

    watchResponseTimesData: function() {
        this.watch('responseTimes.data', function() {
            view.renderContent('response-times');
        });
    },

    watchRequestTimes: function() {
        this.watch('requestTimes.data', function() {
            //TODO add request times renderer
        });
    },

    watchPublishTimes: function() {
        this.watch('publishTimes.data', function() {
            view.renderContent('publish-times');
        });
    },

    watchRequestAndPublishData: function() {
        this.watch('requestAndPublishTimes.data', function() {
            view.renderContent('request-publish-times');
        });
    },

    watchMonthlyVisitsData: function() {
        this.watch('webTraffic.data', function() {
            view.renderContent('monthly-visits');
        });
    }


};

module.exports = view;