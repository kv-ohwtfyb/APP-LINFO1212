$(document).ready(function () {

    const priceInput = $("#item-price");
    const promoPercentage = $("#promotion");
    const form = $('#form'); form.validate();
    const categorySearchInput = $('#choose-category');
    const groupSearchInput = $('#choose-group');

    updateFinalPrice(priceInput, promoPercentage);

    categorySearchInput.on('change', (event) => {
        updateSelectedCategories(event, categorySearchInput);
    });
    categorySearchInput.on('focusout', (event) => {
        updateSelectedCategories(event, categorySearchInput);
    });

    priceInput.change(()=>{
        updateFinalPrice(priceInput, promoPercentage);
    });
    promoPercentage.change(()=>{
        updateFinalPrice(priceInput, promoPercentage);
    });


    groupSearchInput.on('change', (event) => {
        updateSelectedGroups(event, groupSearchInput);
    })
    groupSearchInput.on('focusout', (event) => {
        updateSelectedGroups(event, groupSearchInput);
    })

    $('#list-of-groups').on('click', (event) =>{
        updateSelectedGroups(event);
    })

    /* This is the event for removing a selected item but I had to bind the vent to the parent cause the
        children are dynamically added.
     */
    $('ul').on('click', (event)=>{
        removeItemFilter(event);
    });

    $('#deleteButton').on('click', ()=>{
        deleteItem(form);
    })

    form.on('submit', () => {
        addTheSelectedGroupsAndCategories();
    })

    $(".hover-img").hover(() =>{
        $(".hover-img").hide(1000);
    })

    if(("img").length >= 0){
        $(".filepond--drop-label label").text("IF YOU WANT TO CHANGE THE DISPLAYED IMAGE..." +
        "DRAG & DROP YOUR NEW PHOTO");
    }

    $("#update-item").on('click', () =>{
        if(!($(':radio').valid())) { alert("Please precise if sold alone or not"); }
        else{
            addTheSelectedGroupsAndCategories();
            sendPutRequest(form);
        }
    })
});


/**
 * Rounds a float to 2 decimals after the point.
 * @param num
 * @return {number}
 */
function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

/**
 * Adds the selected groupName
 * to the list pf the selected groups
 * @param event (JQuery event)
 * @param groupSearchInput
 */
function updateSelectedGroups(event, groupSearchInput){
    const validation = dataListContainsOption(document.getElementById('list-of-categories'), groupSearchInput.val());
    if (validation) {
        let listItemGeneric = `
            <li class="row-display margin-top-bottom">
                <div class="item row-display bg-color-black color-white round-border">
                    <p>${groupSearchInput.val()}</p>
                    <button class="itemRemove bg-color-black color-white border-less" type="button">X</button>
                </div>
            </li>
        `
        $('#selectedGroups').append(listItemGeneric);
    }
    groupSearchInput.val("");
}

/**
 * Adds the selected groupName
 * to the list pf the selected groups
 * @param event (JQuery event)
 * @param categorySearchInput
 */
function updateSelectedCategories(event, categorySearchInput){
    const validation = dataListContainsOption(document.getElementById('list-of-categories'), categorySearchInput.val());
    if (validation){
        let listItemGeneric = `
            <li class="row-display margin-top-bottom">
                <div class="item row-display bg-color-black color-white round-border">
                    <p>${categorySearchInput.val()}</p>
                    <button class="itemRemove bg-color-black color-white border-less" type="button">X</button>
                </div>
            </li>
        `
        $('#selectedCategories').append(listItemGeneric);
    }
    categorySearchInput.val("");
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

function updateFinalPrice(priceInput, promoPercentage){
    if (parseFloat(promoPercentage.val()) > 0){
        $("#final-price").html(roundTo2Decimals(parseFloat(priceInput.val()) * (1 - (parseFloat(promoPercentage.val())/100))).toString());
    }
    else{
        $("#final-price").html(priceInput.val());
    }
}

function deleteItem(form){
    $.ajax('/item',
    {   method  : 'DELETE',
                data    : form.serialize(),
                success : handleAPIResponse
            }
        );
}

function dataListContainsOption(datalist, potentialOption){
    for (let i = 0; i < datalist.options.length; i++) {
        if (datalist.options[i].value === potentialOption){
            return true;
        }
    }
}

function addTheSelectedGroupsAndCategories() {
    $('[name=groups]').val($('#selectedGroups').map((idx, el) => {
        if ($(el).find('p').text().length > 0) return $(el).find('p').text()+"|";
        else return "";
    }).get())
    $('[name=categories]').val($('#selectedCategories').map((idx, el) => {
        if ($(el).find('p').text().length > 0) return $(el).find('p').text()+"|";
        else return ";"
    }).get())
}

function sendPutRequest(form){
    $.ajax('/item',
{ method: 'PUT',
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