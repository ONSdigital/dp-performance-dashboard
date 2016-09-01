function buildTableHtml(options) {
    var data = options.data,
        id = options.id,
        tableHtml = document.getElementById(id + '--table') ? document.getElementById(id + '--table') : document.createElement('table'),
        tableHeadings = options.headings,
        tableBody = [],
        index,
        chartElement = document.getElementById(id + '--chart'),
        multipleDataSrcs = options.body.length > 1;


    /* Build table headings */
    tableHeadings = '<tr><th scope="col">' + tableHeadings.join('</th><th scope="col">') + '</th></tr>';


    /* Build table body*/

    function buildBodyMarkup(dataObj, valueNodes) {
        var valuesLength = dataObj.values.length;

        // If no custom values passed to function then build the table body from all nodes in values array in data
        if (valueNodes.length <= 0) {
            for (index = 0; index < valuesLength; index++) {
                tableBody[index] = '<tr><td>' + dataObj.values[index].join('</td><td>') + '</td></tr>';
            }
        } else {
            // Else build body of table with only the specific nodes from values array in data
            for (index = 0; index < valuesLength; index++) {
                var tableRow = [];
                for (var i = 0, arrLength = valueNodes.length; i < arrLength; i++) {
                    tableRow.push(dataObj.values[index][valueNodes[i]]);
                }
                tableBody[index] = '<tr><td>' + tableRow.join('</td><td>') + '</td></tr>';
            }

        }
    }

    if (!multipleDataSrcs) {
        // Data all from one object - build table as normal
        buildBodyMarkup(data[options.body[0].dataNode], options.body[0].valueNodes);
    } else {
        // Data comes from multiple different objects - custom function to build up HTML
        var i,
            dataSrcLength = options.body.length,
            tableRows = [];

        // Loop through each data source / object
        for (i = 0; i < dataSrcLength; i++) {

            var valuesLength = data[options.body[i].dataNode].values.length,
                valueNodes = options.body[i].valueNodes;

            // Do ordinary loop through each value array
            for (index = 0; index < valuesLength; index++) {

                // Get specific value nodes from the value array
                for (var valuesIndex = 0, arrLength = valueNodes.length; valuesIndex < arrLength; valuesIndex++) {

                    // Build array for each row of the table with arrays containing data
                    if (!tableRows[index]) {
                        tableRows[index] = [];
                    }
                    tableRows[index].push((data[options.body[i].dataNode].values[index][valueNodes[valuesIndex]]));
                }
            }
        }

        // Join together each individual array in the row array
        var tableRowsLength = tableRows.length;
        for (i = 0; i < tableRowsLength; i++) {
            tableRows[i] = '<tr><td>' + tableRows[i].join('</td><td>') + '</td></tr>';
        }

        tableBody = tableRows;
    }

    // Join together rows to
    tableBody = tableBody.join('');


    /* Construct table element and update DOM */

    // Give our table element an ID
    tableHtml.setAttribute('id', id + '--table');

    // Hide table off of canvas
    tableHtml.style.position = "fixed";
    tableHtml.style.left = "-999999px";

    // Update table element with headings and body
    tableHtml.innerHTML = tableHeadings + tableBody;

    if (!chartElement) {
        debugger;
    }

    // Append table after chart in DOM
    chartElement.parentNode.insertBefore(tableHtml, chartElement.nextSibling);
}

module.exports = buildTableHtml;
