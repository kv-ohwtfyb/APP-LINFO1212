$(document).ready(function () {

    const priceInput = $("#item-price");
    const promoPercentage = $("#promotion");
    const form = $('#form');
    const categorySearchInput = $('#choose-category');
    const groupSearchInput = $('#choose-group');
    const groupHoverMenu = $('#groupHoverDropDownMenu');
    const categoryHoverMenu = $('#categoryHoverDropDownMenu');

    updateFinalPrice(priceInput, promoPercentage);

    categorySearchInput.keypress(() => {
        getListOfCategories(categorySearchInput.val());
    })
    categorySearchInput.on('focus', () =>{
        categoryHoverMenu.show(1000);
    })
    categorySearchInput.on('focusout', () =>{
        categoryHoverMenu.hide(1000);
    })
    categoryHoverMenu.on('click', (event) =>{
        clickedOnCategoryProposeItem(event);
    })

    priceInput.change(()=>{
        updateFinalPrice(priceInput, promoPercentage);
    });
    promoPercentage.change(()=>{
        updateFinalPrice(priceInput, promoPercentage);
    });

    groupSearchInput.keypress(() => {
        getListOfGroups(groupSearchInput.val())
    })
    groupSearchInput.on('focus', () => {
        groupHoverMenu.show(1000);
    })
    groupSearchInput.on('focusout', () => {
        groupHoverMenu.hide(1000);
    })

    groupHoverMenu.on('click', (event) =>{
        clickedOnGroupProposeItem(event);
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
        $('<input>').attr({
            name : 'categories',
            value : $("#selectedCategories").serializeArray(),
            type : hidden,
        }).appendTo(form);
        $('<input>').attr({
            name : 'groups',
            value : $("#selectedGroups").serializeArray(),
            type : hidden,
        }).appendTo(form);
    })

});

/**
 * Adds the array of names to the group search hover proposal menu for the user to select from.
 * @param array [(String)]
 */
function updateGroupSearch(array){
    const HoverMenu = $("#groupHoverDropDownMenu");
    HoverMenu.html("");
    array.forEach((groupName) =>{
        HoverMenu.append(`<li>${groupName}</li>`);
    });
}

/**
 * Adds the array of names to the category search hover proposal menu for the user to select from.
 * @param array [(String)]
 */
function updateCategorySearch(array){
    const HoverMenu = $("#categoryHoverDropDownMenu");
    HoverMenu.html("");
    array.forEach((categoryName) =>{
        HoverMenu.append(`<li>${categoryName}</li>`);
    });
}

/**
 * Rounds a float to 2 decimals after the point.
 * @param num
 * @return {number}
 */
function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

/**
 * Adds the selected groupName of the hoverProposeMenu
 * to the list pf the selected groups
 * @param event (JQuery event)
 */
function clickedOnGroupProposeItem(event){
    const groupName = $(event.target).closest("li").text();
    let listItemGeneric = `
        <li class="row-display margin-top-bottom">
            <div class="item row-display bg-color-black color-white round-border">
                <p>${groupName}</p>
                <button class="itemRemove bg-color-black color-white border-less" type="button">X</button>
            </div>
        </li>
    `
    $('#selectedGroups').append(listItemGeneric);
}

/**
 * Adds the selected groupName of the hoverProposeMenu
 * to the list pf the selected groups
 * @param event (JQuery event)
 */
function clickedOnCategoryProposeItem(event){
    const categoryName = $(event.target).closest("li").text();
    let listItemGeneric = `
        <li class="row-display margin-top-bottom">
            <div class="item row-display bg-color-black color-white round-border">
                <p>${categoryName}</p>
                <button class="itemRemove bg-color-black color-white border-less" type="button">X</button>
            </div>
        </li>
    `
    $('#selectedCategories').append(listItemGeneric);
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
    {   method  : 'delete',
                data    : form.serialize(),
                success : function (response) {
                    console.log(response);
                }
            }
        );
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

function getListOfCategories(string){
    $.ajax('/getCategories',
        {   method: 'GET',
            data : { search : string },
            success : function (response) {
                if (response.status){ updateCategorySearch(response.result); }
                else { alert(response.msg); }
            }
        }
    )
}