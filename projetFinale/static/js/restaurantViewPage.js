let dialogOpen = false;
let groups = [];

$(document).ready(function () {
    const dialog = $("#popup_item");
    $(".list-of-items li section").on('click', function (event) {
        if (!dialogOpen){
            const RestaurantName = $(".restaurant-info").find("#restaurant-name").text();
            const ItemName = $(event.target).closest("section").find("h1:first-child").text();
            fetchItemData(RestaurantName, ItemName);
        }
    });
    $("#close").on('click', function (event) {
        clearDialog();
        dialog.hide();
        dialogOpen = false;
    });

    $("#itemForm").on('submit', function () {
        return checkBoxMinLimit();
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
        }
        checkedCount = 0;
    }
}

function checkBoxMinLimit(){
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if ($(`[name='${group.name}'] :checked`).length < group.minSelection){
            alert(`You have to select at least ${group.minSelection} for ${group.name}.`)
            return false;
        }
    }
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
    groups = item.groups;
    console.log(groups.length);
    item.groups.forEach((group) => {
        if (group){
            let groupHTML = `<p>${group.name}</p>`;
            group.items.forEach((item) => {
                groupHTML+=`
                <label for="${group.name}${item.name}">
                <input type="checkbox" value="${item.name}" name="${group.name}" id="${group.name}${item.name}">
                    ${item.name} (+${item.charge}€)
                </label>`;
            });
            form.append(groupHTML);
            setCheckBoxMaxLimit(group.maxSelection,
                                $(`[name="${group.name}"]`),
                        `You can select maximum of ${group.maxSelection} of ${group.name}.`);

            }
    });
    dialog.show();
    dialogOpen = true;
}

function clearDialog(){
    $('dialog h2').html('');
    $('dialog img').attr('src','');
    $('#itemForm').html(' ');
}