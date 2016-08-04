var indexTemplate = require('../templates/index.handlebars'),
    body = document.getElementById('main'),
    bodyData = {
        title: "Title thingy"
    };

body.innerHTML = indexTemplate(bodyData);
