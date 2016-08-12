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
    init: function(uriHash) {
        this.initView(uriHash);
        this.renderBase();
        this.bindClickEvents();
        this.subscribeToStateChange();
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

    renderContent: function(uriHash) {
        // some simple routing
        var content = document.getElementById('content');
        switch (uriHash) {
            case "service-status":
                this.viewServiceStatus.renderView(content);
                break;
            case "activity":
                this.viewActivity.renderView(content);
                break;
            default:
                console.log('No matching hash provided');
        }

        // Update state with flag saying view change is no longer pending
        view.store.dispatch({
            type: 'UPDATED_VIEW'
        })
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
        })
    },

    changeView: function(uriHash) {
        this.store.dispatch({
            type: 'REQUEST_VIEW',
            view: uriHash
        });
    },

    subscribeToStateChange: function() {
        this.store.subscribe(function() {
            var currentState = view.store.getState();

            // Render view is a view update is pending
            if (currentState.pendingViewUpdate) {
                // TODO if data crunching and rendering charts take some time tab click feels delayed. Tab should swap instantly and content should go completely empty first, then new content loaded in when it's ready.
                view.renderTabs();
                view.bindClickEvents();

                view.renderContent(view.stringConvert.fromCameltoSlug(currentState.activeView));
            }
        });
    }

};

module.exports = view;