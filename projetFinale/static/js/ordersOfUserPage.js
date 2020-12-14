$(document).ready(function (){
    const dialog = $("#popup_item");
    dialog.hide();

    $("#reOrder_btn").on('click', function(event){
        dialog.show();

    });

    $("#close_popup").on('click', function () {
        dialog.hide(500);
    });
    
    $("#submit_popup").click(function () {

        $("#orderList .RestoName").each(function (){

            const restoName = $(this).text();
            const itemQuant = $("#itemQuantity").each(()=> {return $(this).val()});
            
            const itemName  = $(".name").each(() => {return $(this).text(); });
            const itemPrice = $("#itemUnityPrice").each(() => {return $(this).text(); })
            

            $.ajax('/orders_page',
                {
                    success : htmlBasket(restoName, itemQuant, itemName, itemPrice) 
                });


            /**
             * This function add the order's details in the basket
             * @param {*} resto : the restoraurant name
             * @param {*} Quant 
             * @param {*} item 
             * @param {*} unityPrice 
             */
            
            function htmlBasket(resto, Quant, item, unityPrice){
        
                let addBasket = `
                <ul>
                    <li>
                        <h2>${resto}</h2>
                        <hr class="bg-color-black">
                        <ul>
                            <li class="item">
                                <input type="number" min="0" max="20" value="${Quant}" class="bg-color-black border-less" name="${resto}|${item}" disabled>
                                <p class="name text-align-left" id="name">${item}</p>
                                <p class="text-align-right">${unityPrice}€</p>
                            </li>
                        </ul>
                    </li>
                    
                </ul>
                <div class="bg-color-black bottom-of-container three-gridded-layout">
                    <p class="text-align-left" id="totalItems">3 </p>
                    <p>Total</p>
                    <p class="text-align-right" id="totalAmount">${unityPrice * Quant}€</p>
                </div>`
                $("#basketText").remove();
                $("#p").append(addBasket);
            }
            
        });
        dialog.hide(300);
    });
    

});