$(document).ready(function () {
    const order_view = $(".order-view");
    $(".table-of-orders .order").on('click', function (){
       order_view.css("width", "420px");
    });
    $(".order-view .close").on('click', function () {
        order_view.css("width", "0px");
    })
})