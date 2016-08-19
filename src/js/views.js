// var baseTemplate = require('../templates/base.handlebars');
// var viewActivity = require('./viewActivity');
// var viewServiceStatus = require('./viewServiceStatus');
// var main = document.getElementById('main');
// var baseData = {title: "Title thingy"};
//
//
// // render base template
// main.innerHTML = baseTemplate(baseData);
// content = document.getElementById('content');
// renderContent();
//
// var tabLinks = document.getElementsByClassName('js-tab');
// console.log(tabLinks);
//
// for(var i=0; i<tabLinks.length; i++) {
//     tabLinks[i].addEventListener("click", renderContent())
// }
//
// renderContent = function() {
// // some simple routing
//     switch (uriHash) {
//         case "service-status":
//             console.log("service-status");
//             viewServiceStatus.renderTemplate(content, baseData);
//             break;
//         default:
//             console.log("activity");
//             viewActivity.renderTemplate(content, baseData);
//     }
// };

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
        // this.initView(uriHash);
        this.changeView(uriHash);
        this.handleParams(uriParams);
        this.renderBase();
        this.bindClickEvents();
        this.subscribeToStateChange();
        // this.renderAllContent();
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
            } else {
                sections[i].style.display = 'block';
            }
        }

    },

    renderContent: function(uriHash) {
        // some simple routing
        // var content = document.getElementById('content');
        var content = document.getElementById(uriHash + '-section');
        switch (uriHash) {
            case "service-status":
                this.viewServiceStatus.renderView(content);
                view.store.dispatch({
                    type: 'UPDATED_SERVICE_STATUS_VIEW'
                });
                break;
            case "activity":
                this.viewActivity.renderView(content);
                view.store.dispatch({
                    type: 'UPDATED_ACTIVITY_VIEW'
                });
                break;
            default:
                console.log('No matching hash provided');
        }

        // Update state with flag saying view change is no longer pending
        // view.store.dispatch({
        //     type: 'UPDATED_VIEW',
        //     view: uriHash
        // })
    },

    renderTabs: function() {
        var tabs = document.getElementById('tabs--js');
        view.viewTabs.renderView(tabs);
    },

    initView: function(uriHash) {
        var activeView = uriHash ? uriHash : "activity";

        this.store.dispatch({
            type: 'INITIALISE_VIEW',
            view: activeView
        });
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

                view.toggleViewVisibility(currentState.activeView);
            }

            // Render section when new data has arrived for it
            if (currentState.activity.isNewData) {
                view.renderContent('activity');
            } else if (currentState.serviceStatus.isNewData) {
                view.renderContent('service-status');
            }

            // Render view is a view update is pending
            // if (currentState.pendingViewUpdate) {
            //     // TODO if data crunching and rendering charts take some time tab click feels delayed. Tab should swap instantly and content should go completely empty first, then new content loaded in when it's ready.
            //     view.renderTabs();
            //     view.bindClickEvents();
            //
            //     // view.renderContent(view.stringConvert.fromCameltoSlug(currentState.activeView));
            // }
        });
    }

};

module.exports = view;