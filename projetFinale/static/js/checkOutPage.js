$(document).ready(function () {

    $("#confirm_order").on('click', function () {
        sendOrderRequest($("#building").val(), $("#date").val());
    });

    $("form").on('submit',() => {
        return false;
    })
})


function sendOrderRequest(building, date){
    $.ajax('/check_out',
{
            method: "POST",
            data : { building : building, date : date },
            success : handleResponse
        });
}

function handleResponse(response) {
    console.log(response);
    if (response.status){
        window.open('/orders_page', '_parent');
    }else {
        alert(response.msg);
    }
}