// var baseTemplate = require('../templates/base.handlebars');
// var viewActivity = require('./viewActivity');
// var viewServiceStatus = require('./viewServiceStatus');
// var main = document.getElementById('main');
// var bodyData = {title: "Title thingy"};
//
//
// // render base template
// main.innerHTML = baseTemplate(bodyData);
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
//             viewServiceStatus.renderTemplate(content, bodyData);
//             break;
//         default:
//             console.log("activity");
//             viewActivity.renderTemplate(content, bodyData);
//     }
// };

var view = {
    baseTemplate: require('../templates/base.handlebars'),
    viewActivity: require('./viewActivity'),
    viewServiceStatus: require('./viewServiceStatus'),
    main: document.getElementById('main'),
    bodyData: {title: "Title thingy"},

    // remove uriHash arg - get from state store
    init: function(uriHash) {
        this.renderBase();
        this.renderContent(uriHash);
        this.bindClickEvents();
    },

    renderBase: function() {
        this.main.innerHTML = this.baseTemplate(this.bodyData);
    },

    bindClickEvents: function() {
        var tabLinks = document.getElementsByClassName('js-tab');

        for(var i =0 ; i < tabLinks.length; i++) {
            tabLinks[i].addEventListener("click", this.handleTabClick, false);
        }
    },

    handleTabClick: function() {
        var href = this.getAttribute("href").substring(1);
        view.renderContent(href);
    },

    renderContent: function(uriHash) {
        // some simple routing
        var content = document.getElementById('content');
        switch (uriHash) {
            case "service-status":
                this.viewServiceStatus.renderTemplate(content, this.bodyData);
                break;
            default:
                this.viewActivity.renderTemplate(content, this.bodyData);
        }
    }

};

module.exports = view;