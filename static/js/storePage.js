$(document).ready(function () {

    $("#items-table tr").on('click',(event) => {
        const item = $(event.target).closest('tr').find(".name").text();
        window.open('/item?name='+item,'_parent');
    })

    $("#groups-table tr").on('click',(event) => {
        const groupName = $(event.target).closest('tr').find(".name").text();
        window.open('/group?group='+groupName,'_parent');
    })

    $("#categories-table tr").on('click',(event) => {
        const categoryName = $(event.target).closest('tr').find(".name").text();
        window.open('/category?category='+categoryName,'_parent');
    })
})
