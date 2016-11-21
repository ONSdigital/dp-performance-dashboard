var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewTabs: require('./viewTabs'),
    viewWebTraffic: require('./viewWebTraffic'),
    viewResponseTimes: require('./viewResponseTimes'),
    viewRequestAndPublishTimes: require('./viewRequestAndPublish'),
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
            case "web-traffic":
                this.viewWebTraffic.renderView(container);
                break;
            case "response-times":
                this.viewResponseTimes.renderView(container);
                break;
            case "request-publish-times":
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
        }

        // Enable state logging out in console
        this.store.dispatch({
            type: 'ENABLE_STATE_LOGGING'
        });
    },

    changeView: function(uriHash) {
        var activeView = uriHash ? uriHash : "web-traffic";

        this.store.dispatch({
            type: 'REQUEST_VIEW',
            view: activeView
        });
    },

    updateOnStateChanges: function() {
        this.watchActiveView();
        this.watchWebTrafficData();
        this.watchResponseTimesData();
        this.watchRequestAndPublishData();
    },

    watchActiveView: function() {
        this.watch('activeView', function(newView) {
            view.renderTabs();
            view.toggleViewVisibility(newView);
        });
    },

    watchWebTrafficData: function() {
        this.watch('webTraffic.data', function() {
            view.renderContent('web-traffic');
        });
    },

    watchResponseTimesData: function() {
        this.watch('responseTimes.data', function() {
            view.renderContent('response-times');
        });
    },

    watchRequestAndPublishData: function() {
        this.watch('requestAndPublishTimes.data', function() {
            view.renderContent('request-publish-times');
        });
    }


};

module.exports = view;