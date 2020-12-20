$(document).ready(function () {

    $("form").on('submit',() => {
        sendOrderRequest($("#building").val(), $("#date").val());
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