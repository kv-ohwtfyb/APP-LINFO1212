$(document).ready(function () {
    const dialog = $("#popup_item");
    $(".list-of-items > li").on('click', function () {
        const div_html = $(this).html();
        dialog.show();
    });

    $("#close_popup").on('click', function () {
        dialog.hide();
    })
});