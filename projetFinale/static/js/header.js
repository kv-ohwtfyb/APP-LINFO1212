$(document).ready(function () {
    // This contains all the Jquery methods

    const navbarInHeader = $("#navbar_header");
    $("#navbar_open").on('click', function () {
        navbarInHeader.css("width","420px");
    });
    $('#navbar_close').on('click', function () {
        navbarInHeader.css("width","0px");
    });

    const platePopUpInHeader = $('#popup_plate_header');
    $("#popup_plate_open").on('click', function () {
        platePopUpInHeader.css("width", "420px");
    })
    $("#popup_plate_close").on('click', function () {
        platePopUpInHeader.css("width", "0px");
    })
});
