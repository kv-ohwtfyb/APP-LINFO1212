let dialogOpen = false;
let itemObject = {};
let totalAmount = 0;

$(document).ready(function () {
    const dialog = $("#popup_item");
    const RestaurantName = $(".restaurant-info").find("#restaurant-name").text();
    const itemForm = $("#itemForm");
    $(".list-of-items li section").on('click', function (event) {
        if (!dialogOpen){
            const ItemName = $(event.target).closest("section").find("h1:first-child").text();
            fetchItemData(RestaurantName, ItemName);
        }
    });

    itemForm.on('change', (event) => {
        const input = $(event.target);
        if (input.attr('name')==='quantity'){
            $('#showPrice').html(roundTo2Decimals(itemObject.price * parseInt(input.val())));
        }
    })
    $("#close").on('click', function (event) {
        clearDialog();
        dialog.hide();
        dialogOpen = false;
    });

    itemForm.on('submit', function () {
        if(checkBoxMinLimit()){
            sendAddToBasketRequest(RestaurantName);
        }
        return false;
    });
});


function setCheckBoxMaxLimit(limit, checkBoxGroup, message) {
// Credit to  https://www.plus2net.com/javascript_tutorial/checkbox-limit.php. The following called was inspired by them
    let checkedCount = 0;
    for (let i = 0; i < checkBoxGroup.length; i++) {
        checkBoxGroup[i].onclick = function() {
            for (let i = 0; i < checkBoxGroup.length; i++) {
                checkedCount += (checkBoxGroup[i].checked) ? 1 : 0;
            }
            if (checkedCount > limit) {
                alert(message);
                this.checked = false;
            }
            checkedCount = 0;
        }
        checkedCount = 0;
    }
}

function checkBoxMinLimit(){
    totalAmount = 0;
    for (let i = 0; i < itemObject.groups.length; i++) {
        const group = itemObject.groups[i];
        const itemsArray =  $(`[name='${group.name}']`);
        let count = 0;
        for (let i = 0; i < itemsArray.length; i++){
            if (itemsArray[i].checked){
                count++;
                const groupItem = group.items.filter((o) => o.name === $(itemsArray[i]).val())[0];
                totalAmount+=groupItem.charge;
            }
        }
        if (count < group.minSelection){
            alert(`You have to select at least ${group.minSelection} for ${group.name}.`);
            return false;
        }
    }
    if ($("#itemQuantity").val() < 1) {
        alert("If you adding an item to the basket the quantity should be at least 1.");
        return false;
    }
    totalAmount += roundTo2Decimals(itemObject.price * parseInt($("#itemQuantity").val()));
    $('#totalAmount').val(totalAmount);
    return true;
}

function fetchItemData(restaurantName, itemName){
    $.ajax('/getItemSpecifications',
    {
                method : 'GET',
                data : { restaurantName : restaurantName, itemName : itemName },
                success : handleGetSpecifications
            }
        )
}

function handleGetSpecifications(response) {
    if (response.status){
        loadTheDialog(response.data);
    }else{
        alert(response.msg);
    }
}

function loadTheDialog(item) {
    const dialog = $("dialog");
    $('dialog h2').html(item.name);
    $('dialog img').attr('src',item.imgSrc);
    const form = $('#itemForm');
    itemObject = item;
    form.append(`<label for="itemQuantity" class="margin-top-bottom">
                <input  class="color-white bg-color-black border-less" min="0" type="number" name="quantity" id="itemQuantity" value="0">
                Quantity</label>`);
    item.groups.forEach((group) => {
        if (group){
            let groupHTML = `<p>${group.name}</p>`;
            group.items.forEach((item) => {
                groupHTML+=`
                <label for="${group.name}${item.name}">
                <input type="checkbox" value="${item.name}" name="${group.name}" id="${group.name}${item.name}">
                    <span class="item-name">${item.name}</span>(+${item.charge}€)
                </label>`;
            });
            form.append(groupHTML);
            setCheckBoxMaxLimit(group.maxSelection,
                                $(`[name="${group.name}"]`),
                        `You can select maximum of ${group.maxSelection} of ${group.name}.`);

            }
    });
    form.append(`<input type="hidden" name="restaurantName" value="${$(".restaurant-info").find("#restaurant-name").text()}">`);
    form.append(`<input type="hidden" name="total" id="totalAmount" value="0">`);
    form.append(`<input type="hidden" name="name" value="${item.name}">`);
    form.append(`<input type="hidden" name="unityPrice" value="${itemObject.price}">`);
    dialog.show();
    dialogOpen = true;
}

function clearDialog(){
    $('dialog h2').html('');
    $('dialog img').attr('src','');
    $('#itemForm').html(' ');
    totalAmount = 0;
    $('#showPrice').html('0');
}

function sendAddToBasketRequest(restaurantName) {
    $.ajax('/basket_add',
{
            method : 'POST',
            data : $('#itemForm').serializeArray(),
            success : handleAddToBasketResponse
        }
        )
}

function handleAddToBasketResponse(response) {
    if (response.status){
        window.open(window.location.href, '_parent');
        clearDialog();
        $('dialog').hide();
    }else alert(response.msg);
}

/**
 * Rounds a float to 2 decimals after the point.
 * @param num
 * @return {number}
 */
function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
