$(document).ready(function () {

    const dialog = $("#popup_item");
    dialog.hide();
    $(".list-of-items > li").on('click', function () {
        dialog.show();
    });

    $("#close_popup").on('click', function () {
        dialog.hide();
    })
});

