
let basket; 

$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();
    let orderId = ""; 

    /* Si On appuie sur le button ReOrder  (pour voir les détails de la commande*/

    $(".reOrder_btn").on('click', function(event){
        orderId = $(event.target).closest("tr").find(".orderId").text();
        $.ajax( '/getFullOrders',
        {
            method :'GET',
            data   : {_id: orderId},
            success: displayDialog
        })

    });

    
    /* Si On appuie sur le button Annuler*/

    $("#close_popup").on('click', function () { 
        dialog.hide();
        dialog.find("h2").remove();
        dialog.find("#detailsList").remove();
        dialog.find("#orderList").remove();
    });
    
    /* Si On appuie sur le button reOrder dans le dialog*/
    
    $("#submit_popup").click(function (event) {

        $.ajax( '/reOrderCheck',
        {
            method : 'POST',
            data   : { orderId : basket._id },
            success: function (response) {
                if (response.status){
                    window.open("/check_out", '_parent');
                } else {
                    alert(response.msg);
                }
                dialog.hide();
                dialog.find("h2").remove();
                dialog.find("#detailsList").remove();
                dialog.find("#theForm").remove();
                dialog.find("#orderList").remove();
            }
        })
    });










    /**
     * Creér un dialog et l'affiche 
     * @param {Objet} response : Reponse donnée par le serveur. 
     * Structure: response = {
     *  status: true (or false),
     *  data  : {Json d'une ou des commande(s)} ou un message d'erreur 
     * }
     *  
     */
    function displayDialog(response) {
        basket = response.data;

        if(response.status){
            let result = ``;
            let creatingDialog = ``;
            let createForm = ``;
            const totalSize = response.data.restaurants.length ;


            result = afficherLesDetails(totalSize, response.data.restaurants);         
            
            creatingDialog  = ` <h2>ORDER</h2>
            <ul class="order-view-text-align-left" id="detailsList">
                    
                    <li>Order ID : <i>${response.data._id}      </i></li>
                    <li>Date     : <i>${response.data.date}     </i></li>
                    <li>Batiment : <i>${response.data.building} </i></li>
                    <li>Status   : <i>${response.data.status}   </i></li>            
            </ul>`
            
            createForm = `
            <ul class="full-width-section order-view-text-align-left" id="orderList">
                ${result} 
            </ul>`
            
            dialog.find(".orderDetails").append(creatingDialog);
            dialog.find("#theForm").append(createForm);
            dialog.show();

        } else {
            alert(response.data)
        }
    }
    
    
    /**
     * 
     * @param {number} restoListSize : La taille de la list des Restaurants 
     * @param {Array} listOfRestaurants : La Liste des restaurants.
     * 
     * listOfRestaurants == restaurants : [
     *      { restaurant: '...', items : [...], total : ...}
     *      { restaurant: "...", items : [...], total : ...}
     * ]
     */

    function afficherLesDetails(restoListSize, listOfRestaurants){
        let result = ` `;
        
        for ( let i = 0; i < restoListSize ; i++ ){ 

            const itemListSize = listOfRestaurants[i].items.length;

            const itemResult = afficherLesItems(itemListSize, listOfRestaurants[i].items, listOfRestaurants[i].restaurant )

            result += `<li >
                <h2 class ="RestoName" >${listOfRestaurants[i].restaurant}</h2>
                <hr class="bg-color-black">
                <ul>
                    ${itemResult}                       
                </ul>
            </li>`  
                                
        } 

        return result;

    }


    /**
     * Return an html template of Items
     * @param {number} itemListSize : La taille de la list; 
     * @param {Array} itemList : une list d'objet;
     * @param {String} nameOfRestaurant : The name of the restaurant;
     */
    function afficherLesItems(itemListSize, itemList, nameOfRestaurant){

        let result = ``;
        for (let j = 0; j < itemListSize; j++){
            result += `
            <li class="item">
                <input type="number"  value="${itemList[j].quantity}" class="bg-color-black border-less" id="itemQuantity" name="${nameOfRestaurant}|${itemList[j].name}" disabled>
                <p class="name text-align-left" class="name" name ="itemName" >${itemList[j].name}</p>
                <p class="text-align-right" id="itemUnityPrice" name ="unityPrice" >${itemList[j].unityPrice}€</p>
            </li>`            
        }
        return result;
        
    }
});

