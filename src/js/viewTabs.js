
var viewTabs = {

    tabsData: {
        tabs: [
            {
                title: 'ONS website',
                slug: 'ons-website',
                isActive: false
            },
            {
                title: 'Service status',
                slug: 'service-status',
                isActive: false
            }
        ]
    },
    tabsTemplate: require('../templates/partials/tabs.handlebars'),
    store: require('./state'),

    buildTabData: function() {
        var currentState = this.store.getState(),
            tabDataLength = viewTabs.tabsData.tabs.length,
            i;

        for (i = 0; i < tabDataLength; i++) {
            if (viewTabs.tabsData.tabs[i].slug == currentState.activeView) {
                viewTabs.tabsData.tabs[i].isActive = true;
            } else {
                viewTabs.tabsData.tabs[i].isActive = false;
            }
        }

    },

    renderView: function(container) {
        viewTabs.buildTabData();
        container.innerHTML = this.tabsTemplate(this.tabsData);
    }
};

module.exports = viewTabs;
