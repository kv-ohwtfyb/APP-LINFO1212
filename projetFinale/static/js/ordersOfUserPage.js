$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();

    $("#reOrder_btn").on('click', function(event){
        displayDialog(event, dialog)
        dialog.show();

        $('#msg').show(() => { setTimeout( () => { $('#msg').hide()} ,5000); });
        
    });
    
    $("#submit_popup").click(function () {

        console.log("Button clicked for " + $(".RestoName").text() );
    });
    

    $("#close_popup").on('click', function () {
        dialog.hide(500);
    });

    

    /**
     * This function is for displaying the dialog box of each order of a user
     * @param {*} event : Always be click
     * @param {*} theId : the Id of the dialog. (Where we want to show the order).
     */

    function displayDialog(event, theId) {

    }





});