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
        $(document.body).css("pointer-event", "none");
        sendModifyingRequest(event);
    });
});


// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Sends the modify item of the basket request to the server, and freezes
 * every other pointer events till the response from the server.
 * @param event
 */
function sendModifyingRequest(event){
    const input = $(event.target).closest(":input");
    const nameSplit = input.attr("name").split("|");
    const data = {
        restaurant : nameSplit[0], itemName : nameSplit[1],
        quantity : input.val()
    }
    $.ajax('/basket_modify',
    {   method  : 'post',
                data    :  data,
                success : function (response) { treatResponseForModifyingItem(response, input, event); }
            }
    );
}

/**
 * Treats with the response from the server unfreeze pointer events in the body.
 * @param response
 * @param input
 * @param event
 */
function treatResponseForModifyingItem(response, input, event) {
    console.log(response);
    if (response.status){
        input.attr("value", input.val());
        if (parseInt(input.val()) === 0){
            const theItem = $(event.target).closest(".item");
            theItem.remove();
        }
        $("#totalItems").html(response.totalItems);
        $("#totalAmount").html(response.totalAmount.toString() + "€");

    } else {
        alert(response.msg);
        input.val(input.attr("value"));
    }
    $(document.body).css("pointer-event", "auto");
}