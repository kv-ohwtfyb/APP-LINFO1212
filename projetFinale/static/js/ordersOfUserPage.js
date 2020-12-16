
$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();

    $(".reOrder_btn").on('click', function(event){
        const orderId = $(event.target).closest("tr").find(".orderId").text();
        $.ajax( '/getFullOrders',
        {
            method :'GET',
            data   : {_id: orderId},
            success: methodDialog
        })

    });

    function methodDialog(response) {
        if(response.status){
            let result = ``;
            const totalSize = response.data.restaurants.length ;

            for ( let i = 0; i < totalSize ; i++ ){ 
                result += `<li >
                    <h2 class ="RestoName" >${response.data.restaurants[i].restaurant}</h2>
                    <hr class="bg-color-black">
                    <ul>
                    
                        <li class="item">
                            <input type="number"  value="${response.data.restaurants[i].quantity}" class="bg-color-black border-less" id="itemQuantity" name="${response.data.restaurants[i].restaurant}|${response.data.restaurants[i].name}">
                            <p class="name text-align-left" class="name" name ="itemName" >${response.data.restaurants[i].name}</p>
                            <p class="text-align-right" id="itemUnityPrice" name ="unityPrice" >${response.data.restaurants[i].unityPrice}€</p>
                        </li>
                    </ul>
                </li>`  
                                    
            } 
            
            
            const creatingDialog = ` <h2>ORDER</h2>

            <section>
                <ul class="order-view-text-align-left" id="detailsList">
                    
                    <li>Order ID : ${response.data._id} </li>
                    <li>Date     : ${response.data.date} </li>
                    <li>Batiment : ${response.data.building} </li>
                    <li>Status   : ${response.data.status} </li>            
                </ul>
            </section>  
            <form method="dialog" >
            
                <ul class="full-width-section order-view-text-align-left" id="orderList">
                    ${result} 
                </ul>
            </form>`

            dialog.append(creatingDialog);
            dialog.show();

        } else {
            console.log("Fuck You");
        }
    }

    $("#close_popup").on('click', function () { 
        dialog.hide();
        dialog.find("#detailsList").remove();
        dialog.find("#orderList").remove();
    });
    
    $("#submit_popup").click(function () {
        
    });
    

});