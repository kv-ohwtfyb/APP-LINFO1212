$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();

    $("#reOrder_btn").on('click', function(event){
        displayDialog(event, dialog)
        dialog.show();

        $('#msg').show(() => { setTimeout( () => { $('#msg').hide()} ,5000); });
        
    });
    
    $("#submit_popup").click(function () {
        alert("Button clicked and data : " + dialog.val());
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
        let orderDialog = `
        <h2>ORDER</h2>

        <section >
            <ul class="order-view-text-align-left" id="detailsList">
                <li>Order ID : {{_id}} <!--#i896eh6983h --></li>
                <li>Date     : {{date}} <!--25 Feb 2020--></li>
                <li>Batiment : {{building}} <!--Batiment Reamur--></li>
                <li>Status   : {{status}} <!--Delivered--></li>            
            </ul>
        </section>  
        <p id="msg">{{msg}}</p>
        <form method="dialog" action="/userReOrder" method="GET">
        
            <ul class="full-width-section order-view-text-align-left" id="orderList">
                {{#restaurants}}
                <li>
                    <h2 name ="RestoName" >{{restaurant}}</h2>
                    <hr class="bg-color-black">
                    <ul>
                        {{#items}}
                        <li class="item">
                            <input type="number" value="{{quantity}}" class="bg-color-black border-less" name="{{restaurant}}|{{name}}">
                            <p class="name text-align-left" id="name" name ="itemName" >{{name}}</p>
                            <p class="text-align-right" name ="unityPrice" >{{unityPrice}}€</p>
                        </li>
                        {{/items}}
                    </ul>
                </li>
                {{/restaurants}}
                
            </ul>
            <button value="cancel" class="bg-color-black color-white" id="close_popup" >Annuler</button>
            <button value="default" class="bg-color-green" id="submit_popup" type="submit"ç!>REORDER {{total}}</button>
        </form>
        `
        theId.append(orderDialog);
    }





});