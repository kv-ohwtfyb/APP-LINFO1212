$(document).ready(function () {
    // This contains all the Jquery methods

    const navbarInHeader = $("#navbar_header");
    $("#navbar_open").on('click', function () {
        navbarInHeader.css("width","420px");
    });
    $('#navbar_close').on('click', function () {
        navbarInHeader.css("width","0px");
    });

    // Opening and closing the basket in the header.
    const platePopUpInHeader = $('#popup_plate_header');
    $("#popup_plate_open").on('click', function () {
        platePopUpInHeader.css("width", "420px");
    })
    $("#popup_plate_close").on('click', function () {
        platePopUpInHeader.css("width", "0px");
    })

    //When the input is changed
    $("#popup_plate_header :input").change ( () => {
        $(document.body).css('pointer-events','none');
        alert("Inactive");
        sleep(10000).then(() =>{
            $(document.body).css('pointer-events','auto');
            alert("Active");
        });
    })
});


// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}