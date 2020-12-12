$(document).ready(function () {

    $("#items-table tr").on('click',(event) => {
        const item = $(event.target).closest('tr').find(".name").text();
        window.open('/item?name='+item,'_parent');
    })
})
