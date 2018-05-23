var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewTabs: require('./viewTabs'),
    viewResponseTimes: require('./viewResponseTimes'),
    main: document.getElementById('main'),
    store: require('./state'),
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
            case "response-times":
                this.viewResponseTimes.renderView(container);
                break;
            default:
                console.log('No matching hash provided');
        }
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
        this.watchResponseTimesData();
    },

    watchActiveView: function() {
        this.watch('activeView', function(newView) {
            view.toggleViewVisibility(newView);
        });
    },
    watchResponseTimesData: function() {
        this.watch('responseTimes.data', function() {
            view.renderContent('response-times');
        });
    },
};

module.exports = view;