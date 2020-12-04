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

    //When on input is changed
    $("#popup_plate_header :input").on('change',(event) =>{
        const input = $(event.target).closest(":input");
        const nameSplit = input.attr("name").split("|");
        const data = {
            restaurant : nameSplit[0], itemName : nameSplit[1],
            quantity : input.val()
        }
        // Sends request to server.
        $.ajax('/modify_item',
            {   method : 'post',
                        data   :  data,
                        success : function (response) {
                            console.log(response);
                            if (response.status){
                                if (input.val() === 0){
                                    const theItem = $(event.target).closest(".item");
                                    theItem.remove();
                                }else {
                                    input.attr("value", input.val());
                                }
                            } else {
                                alert(response.msg);
                                input.val(input.attr("value"));
                            }
                        }
                    }
            );
    });
});


// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}