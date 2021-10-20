//
module.exports.create = function (items, params, getTooltip)
{
    function updateDataPage (dataPage)
    {
        // Update pagination bar
        firstPageButton.disabled = (params.pageIndex === 0);
        firstPageButton.title = `First page: ${0 + 1}`;
        prevPageButton.disabled = (params.pageIndex === 0);
        prevPageButton.title = `Previous page: ${params.pageIndex - 1 + 1}`;
        if (pageSelect.value !== (params.pageIndex + 1))
        {
            pageSelect.value = params.pageIndex + 1;
        }
        pageSelect.disabled = (pages.length === 1);
        pageSelect.title = `Current page: ${params.pageIndex + 1}`;
        nextPageButton.disabled = (params.pageIndex === (pages.length - 1));
        nextPageButton.title = `Next page: ${params.pageIndex + 1 + 1}`;
        lastPageButton.disabled = (params.pageIndex === (pages.length - 1));
        lastPageButton.title = `Last page: ${pages.length}`;
        //
        let items = pages[params.pageIndex];
        while (dataPage.firstChild)
        {
            dataPage.firstChild.remove ();
        }
        //
        let dataWrapper = document.createElement ('div');
        dataWrapper.className = 'data-wrapper';
        if (params.showCodePoints)
        {
            dataWrapper.classList.add ('show-code-points');
        }
        for (let item of items)
        {
            let characterData = document.createElement ('span');
            characterData.className = 'character-data';
            characterData.title = getTooltip (item.character);
            if (item.dimmed)
            {
                characterData.classList.add ('dimmed');
            }
            let symbol = document.createElement ('span');
            symbol.className = 'symbol';
            symbol.textContent = item.character;
            characterData.appendChild (symbol)
            let codePoint = document.createElement ('span');
            codePoint.className = 'code-point';
            codePoint.textContent = item.character.codePointAt (0).toString (16).toUpperCase ();
            characterData.appendChild (codePoint)
            dataWrapper.appendChild (characterData);
        }
        dataPage.appendChild (dataWrapper);
    }
    //
    let pages;
    //
    let dataTable = document.createElement ('div');
    //
    let layoutOptionsGroup = document.createElement ('div');
    layoutOptionsGroup.className = 'layout-options-group';
    let codePointsLabel = document.createElement ('label');
    let codePointsCheckbox = document.createElement ('input');
    codePointsLabel.appendChild (codePointsCheckbox);
    codePointsLabel.appendChild (document.createTextNode ("\xA0Code Points"));
    codePointsCheckbox.class = 'code-points-checkbox';
    codePointsCheckbox.type = 'checkbox';
    codePointsCheckbox.checked = params.showCodePoints;
    codePointsCheckbox.addEventListener
    (
        'input',
        event =>
        {
            params.showCodePoints = event.currentTarget.checked;
            dataTable.querySelector ('.data-wrapper').classList.toggle ('show-code-points');
        }
    );
    layoutOptionsGroup.appendChild (codePointsLabel);
    dataTable.appendChild (layoutOptionsGroup);
    //
    let paginationBar = document.createElement ('div');
    paginationBar.className = 'pagination-bar';
    //
    let navigationGroup = document.createElement ('div');
    navigationGroup.className = 'pagination-group';
    //
    let firstPageButton = document.createElement ('button');
    firstPageButton.type = 'button';
    firstPageButton.className = 'page-nav-button first-page-button';
    firstPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="0,5 4,1 5,2 2,5 5,8 4,9" /><polygon points="4,5 8,1 9,2 6,5 9,8 8,9" /></svg>';
    firstPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex > 0)
            {
                params.pageIndex = 0;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (firstPageButton);
    //
    let prevPageButton = document.createElement ('button');
    prevPageButton.type = 'button';
    prevPageButton.className = 'page-nav-button prev-page-button';
    prevPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="2,5 6,1 7,2 4,5 7,8 6,9" /></svg>';
    prevPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex > 0)
            {
                params.pageIndex = params.pageIndex - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (prevPageButton);
    //
    let pageSelect = document.createElement ('input');
    pageSelect.type = 'number';
    pageSelect.className = 'page-select';
    pageSelect.addEventListener
    (
        'input',
        (event) =>
        {
            if (event.currentTarget.value !== "")
            {
                if (event.currentTarget.value < 1)
                {
                    event.currentTarget.value = 1;
                }
                else if (event.currentTarget.value > pages.length)
                {
                    event.currentTarget.value = pages.length;
                }
                params.pageIndex = event.currentTarget.value - 1;
                updateDataPage (dataPage);
            }
        }
    );
    pageSelect.addEventListener
    (
        'blur',
        (event) =>
        {
            if (event.currentTarget.value === "")
            {
                event.currentTarget.value = params.pageIndex + 1;
            }
        }
    );
    navigationGroup.appendChild (pageSelect);
    //
    let nextPageButton = document.createElement ('button');
    nextPageButton.type = 'button';
    nextPageButton.className = 'page-nav-button next-page-button';
    nextPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="6,5 3,2 4,1 8,5 4,9 3,8" /></svg>';
    nextPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex < (pages.length - 1))
            {
                params.pageIndex = params.pageIndex + 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (nextPageButton);
    //
    let lastPageButton = document.createElement ('button');
    lastPageButton.type = 'button';
    lastPageButton.className = 'page-nav-button last-page-button';
    lastPageButton.innerHTML = '<svg class="page-nav-icon" viewBox="0 0 10 10"><polygon points="4,5 1,2 2,1 6,5 2,9 1,8" /><polygon points="8,5 5,2 6,1 10,5 6,9 5,8" /></svg>';
    lastPageButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (params.pageIndex < (pages.length - 1))
            {
                params.pageIndex = pages.length - 1;
                updateDataPage (dataPage);
            }
        }
    );
    navigationGroup.appendChild (lastPageButton);
    //
    paginationBar.appendChild (navigationGroup);
    //
    let pageInfoGroup = document.createElement ('div');
    pageInfoGroup.className = 'pagination-group';
    //
    let pageInfo = document.createElement ('div');
    pageInfo.className = 'page-info';
    //
    pageInfoGroup.appendChild (pageInfo);
    //
    paginationBar.appendChild (pageInfoGroup);
    //
    const pageSizes = [ 16, 32, 64, 128, 256, 512, 1024 ];
    //
    let pageSizeGroup = document.createElement ('div');
    pageSizeGroup.className = 'pagination-group';
    //
    let pageSizeLabel = document.createElement ('label');
    let pageSizeSelect = document.createElement ('select');
    pageSizeSelect.className = 'page-size-select';
    pageSizes.forEach
    (
        (pageSize) =>
        {
            let pageSizeOption = document.createElement ('option');
            pageSizeOption.textContent = pageSize;
            pageSizeSelect.appendChild (pageSizeOption);
        }
    );
    //
    pageSizeLabel.appendChild (pageSizeSelect);
    let pageSizeText = document.createTextNode ("\xA0\xA0per page");
    pageSizeLabel.appendChild (pageSizeText);
    pageSizeGroup.appendChild (pageSizeLabel);
    //
    pageSizeSelect.value = params.pageSize;
    if (pageSizeSelect.selectedIndex < 0) // -1: no element is selected
    {
        pageSizeSelect.selectedIndex = 0;
    }
    //
    function paginate ()
    {
        pages = [ ];
        for (let startIndex = 0; startIndex < items.length; startIndex += params.pageSize)
        {
            pages.push (items.slice (startIndex, startIndex + params.pageSize));
        }
        let pageCount = pages.length;
        pageSelect.min = 1;
        pageSelect.max = pageCount;
        pageSelect.value = params.pageIndex + 1;
        pageInfo.innerHTML = (pageCount > 1) ? `<strong>${pageCount}</strong>&nbsp;pages` : "";
        updateDataPage (dataPage);
    }
    //
    pageSizeSelect.addEventListener
    (
        'input',
        (event) =>
        {
            params.pageSize = parseInt (event.currentTarget.value);
            params.pageIndex = 0;
            paginate ();
        }
    );
    //
    paginationBar.appendChild (pageSizeGroup);
    //
    dataTable.appendChild (paginationBar);
    let dataPage = document.createElement ('div');
    dataTable.appendChild (dataPage);
    //
    if (( 0 > params.pageIndex) || (params.pageIndex > Math.trunc ((items.length - 1) / params.pageSize)))
    {
        params.pageIndex = 0;
    }
    paginate ();
    //
    return dataTable;
}
//
