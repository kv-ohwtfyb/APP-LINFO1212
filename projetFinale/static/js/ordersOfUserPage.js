$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();
    $("#reOrder_btn").on('click', function(){
        dialog.show();

        $('#msg').show(() => { setTimeout( () => { $('#msg').hide()} ,5000); });
        
    });
    
    $("#submit_popup").click(function () {
        alert("Button clicked and data : " + dialog.val());
    });
    

    $("#close_popup").on('click', function () {
        dialog.hide(500);
    });

});