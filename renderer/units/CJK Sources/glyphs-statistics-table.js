//
module.exports.create = function (statisticsHeader, statisticsData)
{
    let table = document.createElement ('table');
    table.className = 'blocks-table';
    let headerRow = document.createElement ('tr');
    headerRow.className = 'header-row';
    let totals = [ ];
    let index = 0;
    for (let headerString of statisticsHeader)
    {
        let header = document.createElement ('th');
        header.className = (index > 0) ? 'count-header' : 'block-header';
        header.textContent = headerString;
        headerRow.appendChild (header);
        if (index > 0) totals[index] = 0;
        index++;
    }
    table.appendChild (headerRow);
    for (let row of statisticsData)
    {
        let dataRow = document.createElement ('tr');
        dataRow.className = 'data-row';
        index = 0;
        for (let dataElement of row)
        {
            let data = document.createElement ('td');
            data.className = (index > 0) ? ((index <= (row.length - 1 - 1)) ? 'count-data' : 'total-data') : 'block-data';
            data.textContent = dataElement;
            dataRow.appendChild (data);
            if (index > 0) totals[index] += dataElement;
            index++;
        }
        table.appendChild (dataRow);
    }
    let totalRow = document.createElement ('tr');
    totalRow.className = 'total-row';
    index = 0;
    for (let total of totals)
    {
        let totalData = document.createElement ('td');
        totalData.className = (index > 0) ? 'total-data' : 'total-label';
        totalData.textContent = (index > 0) ? total : "Total";
        totalRow.appendChild (totalData);
        index++;
    }
    table.appendChild (totalRow);
    return table;
}
//
