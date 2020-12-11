$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();
    $("#reOrder_btn").on('click', function(){
        dialog.show();

        $('#msg').show(() => { setTimeout( () => { $('#msg').hide()} ,5000); });
        
    });

    $("#submit_popup").on('click', function () {
        dialog.hide(function () {

            alert("Value rendered : " + dialog.val() );

        });
    });

    $("#close_popup").on('click', function () {
        dialog.hide(995);
    });

});