$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();

    $("#reOrder_btn").on('click', function(event){
        dialog.show();

        $('#msg').show(() => { setTimeout( () => { $('#msg').hide()} ,5000); });
        
    });
    
    $("#submit_popup").click(function () {
        $("#orderList").each(function (){
            console.log($("#RestoName").text());
            console.log($("#name").text());
            
            
        });
    });
    

    $("#close_popup").on('click', function () {
        dialog.hide(500);
    });

    

    /**
     * This function is for displaying the dialog box of each order of a user
     * @param {*} event : Always be click
     * @param {*} theId : the Id of the dialog. (Where we want to show the order).
     */

    function displayBasket(event, theId) {
        let inBasket = `
        <ul>
            <li>
                <h2>${theId.val()}</h2>
                
            </li>
            
        </ul>`

        $("#popup_plate_header").append(inBasket);

    }





});