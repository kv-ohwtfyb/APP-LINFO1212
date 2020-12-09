$(document).ready(function () {

    const priceInput = $("#item-price");
    const promoPercentage = $("#promotion");
    const form = $('#form');
    const categorySearchInput = $('#choose-category');

    priceInput.change(()=>{
        updateFinalPrice();
    });

    promoPercentage.change(()=>{
        updateFinalPrice();
    });

    $('#deleteButton').on('click', ()=>{
        $.ajax('/item',
    {   method  : 'delete',
                data    : form.serialize(),
                success : function (response) {
                    console.log(response);
                }
            }
        );
    })

    categorySearchInput.keypress(() => {
        console.log(categorySearchInput.val());
        getListOfGroups(categorySearchInput.val())
    })

    function updateFinalPrice(){
        if (parseFloat(promoPercentage.val()) > 0){
            $("#final-price").html(roundTo2Decimals(parseFloat(priceInput.val()) * (1 - (parseFloat(promoPercentage.val())/100))).toString());
        }
        else{
            $("#final-price").html(priceInput.val());
        }
    }

    function getListOfGroups(string){
        $.ajax('/getGroups',
            {   method: 'GET',
                data : { search : string },
                success : function (response) {
                    if (response.status){ updateGroupSearch(response.result); }
                    else { alert(response.msg); }
                }
            }
        )
    }

    function updateGroupSearch(array){
        console.log(array);
    }
});

function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}


