$(document).ready(function () {

    const form = $('#form'); form.validate();
    const itemSearchInput = $('#choose-items');

    itemSearchInput.on('change', (event) => {
        updateSelectedItems(event, itemSearchInput);
    });
    itemSearchInput.on('focusout', (event) => {
        updateSelectedItems(event, itemSearchInput);
    });

    $('ul').on('click', (event)=>{
        removeItemFilter(event);
    });

    form.on('submit', () => {
        addTheSelectedItems();
        if (!(constraintsRespected())) return false;
    })

    $('#deleteButton').on('click', ()=>{
        addTheSelectedItems();
        if (!(constraintsRespected())) return false;
        deleteGroup(form);
    })

    $("#update-group").on('click', () =>{
        addTheSelectedItems();
        if (!(constraintsRespected())) return false;
        sendPutRequest(form);
    })
})

/**
 * Adds the selected items to the list pf the selected items
 * @param event (JQuery event)
 * @param itemsSearchInput
 */
function updateSelectedItems(event, itemsSearchInput){
    const validation = dataListContainsOption(document.getElementById('list-of-items'), itemsSearchInput.val());
    if (validation) {
        let listItemGeneric = `
            <li class="row-display margin-top-bottom">
                <div class="item row-display bg-color-black color-white round-border">
                    <p>${itemsSearchInput.val()}</p>
                    <button class="itemRemove bg-color-black color-white border-less" type="button">X</button>
                </div>
                <div class="row-display align-center">
                    <label for="extra-charge-${itemsSearchInput.val()}" class="margin-left-right">Extra charge</label>
                    <input id="extra-charge-${itemsSearchInput.val()}" min="0" placeholder="Charger 00.00€" class="round-border border-less" type="number" step="0.01">
                </div>
            </li>
        `
        $('#selectedGroups').append(listItemGeneric);
    }
    itemsSearchInput.val("");
}

/**
 * If the origin of the event was the .itemRemove button the list element is removed
 * @param event  (JQuery event)
 */
function removeItemFilter(event){
    if (event.target.classList.contains("itemRemove")){
        $(event.target).closest("li").remove();
    }
}

function addTheSelectedItems() {
    const array = [];
    $("#selectedGroups li").each((idx, elem) =>{
        const obj = {
                        name : $(elem).find("p").text(),
                        charge : $(elem).find('input').val()
                    }
        array.push(JSON.stringify(obj));
    });
    $("[name=items]").val(JSON.stringify(array));
}

function dataListContainsOption(datalist, potentialOption){
    for (let i = 0; i < datalist.options.length; i++) {
        if (datalist.options[i].value === potentialOption){
            return true;
        }
    }
}

function constraintsRespected(){
    const min = parseInt($("[name=minSelection]").val());
    const max = parseInt($("[name=maxSelection]").val());
    const selected = $("#selectedGroups li").length;
    if ( min > selected) {
        alert ("The number of minimum selections shouldn't be over the available number of items.");
        return false;
    }
    if ( max > selected) {
        alert ("The number of max selections shouldn't be over the available number of items.");
        return false;
    }
    if ( min > max) {
        alert ("The number of min selections shouldn't be over the max number of selections.");
        return false;
    }
    return true;
}

function sendPutRequest(form){
    $.ajax('/group',
{ method: 'PUT',
         data : form.serializeArray(),
        success : handleAPIResponse,
    })
}

function deleteGroup(form) {
    $.ajax('/group',
{ method: 'DELETE',
         data : form.serializeArray(),
        success : handleAPIResponse,
    })
}

function handleAPIResponse(response) {
    if(response.status){
        window.open('/my_store','_parent')
    } else {
        alert(response.msg);
    }
}
